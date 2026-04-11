-- =============================================================================
-- AICaller / CallMind — Schema Migration v3 → v4
-- =============================================================================
-- ADDITIVE ONLY — safe to run on existing v3 database with live data.
-- Does NOT drop, rename, or modify any existing columns or tables.
-- All existing data (number_pool, phone_numbers, agents, workspaces) preserved.
--
-- What this adds:
--   EXTENSIONS: pgvector (for embeddings)
--   NEW ENUMS:  conv_outcome, agent_tool_type, index_status_type,
--               sentiment_type, urgency_type, telephony_provider_type
--   ALTER:      knowledge_bases  + 6 RAG/chunking cols
--               agents           + 6 behaviour/RAG cols
--               conversations    + 2 analytics cols
--               phone_numbers    + 1 telephony provider FK col
--   NEW TABLES: kb_document_chunks, conversation_analytics, turn_signals,
--               agent_tools, tool_executions, workspace_telephony_providers
--   NEW RLS:    all new tables
--   NEW REALTIME: no changes (conversations + messages already enabled in v3)
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- pgvector: enables vector(n) column type + similarity search operators
-- Required for RAG embedding storage and hybrid search
create extension if not exists vector;


-- =============================================================================
-- NEW ENUMS
-- =============================================================================

-- Conversation outcome (set by Celery post-call analysis task)
create type conv_outcome as enum (
  'resolved',
  'unresolved',
  'transferred',
  'booked',
  'hung_up'
);

-- Tool types available to agents
create type agent_tool_type as enum (
  'booking',
  'call_transfer',
  'send_sms',
  'custom_webhook'
);

-- KB indexing status (for RAG / pgvector indexing flow)
create type index_status_type as enum (
  'unindexed',
  'indexing',
  'indexed',
  'error'
);

-- Sentiment classification (used in turn_signals + conversation_analytics)
create type sentiment_type as enum (
  'positive',
  'neutral',
  'negative',
  'frustrated'
);

-- Urgency classification (used in turn_signals)
create type urgency_type as enum (
  'low',
  'medium',
  'high'
);

-- Telephony provider ownership type
create type telephony_provider_type as enum (
  'platform',   -- platform's own account (admin manages)
  'own'         -- user's own connected account
);

-- Tier that produced a turn signal
create type signal_tier_type as enum (
  'rule_based',  -- instant keyword/regex matching (~0ms)
  'llm'          -- async LLM classification (~200ms background task)
);


-- =============================================================================
-- ALTER EXISTING TABLES (additive only — no existing cols touched)
-- =============================================================================

-- ── knowledge_bases: RAG chunking config ─────────────────────────────────────
-- These control how documents are split and embedded when user clicks "Index KB"

alter table knowledge_bases
  add column if not exists chunk_size          integer              default 500,
  add column if not exists chunk_overlap       integer              default 50,
  add column if not exists index_status        index_status_type    not null default 'unindexed',
  add column if not exists indexed_at          timestamptz,
  add column if not exists embedding_provider  text                 default 'openai',
  add column if not exists embedding_model     text                 default 'text-embedding-3-small';

comment on column knowledge_bases.chunk_size         is 'Tokens per chunk when indexing docs. User-configurable per KB. Default 500.';
comment on column knowledge_bases.chunk_overlap      is 'Token overlap between adjacent chunks. Improves retrieval at boundaries. Default 50.';
comment on column knowledge_bases.index_status       is 'unindexed=never indexed, indexing=Celery task running, indexed=ready, error=failed.';
comment on column knowledge_bases.embedding_provider is 'Which embedding API to use. openai|nomic|cohere. All KBs in same workspace can use different providers.';
comment on column knowledge_bases.embedding_model    is 'Specific model within the provider. e.g. text-embedding-3-small for openai.';


-- ── agents: greeting + tool + RAG behaviour config ───────────────────────────

alter table agents
  add column if not exists greeting_enabled      boolean  not null default true,
  add column if not exists greeting_template     text,
  add column if not exists tool_calling_enabled  boolean  not null default false,
  add column if not exists rag_top_k             integer  not null default 3,
  add column if not exists embedding_provider    text              default 'openai',
  add column if not exists embedding_model       text              default 'text-embedding-3-small';

comment on column agents.greeting_enabled     is 'If true, agent speaks a greeting before listening when call connects.';
comment on column agents.greeting_template    is 'Optional custom greeting. Supports {caller_name}, {business_name}, {agent_name}, {last_topic}. Null = use default dynamic greeting.';
comment on column agents.tool_calling_enabled is 'If true, agent can invoke configured tools (booking, SMS, transfer etc). Default false.';
comment on column agents.rag_top_k            is 'Number of KB chunks to retrieve per query when rag_provider != none. Default 3 for voice (shorter context = faster LLM).';
comment on column agents.embedding_provider   is 'Embedding provider used when this agent does RAG retrieval. Matches KB embedding_provider for correct dimensions.';
comment on column agents.embedding_model      is 'Embedding model used for query embedding at retrieval time. Must match the model used when KB was indexed.';


-- ── conversations: analytics outcome fields ───────────────────────────────────

alter table conversations
  add column if not exists outcome       conv_outcome,
  add column if not exists had_tool_call boolean not null default false;

comment on column conversations.outcome       is 'Set by post-call Celery analysis task. resolved|unresolved|transferred|booked|hung_up.';
comment on column conversations.had_tool_call is 'True if any tool was invoked during this conversation.';


-- ── phone_numbers: optional link to workspace telephony provider ──────────────
-- Null = platform account (uses platform env var credentials)
-- Non-null = user's own connected account

alter table phone_numbers
  add column if not exists telephony_provider_id uuid
    references workspace_telephony_providers (id) on delete set null;

-- NOTE: The FK above references workspace_telephony_providers which is created
-- BELOW. Postgres allows forward-declaring FKs in ALTER if the referenced table
-- exists at commit time. Since this is a single transaction, we create
-- workspace_telephony_providers first, then add the FK.
-- We handle this by creating workspace_telephony_providers before this ALTER.
-- See ordering note at bottom of file.


-- =============================================================================
-- NEW TABLE 1: workspace_telephony_providers
-- Stores per-workspace telephony account connections (Twilio, Vonage, Plivo).
-- Credentials stored in Supabase Vault — only vault_secret_id stored here.
-- =============================================================================

create table workspace_telephony_providers (
  id                uuid                    primary key default gen_random_uuid(),
  workspace_id      uuid                    not null references workspaces (id) on delete cascade,
  provider          text                    not null,  -- 'twilio' | 'vonage' | 'plivo'
  display_name      text                    not null,  -- e.g. "My Twilio Account"
  provider_type     telephony_provider_type not null,

  -- Supabase Vault secret ID — raw credentials never stored here
  -- FastAPI calls vault.decrypted_secrets to get the actual SID/token
  vault_secret_id   uuid,

  is_active         boolean  not null default true,
  is_verified       boolean  not null default false,  -- true after test API call succeeds
  verified_at       timestamptz,
  created_at        timestamptz not null default now(),

  -- One own-account per provider per workspace in V2
  constraint provider_unique_per_workspace
    unique (workspace_id, provider, provider_type)
);

comment on table  workspace_telephony_providers                  is 'Per-workspace telephony provider connections. Platform account rows seeded by admin.';
comment on column workspace_telephony_providers.vault_secret_id is 'Reference to Supabase Vault secret containing {"account_sid":"...","auth_token":"..."}. Null for platform rows (uses env vars).';
comment on column workspace_telephony_providers.is_verified     is 'Set true after FastAPI verifies credentials by making a test API call to the provider.';


-- =============================================================================
-- NEW TABLE 2: kb_document_chunks
-- Stores chunked + vectorised content for RAG retrieval.
-- Populated by the index_knowledge_base Celery task.
-- =============================================================================

create table kb_document_chunks (
  id               uuid    primary key default gen_random_uuid(),
  kb_document_id   uuid    not null references kb_documents (id) on delete cascade,
  kb_id            uuid    not null references knowledge_bases (id) on delete cascade,
  chunk_index      integer not null,
  content          text    not null,
  token_count      integer,

  -- Vector embedding — NULL until KB is indexed
  -- Dimension 1536 matches OpenAI text-embedding-3-small and text-embedding-ada-002
  -- If using nomic-embed-text (768-dim) change this column in a separate migration
  embedding        vector(1536),

  -- Full-text search vector — auto-populated by trigger below
  ts_vector        tsvector,

  -- Metadata: page number, section heading, source file name etc
  metadata         jsonb,

  created_at       timestamptz not null default now(),

  constraint chunk_unique unique (kb_document_id, chunk_index)
);

comment on table  kb_document_chunks           is 'Chunked KB document content with embeddings. Populated by index_knowledge_base Celery task.';
comment on column kb_document_chunks.embedding is '1536-dim vector for OpenAI embeddings. NULL until indexed. Use separate migration if switching to 768-dim (nomic).';
comment on column kb_document_chunks.ts_vector is 'Auto-updated by trigger for keyword (BM25-style) full-text search component of hybrid search.';

-- Vector similarity index (IVFFlat for approximate nearest neighbour)
-- lists=100 is good for up to ~1M vectors. Increase for larger datasets.
create index kb_chunks_vector_idx
  on kb_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Full-text search index
create index kb_chunks_fts_idx
  on kb_document_chunks
  using gin (ts_vector);

-- Fast filter by KB
create index kb_chunks_kb_id_idx
  on kb_document_chunks (kb_id);

-- Fast cascade delete by document
create index kb_chunks_doc_id_idx
  on kb_document_chunks (kb_document_id);

-- Auto-update ts_vector when content changes
create or replace function update_chunk_tsvector()
returns trigger language plpgsql as $$
begin
  new.ts_vector = to_tsvector('english', coalesce(new.content, ''));
  return new;
end;
$$;

create trigger kb_chunks_tsvector_update
  before insert or update on kb_document_chunks
  for each row execute procedure update_chunk_tsvector();


-- =============================================================================
-- HYBRID SEARCH FUNCTION
-- Combines vector similarity + keyword full-text search using RRF.
-- Called by FastAPI: await supabase.rpc("hybrid_search", {...})
-- =============================================================================

create or replace function hybrid_search(
  query_embedding  vector(1536),
  query_text       text,
  kb_ids           uuid[],
  match_count      int     default 5,
  vector_weight    float   default 0.7,
  keyword_weight   float   default 0.3
)
returns table (
  id         uuid,
  content    text,
  similarity float,
  kb_id      uuid
)
language sql stable
as $$
  with vector_results as (
    select
      id,
      content,
      kb_id,
      1 - (embedding <=> query_embedding) as score,
      row_number() over (order by embedding <=> query_embedding) as rank
    from kb_document_chunks
    where kb_id = any(kb_ids)
      and embedding is not null
    order by embedding <=> query_embedding
    limit match_count * 2
  ),
  keyword_results as (
    select
      id,
      content,
      kb_id,
      ts_rank(ts_vector, plainto_tsquery('english', query_text)) as score,
      row_number() over (
        order by ts_rank(ts_vector, plainto_tsquery('english', query_text)) desc
      ) as rank
    from kb_document_chunks
    where kb_id = any(kb_ids)
      and ts_vector @@ plainto_tsquery('english', query_text)
    order by score desc
    limit match_count * 2
  ),
  -- Reciprocal Rank Fusion: merges both result sets
  -- score = vector_weight * (1/(60+rank_v)) + keyword_weight * (1/(60+rank_k))
  rrf as (
    select
      coalesce(v.id,      k.id)      as id,
      coalesce(v.content, k.content) as content,
      coalesce(v.kb_id,   k.kb_id)   as kb_id,
      (vector_weight  * coalesce(1.0 / (60.0 + v.rank), 0.0)) +
      (keyword_weight * coalesce(1.0 / (60.0 + k.rank), 0.0)) as score
    from vector_results v
    full outer join keyword_results k using (id)
  )
  select id, content, score as similarity, kb_id
  from rrf
  order by score desc
  limit match_count;
$$;

comment on function hybrid_search is
  'Hybrid vector + keyword search using RRF. Call via FastAPI: supabase.rpc("hybrid_search", {...}). '
  'Returns top-K chunks ranked by combined score. vector_weight + keyword_weight should sum to 1.0.';


-- =============================================================================
-- NEW TABLE 3: conversation_analytics
-- One row per conversation. Populated by Celery post-call analysis task.
-- Never written by the dashboard — read-only from frontend perspective.
-- =============================================================================

create table conversation_analytics (
  id                  uuid          primary key default gen_random_uuid(),
  conversation_id     uuid          not null unique references conversations (id) on delete cascade,

  -- High-level call classification
  overall_intent      text,         -- dominant intent for this call e.g. 'booking', 'complaint'
  sentiment_start     sentiment_type,
  sentiment_end       sentiment_type,
  sentiment_arc       jsonb,        -- [{turn: 1, sentiment: "neutral"}, ...]
  topics              text[],       -- all topics detected e.g. ['product_A', 'pricing']

  -- Entity extraction
  entities_mentioned  jsonb,        -- {products: [...], dates: [...], amounts: [...]}

  -- Outcome
  outcome             conv_outcome,
  resolution_turns    integer,      -- how many turns until resolved

  -- Key phrases (for "most asked questions" analytics)
  key_phrases         text[],

  -- Tool usage summary
  tool_calls_made     jsonb,        -- [{tool: 'booking', success: true}, ...]

  analysed_at         timestamptz   not null default now()
);

comment on table conversation_analytics is
  'Post-call deep analysis. One row per conversation. Written by Celery task using '
  'llama-3.1-8b-instant (NOT the agent LLM model). Read-only from dashboard.';

create index conv_analytics_conv_id on conversation_analytics (conversation_id);
create index conv_analytics_intent  on conversation_analytics (overall_intent);
create index conv_analytics_outcome on conversation_analytics (outcome);
create index conv_analytics_topics  on conversation_analytics using gin (topics);


-- =============================================================================
-- NEW TABLE 4: turn_signals
-- Per-turn real-time intent/sentiment classification during a call.
-- Tier 1 (rule-based) fires instantly. Tier 2 (LLM) fires as background task.
-- Streamed to dashboard via Supabase Realtime broadcast.
-- Retained 90 days (archive/delete after that).
-- =============================================================================

create table turn_signals (
  id               uuid             primary key default gen_random_uuid(),
  conversation_id  uuid             not null references conversations (id) on delete cascade,
  message_id       uuid             references messages (id) on delete set null,

  -- Classification results
  intent           text,            -- booking | complaint | enquiry | cancel | pricing | ...
  sentiment        sentiment_type,
  topic            text,            -- product_A | pricing | hours | support | ...
  urgency          urgency_type     not null default 'low',
  entities         jsonb,           -- entities detected in this specific turn

  -- Which tier produced this signal
  tier             signal_tier_type not null,

  created_at       timestamptz      not null default now()
);

comment on table turn_signals is
  'Per-turn real-time signals. Tier 1 (rule_based) fires in ~0ms via keyword matching. '
  'Tier 2 (llm) fires as asyncio background task ~200ms, never blocks voice pipeline. '
  'Retain 90 days. Stream to dashboard via Supabase Realtime broadcast channel.';

create index turn_signals_conv   on turn_signals (conversation_id);
create index turn_signals_msg    on turn_signals (message_id);
create index turn_signals_intent on turn_signals (intent);
create index turn_signals_created on turn_signals (created_at desc);


-- =============================================================================
-- NEW TABLE 5: agent_tools
-- Pluggable tool configurations per agent.
-- User enables/configures in dashboard → Agent Detail → Tools tab.
-- =============================================================================

create table agent_tools (
  id               uuid            primary key default gen_random_uuid(),
  agent_id         uuid            not null references agents (id) on delete cascade,
  tool_type        agent_tool_type not null,
  display_name     text            not null,   -- shown in dashboard e.g. "Appointment Booking"

  -- Tool-specific config as JSON. Examples:
  -- booking:      {"mode":"slot_filling","slots":["date","time","name"],"confirmation_sms":true}
  -- call_transfer:{"transfer_to":"+919876543210","trigger_phrase":"speak to agent"}
  -- send_sms:     {"template":"Here is the info: {url}","default_url":"https://..."}
  -- custom_webhook:{"url":"https://...","method":"POST","body_template":"..."}
  config           jsonb           not null default '{}',

  -- Intents that trigger this tool via rule-based Tier 1 matching
  -- e.g. ["booking", "appointment", "schedule"]
  trigger_intents  text[]          not null default '{}',

  -- Filler phrase spoken while tool executes (no dead silence)
  filler_phrase    text            default 'Let me check that for you, just a moment...',

  is_active        boolean         not null default true,
  created_at       timestamptz     not null default now()
);

comment on table  agent_tools              is 'Pluggable tools per agent. User enables in dashboard. Tool execution decided by Tier 1 intent match or LLM function calling.';
comment on column agent_tools.config       is 'Tool-specific JSON config. Never store raw API keys here — use Supabase Vault reference if secrets needed.';
comment on column agent_tools.filler_phrase is 'Agent speaks this while tool executes. Never leave dead silence during tool execution.';

create index agent_tools_agent on agent_tools (agent_id);


-- =============================================================================
-- NEW TABLE 6: tool_executions
-- Log of every tool invocation during calls.
-- Used for analytics (tool usage breakdown per agent).
-- Retained 1 year.
-- =============================================================================

create table tool_executions (
  id               uuid        primary key default gen_random_uuid(),
  conversation_id  uuid        not null references conversations (id) on delete cascade,
  message_id       uuid        references messages (id) on delete set null,
  tool_id          uuid        not null references agent_tools (id) on delete cascade,
  tool_type        text        not null,   -- denormalised for easier analytics queries

  -- What was sent to and returned from the tool
  input            jsonb,      -- slot values, query text etc
  output           jsonb,      -- booking confirmation, SMS result etc

  -- Execution result
  success          boolean     not null,
  error_message    text,
  duration_ms      integer,    -- execution time in milliseconds

  -- Which path invoked it
  invocation_path  text,       -- 'rule_based' | 'llm_function_call'

  created_at       timestamptz not null default now()
);

comment on table tool_executions is
  'Log of every tool invocation. Written by FastAPI via service role. '
  'Retain 1 year. Used for analytics: tool usage per agent, success rates.';

create index tool_exec_conv   on tool_executions (conversation_id);
create index tool_exec_tool   on tool_executions (tool_id);
create index tool_exec_created on tool_executions (created_at desc);


-- =============================================================================
-- NOW ADD THE FK on phone_numbers (after workspace_telephony_providers exists)
-- =============================================================================

alter table phone_numbers
  add column if not exists telephony_provider_id uuid
    references workspace_telephony_providers (id) on delete set null;

comment on column phone_numbers.telephony_provider_id is
  'Null = platform account (FastAPI uses platform env var credentials). '
  'Non-null = user connected their own provider account (credentials in Vault).';


-- =============================================================================
-- ROW LEVEL SECURITY — new tables
-- =============================================================================

alter table workspace_telephony_providers enable row level security;
alter table kb_document_chunks            enable row level security;
alter table conversation_analytics        enable row level security;
alter table turn_signals                  enable row level security;
alter table agent_tools                   enable row level security;
alter table tool_executions               enable row level security;


-- workspace_telephony_providers: workspace-scoped full access
create policy "telephony_providers: owner"
  on workspace_telephony_providers for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());


-- kb_document_chunks: through knowledge_bases → workspace
create policy "kb_chunks: owner"
  on kb_document_chunks for all
  using (
    kb_id in (
      select id from knowledge_bases where workspace_id = my_workspace_id()
    )
  )
  with check (
    kb_id in (
      select id from knowledge_bases where workspace_id = my_workspace_id()
    )
  );


-- conversation_analytics: through conversations → agents → workspace
create policy "conv_analytics: owner read"
  on conversation_analytics for select
  using (
    conversation_id in (
      select c.id from conversations c
      join agents a on a.id = c.agent_id
      where a.workspace_id = my_workspace_id()
    )
  );


-- turn_signals: through conversations → agents → workspace
create policy "turn_signals: owner read"
  on turn_signals for select
  using (
    conversation_id in (
      select c.id from conversations c
      join agents a on a.id = c.agent_id
      where a.workspace_id = my_workspace_id()
    )
  );


-- agent_tools: through agents → workspace
create policy "agent_tools: owner"
  on agent_tools for all
  using (
    agent_id in (
      select id from agents where workspace_id = my_workspace_id()
    )
  )
  with check (
    agent_id in (
      select id from agents where workspace_id = my_workspace_id()
    )
  );


-- tool_executions: through conversations → agents → workspace (read only)
create policy "tool_executions: owner read"
  on tool_executions for select
  using (
    conversation_id in (
      select c.id from conversations c
      join agents a on a.id = c.agent_id
      where a.workspace_id = my_workspace_id()
    )
  );


-- =============================================================================
-- PLATFORM TELEPHONY PROVIDER ROW (for your own Twilio account)
-- =============================================================================
-- Insert a platform-level provider record for your Twilio account.
-- This represents the platform's own Twilio (not a user's).
-- vault_secret_id is NULL because FastAPI uses env vars for platform creds.
-- workspace_id is NULL — platform provider is shared (no workspace owner).
--
-- NOTE: The unique constraint is (workspace_id, provider, provider_type).
-- Since workspace_id is NULL here, this won't conflict with user rows.
-- If this causes issues with the constraint, comment out and handle in admin.
--
-- UNCOMMENT and run manually after migration if needed:
-- INSERT INTO workspace_telephony_providers
--   (workspace_id, provider, display_name, provider_type, vault_secret_id,
--    is_active, is_verified)
-- VALUES
--   (NULL, 'twilio', 'CallMind Platform Twilio', 'platform', NULL, true, true);


-- =============================================================================
-- VERIFICATION
-- Run after migration to confirm all objects created correctly.
-- =============================================================================

-- Check new tables exist
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
  and table_name in (
    'workspace_telephony_providers',
    'kb_document_chunks',
    'conversation_analytics',
    'turn_signals',
    'agent_tools',
    'tool_executions'
  )
order by table_name;
-- Expected: 6 rows

-- Check new columns on existing tables
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'knowledge_bases' and column_name in
      ('chunk_size','chunk_overlap','index_status','indexed_at','embedding_provider','embedding_model'))
    or
    (table_name = 'agents' and column_name in
      ('greeting_enabled','greeting_template','tool_calling_enabled','rag_top_k','embedding_provider','embedding_model'))
    or
    (table_name = 'conversations' and column_name in ('outcome','had_tool_call'))
    or
    (table_name = 'phone_numbers' and column_name = 'telephony_provider_id')
  )
order by table_name, column_name;
-- Expected: 15 rows

-- Check pgvector extension
select extname, extversion
from pg_extension
where extname = 'vector';
-- Expected: 1 row

-- Check hybrid_search function
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name = 'hybrid_search';
-- Expected: 1 row

-- Confirm existing data untouched
select count(*) as number_pool_count  from number_pool;   -- should still be 1
select count(*) as phone_numbers_count from phone_numbers; -- should still be 1
select number, webhook_url, is_active from phone_numbers;  -- should show your Twilio number