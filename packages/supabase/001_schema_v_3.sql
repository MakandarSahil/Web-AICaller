-- =============================================================================
-- AICaller / CallMind — Schema v3 (Fresh, Complete)
-- =============================================================================
-- Run once in Supabase SQL Editor: Dashboard → SQL Editor → New query → Run
--
-- What changed vs v2:
--   + api_keys table (external chatbot API key management)
--   + conversations.visitor_id (external widget cross-session memory)
--   + conversations.summary_edited (user can edit auto-generated summary)
--   + phone_numbers.webhook_url (Twilio webhook URL per number)
--   + number_pool.webhook_configured (track if Twilio webhook is set)
--   + number_pool.assigned_to renamed to keep consistent with workspaces
--   ~ agent_usage trigger owns the increment (not Celery) — no double-count
--   ~ All naming aligned to workspace (not business) throughout
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()


-- =============================================================================
-- ENUMS
-- =============================================================================

create type account_type     as enum ('individual', 'business');
create type workspace_size   as enum ('xs', 'sm', 'md', 'lg', 'xl');
create type workspace_status as enum ('active', 'inactive', 'suspended');
create type agent_status     as enum ('active', 'inactive', 'suspended');
create type kb_doc_type      as enum ('pdf', 'docx', 'txt', 'plain_text');
create type kb_doc_status    as enum ('processing', 'ready', 'error');
create type rag_status_type  as enum ('pending', 'indexed', 'error');
create type number_type      as enum ('platform', 'own');
create type conv_channel     as enum ('twilio', 'text_api', 'websocket');
create type conv_status      as enum ('active', 'completed', 'failed');
create type message_role     as enum ('user', 'assistant');


-- =============================================================================
-- 1. PROFILES
-- Auto-created on auth.users insert via trigger.
-- Supabase Auth owns email + password — never stored here.
-- =============================================================================

create table profiles (
  id            uuid         primary key references auth.users (id) on delete cascade,
  full_name     text,
  phone         text,
  avatar_url    text,
  account_type  account_type not null default 'individual',
  is_admin      boolean      not null default false,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);

comment on table  profiles              is 'Extends auth.users. Auth in Supabase Auth. Auto-created by trigger on signup.';
comment on column profiles.account_type is 'individual or business. Same feature set v1, affects onboarding copy only.';
comment on column profiles.is_admin     is 'Platform admin only. Grants access to number_pool table.';


-- =============================================================================
-- 2. WORKSPACES
-- One per user, auto-created on signup.
-- Neutral name — works for individuals and businesses.
-- =============================================================================

create table workspaces (
  id             uuid             primary key default gen_random_uuid(),
  owner_id       uuid             not null references profiles (id) on delete cascade,
  name           text             not null,       -- display name (personal or brand)
  business_name  text,                            -- optional legal business name
  industry       text,
  website        text,
  size           workspace_size,                  -- team size enum
  status         workspace_status not null default 'active',
  created_at     timestamptz      not null default now(),
  updated_at     timestamptz      not null default now(),

  constraint workspaces_owner_unique unique (owner_id)  -- one workspace per user v1
);

comment on table  workspaces      is 'One per user. Container for agents, KBs, phone numbers, and conversations.';
comment on column workspaces.size is 'xs=solo, sm=2-10, md=11-50, lg=51-200, xl=200+';


-- =============================================================================
-- 3. KNOWLEDGE BASES
-- A workspace can have multiple KBs (e.g. "Product FAQ", "Support Docs").
-- Agents attach to KBs independently.
-- =============================================================================

create table knowledge_bases (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references workspaces (id) on delete cascade,
  name          text        not null,
  description   text,
  rag_kb_id     text,       -- Phase 4: RAGFlow / pgvector collection ID
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column knowledge_bases.rag_kb_id is 'Phase 4: set when KB is indexed into RAGFlow/pgvector. Null until then.';


-- =============================================================================
-- 4. KB DOCUMENTS
-- Files and plain-text entries within a knowledge base.
-- =============================================================================

create table kb_documents (
  id              uuid            primary key default gen_random_uuid(),
  kb_id           uuid            not null references knowledge_bases (id) on delete cascade,
  name            text            not null,
  type            kb_doc_type     not null,
  content         text,           -- populated for plain_text type; extracted for files
  file_path       text,           -- Supabase Storage path for file types
  file_size       integer,        -- bytes
  status          kb_doc_status   not null default 'processing',
  rag_document_id text,           -- Phase 4: set after RAGFlow indexing
  rag_kb_id       text,           -- Phase 4: RAGFlow KB this doc belongs to
  rag_status      rag_status_type not null default 'pending',
  created_at      timestamptz     not null default now(),
  updated_at      timestamptz     not null default now(),

  -- plain_text requires content; file types require a storage path
  constraint kb_doc_content_or_path check (
    (type = 'plain_text' and content is not null) or
    (type != 'plain_text' and file_path is not null)
  )
);

comment on column kb_documents.content         is 'For plain_text: stored here. For files: extracted text after processing.';
comment on column kb_documents.rag_document_id is 'Phase 4: set by Celery task after RAGFlow/pgvector indexing.';
comment on column kb_documents.rag_status      is 'pending=not yet indexed, indexed=ready for RAG, error=indexing failed.';


-- =============================================================================
-- 5. AGENTS
-- Multiple agents per workspace. Each has its own LLM/STT/TTS config.
-- =============================================================================

create table agents (
  id            uuid         primary key default gen_random_uuid(),
  workspace_id  uuid         not null references workspaces (id) on delete cascade,
  name          text         not null,
  persona       text,        -- short description shown in dashboard
  system_prompt text,        -- full LLM behaviour instructions
  -- STT config
  stt_provider  text         not null default 'azure',
  stt_model     text         not null default 'default',
  -- TTS config
  tts_provider  text         not null default 'azure',
  tts_model     text         not null default 'default',
  tts_voice     text         not null default 'en-IN-PrabhatNeural',
  -- LLM config
  llm_provider  text         not null default 'groq',
  llm_model     text         not null default 'llama-3.3-70b-versatile',
  -- RAG config (INTERNAL ONLY — never expose in UI)
  rag_provider  text         not null default 'none',
  -- Status
  status        agent_status not null default 'active',
  is_default    boolean      not null default false,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now()
);

comment on column agents.rag_provider  is 'INTERNAL ONLY. none=full-context dump (v1), ragflow/pgvector=Phase 4. Never expose in dashboard UI.';
comment on column agents.is_default    is 'Auto-created on signup. Frontend should prevent deleting the last agent.';
comment on column agents.stt_provider  is 'v1: azure only. Schema is provider-agnostic for future extensibility.';
comment on column agents.llm_provider  is 'v1: groq only. Swap to ragflow/pgvector in Phase 4 — no schema change needed.';


-- =============================================================================
-- 6. AGENT ↔ KB JOIN TABLE
-- Many-to-many. Agents can have multiple KBs, KBs can be shared across agents.
-- =============================================================================

create table agent_knowledge_bases (
  id          uuid        primary key default gen_random_uuid(),
  agent_id    uuid        not null references agents (id) on delete cascade,
  kb_id       uuid        not null references knowledge_bases (id) on delete cascade,
  attached_at timestamptz not null default now(),

  constraint agent_kb_unique unique (agent_id, kb_id)
);


-- =============================================================================
-- 7. NUMBER POOL
-- Platform-managed Twilio numbers. Admin only.
-- Users never see this table — they see phone_numbers.
-- =============================================================================

create table number_pool (
  id                  uuid        primary key default gen_random_uuid(),
  number              text        not null unique,   -- E.164 e.g. +919876543210
  provider            text        not null default 'twilio',
  provider_sid        text,                          -- Twilio PhoneSid
  is_assigned         boolean     not null default false,
  assigned_to         uuid        references workspaces (id) on delete set null,
  webhook_configured  boolean     not null default false,  -- true once webhook URL is set on Twilio
  created_at          timestamptz not null default now()
);

comment on table  number_pool                    is 'Platform number inventory. Admin buys Twilio numbers → adds here. Users never see this.';
comment on column number_pool.webhook_configured is 'Set true after admin configures the Twilio webhook URL for this number.';


-- =============================================================================
-- 8. PHONE NUMBERS
-- Numbers actively assigned to workspace agents.
-- FastAPI reads this on every inbound call to identify the agent.
-- =============================================================================

create table phone_numbers (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references workspaces (id) on delete cascade,
  agent_id      uuid        not null references agents (id) on delete cascade,
  number        text        not null,
  number_type   number_type not null,              -- platform (ours) or own (theirs)
  provider      text        not null default 'twilio',
  provider_sid  text,
  webhook_url   text,                              -- URL set on Twilio: /voice?agent_id=X
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now()
);

comment on column phone_numbers.webhook_url  is 'The URL configured on Twilio: https://api.iamspiderman.me/voice?agent_id={agent_id}';
comment on column phone_numbers.number_type  is 'platform = from our number_pool. own = user brought their own Twilio number.';

select * from phone_numbers
-- =============================================================================
-- 9. CALLERS
-- Identifies returning callers by phone number, scoped per workspace.
-- Same person calling two workspaces = two separate rows.
-- =============================================================================

create table callers (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references workspaces (id) on delete cascade,
  phone_number  text        not null,              -- E.164 format
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  call_count    integer     not null default 0,

  constraint callers_workspace_phone_unique unique (workspace_id, phone_number)
);

comment on column callers.phone_number is 'E.164 format e.g. +919876543210. Set from Twilio caller ID.';
comment on table  callers              is 'One row per unique caller per workspace. Updated on each call completion via trigger.';


-- =============================================================================
-- 10. CONVERSATIONS
-- One row per call or text session.
-- Created with status=active at start, updated to completed at end.
-- =============================================================================

create table conversations (
  id              uuid         primary key default gen_random_uuid(),
  agent_id        uuid         not null references agents (id) on delete cascade,
  caller_id       uuid         references callers (id) on delete set null,
  session_id      text         not null,           -- Twilio CallSid or UUID for text sessions
  channel         conv_channel not null,           -- twilio | text_api | websocket
  status          conv_status  not null default 'active',
  visitor_id      text,                            -- optional: external widget visitor identifier
  kb_snapshot_ids uuid[]       not null default '{}',  -- KBs attached at conversation start
  summary         text,                            -- LLM-generated after call ends (Celery task)
  summary_edited  boolean      not null default false, -- true if user manually edited the summary
  message_count   integer      not null default 0,     -- auto-incremented by trigger on message insert
  started_at      timestamptz  not null default now(),
  ended_at        timestamptz                      -- set on status → completed
);

comment on column conversations.session_id      is 'Twilio CallSid for voice calls. Generated UUID for text_api sessions.';
comment on column conversations.visitor_id      is 'Optional stable ID from external chatbot widget (e.g. UUID in localStorage). Enables cross-session memory.';
comment on column conversations.kb_snapshot_ids is 'KB IDs attached to this agent at call time. Snapshot so history is accurate even if KB config changes.';
comment on column conversations.summary         is 'Auto-generated by Groq via Celery after call ends. Editable by workspace owner.';
comment on column conversations.summary_edited  is 'True if workspace owner has manually edited the auto-generated summary.';


-- =============================================================================
-- 11. MESSAGES
-- Every turn in a conversation. Full transcript.
-- =============================================================================

create table messages (
  id               uuid         primary key default gen_random_uuid(),
  conversation_id  uuid         not null references conversations (id) on delete cascade,
  role             message_role not null,   -- user | assistant
  content          text         not null,
  created_at       timestamptz  not null default now()
);


-- =============================================================================
-- 12. AGENT USAGE STATS
-- Aggregated per agent. Updated by DB trigger on conversation complete.
-- One row per agent — upserted, never inserted twice.
-- =============================================================================

create table agent_usage (
  id              uuid        primary key default gen_random_uuid(),
  agent_id        uuid        not null unique references agents (id) on delete cascade,
  total_calls     integer     not null default 0,
  total_messages  integer     not null default 0,
  last_active_at  timestamptz
);

comment on table agent_usage is 'Aggregated stats per agent. Avoids expensive COUNT(*) on dashboard load. Updated atomically by DB trigger.';


-- =============================================================================
-- 13. API KEYS
-- External developer API keys for chatbot integrations.
-- Raw key shown once, never stored — only SHA-256 hash kept.
-- =============================================================================

create table api_keys (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references workspaces (id) on delete cascade,
  name          text        not null,          -- e.g. "Website chatbot", "iOS app"
  key_hash      text        not null unique,   -- sha256(raw_key) — raw key never stored
  key_prefix    text        not null,          -- first 16 chars shown in dashboard e.g. cm_live_a1b2c3d4
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  created_by    uuid        references profiles (id) on delete set null
);

comment on table  api_keys           is 'API keys for external chatbot integrations. Raw key shown once on creation, only SHA-256 hash stored.';
comment on column api_keys.key_hash  is 'SHA-256 hash of the raw key. Never store the raw key. If this table leaks, keys cannot be recovered.';
comment on column api_keys.key_prefix is 'First 16 chars of the raw key (e.g. cm_live_a1b2c3d4). Shown in dashboard so user can identify which key is which.';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- workspaces
create index idx_workspaces_owner       on workspaces (owner_id);
create index idx_workspaces_status      on workspaces (status);

-- knowledge bases
create index idx_kb_workspace           on knowledge_bases (workspace_id);

-- kb documents
create index idx_kb_docs_kb             on kb_documents (kb_id);
create index idx_kb_docs_status         on kb_documents (status);
create index idx_kb_docs_rag_status     on kb_documents (rag_status);

-- agents
create index idx_agents_workspace       on agents (workspace_id);
create index idx_agents_status          on agents (status);

-- agent_knowledge_bases
create index idx_agent_kb_agent         on agent_knowledge_bases (agent_id);
create index idx_agent_kb_kb            on agent_knowledge_bases (kb_id);

-- phone numbers
create index idx_phone_workspace        on phone_numbers (workspace_id);
create index idx_phone_agent            on phone_numbers (agent_id);
create index idx_phone_number           on phone_numbers (number);

-- number pool
create index idx_number_pool_assigned   on number_pool (is_assigned);


-- callers
create index idx_callers_workspace      on callers (workspace_id);
create index idx_callers_phone          on callers (phone_number);

-- conversations
create index idx_conv_agent             on conversations (agent_id);
create index idx_conv_caller            on conversations (caller_id);
create index idx_conv_session           on conversations (session_id);
create index idx_conv_status            on conversations (status);
create index idx_conv_started           on conversations (started_at desc);
create index idx_conv_visitor           on conversations (visitor_id);  -- widget cross-session lookup
create index idx_conv_kb_snapshot       on conversations using gin (kb_snapshot_ids);

-- messages
create index idx_messages_conv          on messages (conversation_id);
create index idx_messages_created       on messages (created_at asc);

-- api_keys
create index idx_api_keys_workspace     on api_keys (workspace_id);
create index idx_api_keys_hash          on api_keys (key_hash);  -- auth lookup on every request


-- =============================================================================
-- HELPER FUNCTION
-- Used by all RLS policies. Returns the workspace_id of the logged-in user.
-- security definer runs as the function owner (postgres) — safe.
-- =============================================================================

create or replace function my_workspace_id()
returns uuid language sql stable security definer as $$
  select id from workspaces where owner_id = auth.uid() limit 1;
$$;


-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- ── 1. Auto-create profile + workspace + default agent on signup ──────────────
create or replace function handle_new_user()
returns trigger language plpgsql
security definer set search_path = public
as $$
declare
  new_workspace_id  uuid;
  new_agent_id      uuid;
  display_name      text;
begin
  -- Use full_name from metadata, fall back to email prefix
  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  insert into profiles (id, full_name)
  values (new.id, display_name);

  insert into workspaces (owner_id, name)
  values (new.id, display_name)
  returning id into new_workspace_id;

  insert into agents (
    workspace_id, name, persona, system_prompt, is_default
  ) values (
    new_workspace_id,
    'Default Agent',
    'A helpful and professional AI assistant.',
    'You are a helpful, professional AI voice assistant. Answer questions clearly and concisely. Keep responses under 30 seconds when spoken aloud.',
    true
  ) returning id into new_agent_id;

  -- Seed agent_usage row so dashboard always has a row to read
  insert into agent_usage (agent_id) values (new_agent_id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ── 2. Auto-increment message_count on conversations ─────────────────────────
create or replace function increment_message_count()
returns trigger language plpgsql as $$
begin
  update conversations
  set message_count = message_count + 1
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_inserted
  after insert on messages
  for each row execute procedure increment_message_count();


-- ── 3. Update agent_usage + callers when conversation completes ───────────────
-- NOTE: This trigger owns agent_usage increments.
-- The Celery task in FastAPI does NOT increment agent_usage — it only
-- inserts messages and updates the summary. This avoids double-counting.
create or replace function update_on_conversation_complete()
returns trigger language plpgsql as $$
begin
  if new.status = 'completed' and old.status != 'completed' then

    -- Atomically increment agent usage stats
    insert into agent_usage (agent_id, total_calls, total_messages, last_active_at)
    values (new.agent_id, 1, new.message_count, now())
    on conflict (agent_id) do update
      set total_calls    = agent_usage.total_calls + 1,
          total_messages = agent_usage.total_messages + new.message_count,
          last_active_at = now();

    -- Update caller stats (voice calls only — caller_id is null for text sessions)
    if new.caller_id is not null then
      update callers
      set last_seen_at = now(),
          call_count   = call_count + 1
      where id = new.caller_id;
    end if;

  end if;
  return new;
end;
$$;

create trigger on_conversation_completed
  after update on conversations
  for each row execute procedure update_on_conversation_complete();


-- ── 4. Auto-create agent_usage row on new agent ──────────────────────────────
create or replace function handle_new_agent()
returns trigger language plpgsql as $$
begin
  insert into agent_usage (agent_id)
  values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_agent_created
  after insert on agents
  for each row execute procedure handle_new_agent();


-- ── 5. Auto-set updated_at ───────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at       before update on profiles        for each row execute procedure set_updated_at();
create trigger workspaces_updated_at     before update on workspaces      for each row execute procedure set_updated_at();
create trigger agents_updated_at         before update on agents          for each row execute procedure set_updated_at();
create trigger kb_docs_updated_at        before update on kb_documents    for each row execute procedure set_updated_at();
create trigger knowledge_bases_updated_at before update on knowledge_bases for each row execute procedure set_updated_at();


-- =============================================================================
-- ROW LEVEL SECURITY
-- All tables scoped to the authenticated user's workspace.
-- FastAPI uses service_role key — bypasses all RLS entirely.
-- =============================================================================

alter table profiles              enable row level security;
alter table workspaces            enable row level security;
alter table knowledge_bases       enable row level security;
alter table kb_documents          enable row level security;
alter table agents                enable row level security;
alter table agent_knowledge_bases enable row level security;
alter table number_pool           enable row level security;
alter table phone_numbers         enable row level security;
alter table callers               enable row level security;
alter table conversations         enable row level security;
alter table messages              enable row level security;
alter table agent_usage           enable row level security;
alter table api_keys              enable row level security;


-- profiles: own row only
create policy "profiles: view own"   on profiles for select using (id = auth.uid());
create policy "profiles: update own" on profiles for update using (id = auth.uid());

-- workspaces: own workspace only
create policy "workspaces: view own"   on workspaces for select using (owner_id = auth.uid());
create policy "workspaces: update own" on workspaces for update using (owner_id = auth.uid());

-- knowledge_bases: workspace-scoped
create policy "knowledge_bases: owner" on knowledge_bases for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());

-- kb_documents: through knowledge_bases → workspace
create policy "kb_documents: owner" on kb_documents for all
  using (
    kb_id in (select id from knowledge_bases where workspace_id = my_workspace_id())
  )
  with check (
    kb_id in (select id from knowledge_bases where workspace_id = my_workspace_id())
  );

-- agents: workspace-scoped
create policy "agents: owner" on agents for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());

-- agent_knowledge_bases: through agents → workspace
create policy "agent_knowledge_bases: owner" on agent_knowledge_bases for all
  using (
    agent_id in (select id from agents where workspace_id = my_workspace_id())
  )
  with check (
    agent_id in (select id from agents where workspace_id = my_workspace_id())
  );

-- number_pool: admin only — regular users never see this table
create policy "number_pool: admin only" on number_pool for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- phone_numbers: workspace-scoped
create policy "phone_numbers: owner" on phone_numbers for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());

-- callers: workspace-scoped
create policy "callers: owner" on callers for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());

-- conversations: through agents → workspace
create policy "conversations: owner" on conversations for all
  using (
    agent_id in (select id from agents where workspace_id = my_workspace_id())
  )
  with check (
    agent_id in (select id from agents where workspace_id = my_workspace_id())
  );

-- messages: through conversations → agents → workspace
create policy "messages: owner" on messages for all
  using (
    conversation_id in (
      select c.id from conversations c
      join agents a on a.id = c.agent_id
      where a.workspace_id = my_workspace_id()
    )
  )
  with check (
    conversation_id in (
      select c.id from conversations c
      join agents a on a.id = c.agent_id
      where a.workspace_id = my_workspace_id()
    )
  );

-- agent_usage: read-only for workspace owner (FastAPI writes via service role)
create policy "agent_usage: owner read" on agent_usage for select
  using (
    agent_id in (select id from agents where workspace_id = my_workspace_id())
  );

-- api_keys: workspace-scoped, full CRUD for owner
-- FastAPI also writes these via service role (bypasses RLS)
create policy "api_keys: owner" on api_keys for all
  using (workspace_id = my_workspace_id())
  with check (workspace_id = my_workspace_id());


-- =============================================================================
-- REALTIME
-- Enable Postgres changes for tables the dashboard subscribes to live.
-- Dashboard uses supabase-js .channel() to listen for inserts/updates.
-- =============================================================================

-- Enable realtime on conversations (live call status: active → completed)
alter publication supabase_realtime add table conversations;

-- Enable realtime on messages (live transcript / chat feed during a call)
alter publication supabase_realtime add table messages;


-- =============================================================================
-- STORAGE BUCKETS
-- Run these in Supabase Dashboard → Storage → New bucket
-- OR run via the Supabase CLI / management API.
-- SQL Editor cannot create storage buckets directly.
--
-- Bucket 1: knowledge-bases
--   Private. Max file size: 50MB. Allowed types: PDF, DOCX, TXT.
--   Path pattern: {workspace_id}/{kb_id}/{document_id}_{filename}
--
-- Bucket 2: avatars
--   Public. Max file size: 2MB. Allowed types: images only.
--   Path pattern: {user_id}/avatar
--
-- Storage RLS policies (run after creating buckets):
-- =============================================================================

-- Storage RLS for knowledge-bases bucket
-- (run AFTER creating the bucket in the dashboard)

create policy "kb files: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'knowledge-bases'
    and (storage.foldername(name))[1] = my_workspace_id()::text
  );

create policy "kb files: owner read"
  on storage.objects for select
  using (
    bucket_id = 'knowledge-bases'
    and (storage.foldername(name))[1] = my_workspace_id()::text
  );

create policy "kb files: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'knowledge-bases'
    and (storage.foldername(name))[1] = my_workspace_id()::text
  );

create policy "avatars: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');



-- =============================================================================
-- VERIFICATION QUERY
-- Run this after the migration to confirm everything created correctly.
-- =============================================================================


select table_name, (
  select count(*) from information_schema.columns c
  where c.table_name = t.table_name and c.table_schema = 'public'
) as column_count
from information_schema.tables t
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- Expected: 13 tables
-- profiles, workspaces, knowledge_bases, kb_documents, agents,
-- agent_knowledge_bases, number_pool, phone_numbers, callers,
-- conversations, messages, agent_usage, api_keys
