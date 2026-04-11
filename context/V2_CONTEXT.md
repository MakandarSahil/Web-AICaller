# CallMind V2 — Complete Plan & Context

> This file covers V2 planning only.
> Read CONTEXT.md first for V1 architecture, schema, and current state.
> Last updated: April 2026

---

## Execution Snapshot (April 11, 2026)

### V1 Completion (In Progress)

1. Conversations reliability
  - Keep call/chat history split (`/call-history`, `/chat-history`) and complete transcript reliability checks for completed Twilio calls.
  - Validate that completed conversations with `message_count > 0` always return non-empty `messages` in detail.

2. Schema-typed frontend data layer
  - Regenerate `packages/supabase/src/types/database.types.ts` from Supabase before query-shape work.
  - Keep `packages/supabase/src/queries/**` aligned to generated `Tables<>` types.

3. Caller identity persistence
  - Ensure Twilio `From` metadata propagates from `/voice` TwiML to media stream custom parameters.
  - Verify new calls populate `conversations.caller_id` consistently.

### V2 Kickoff (Start Now)

1. V2 data exposure in monitor UX
  - Surface `conversations.outcome` and `conversations.had_tool_call` in history table columns/filters.

2. Analytics bootstrap (read-only)
  - Add typed query helpers for `conversation_analytics` and render initial summary widgets in dashboard analytics.

3. Behaviour pipeline readiness
  - Add backend scaffolding to publish turn-level signals (`turn_signals`) without blocking voice response path.

## V2 Vision

V2 transforms CallMind from a call handler into a full business intelligence
+ AI agent platform. Three equal pillars:

1. **Human Behaviour** — agents that feel like real humans (greetings, intent
   detection, behaviour throughout call, pluggable tools)
2. **Analytics Platform** — business intelligence layer (real-time signals,
   post-call analysis, workspace overview, customer behaviour)
3. **RAG + Search** — scalable knowledge retrieval (pgvector hybrid search,
   pluggable providers, user-controlled chunking)

Plus a fourth cross-cutting concern:

4. **Pluggable Telephony** — multi-provider support, users bring their own
   Twilio/Vonage/Plivo accounts with secure credential storage

---

## V2 Execution Order

```
FINISH FIRST — V1 remaining
  ├── Conversations page (list + detail + realtime transcript)
  └── POST /query full impl (conv history, caller resolution, JWT auth)

V2.0 — Core (in this order)
  1.  Greeting system
  2.  Intent + behaviour detection (parallel stream)
  3.  Post-call deep analytics (extend Celery task)
  4.  Analytics dashboard (workspace overview + agent drill-down)
  5.  pgvector RAG + hybrid search
  6.  Manual indexing flow + KB chunk settings UI
  7.  Pluggable telephony (workspace_telephony_providers + Supabase Vault)

V2.1 — Tools
  8.  Tool framework (agent_tools table + execution engine)
  9.  Booking tool (slot-filling)
  10. SMS tool (Twilio send)
  11. Calendar integration (Google Calendar / Calendly)
  12. Call transfer tool

V2.2 — Scale + Advanced
  13. RAGFlow integration (optional swap for pgvector)
  14. Browser WebRTC voice
  15. WhatsApp channel
  16. K3s migration
  17. Billing / usage limits
  18. Team roles (multi-user per workspace)
  19. Vonage / Plivo providers
```

---

## PILLAR 1 — Human Behaviour

### 1.1 Greeting System

When a call connects, the agent speaks FIRST — before the caller says anything.
This is the biggest single UX improvement over V1.

```
Call connects → Twilio sends 'start' event
    ↓
FastAPI: load agent config + resolve caller
    ↓
Is returning caller?
    ├── YES → build dynamic greeting:
    │          "Hello [name]! Welcome back to [business].
    │           Last time you called about [last topic].
    │           How can I help you today?"
    └── NO  → build first-time greeting:
               "Hello! Thank you for calling [business].
                I'm [agent name]. How can I help you today?"
    ↓
Synthesise greeting via TTS immediately → send to Twilio
    ↓
Start Azure STT push stream (listen for caller response)
```

**Implementation change in call_handler.py:**
- After `start` event processing, fire `send_greeting()` before entering
  the media event loop
- `send_greeting()` uses same `synthesize_sentence()` + mark event flow as V1

**New agent config fields:**
```
agents.greeting_enabled    bool    default true
agents.greeting_template   text    -- optional custom override
                                   -- supports {caller_name}, {business_name},
                                   --           {last_topic}, {agent_name}
```

### 1.2 Intent + Behaviour Detection — Full Call

A **parallel analysis pipeline** runs alongside every STT→LLM→TTS turn.
Never blocks the main pipeline. Implemented as a background asyncio task.

**Two-tier classification:**

```
Tier 1 — Rule-based (~0ms, fires instantly):
  keyword/regex matching for common intents
  examples:
    "book" | "appointment" | "schedule" → intent: booking
    "cancel" | "refund" | "return"      → intent: cancellation
    "price" | "cost" | "how much"       → intent: pricing_enquiry
    "complaint" | "problem" | "issue"   → intent: complaint
    "hours" | "open" | "timing"         → intent: hours_enquiry

Tier 2 — LLM async (~200ms, background task, never blocks call):
  complex intent, sentiment, topic, urgency, entities
  uses lightweight model (llama-3.1-8b-instant for speed)
  fires after Tier 1, results stored when ready
```

**Per-turn signal stored:**
```python
TurnSignal:
  intent: str           # booking | complaint | enquiry | cancel | ...
  sentiment: str        # positive | neutral | negative | frustrated
  topic: str            # product_A | pricing | support | hours | ...
  urgency: str          # low | medium | high
  entities: list[str]   # product names, dates, amounts mentioned
  tier: str             # rule_based | llm
```

**Streamed to dashboard** via Redis pub/sub → Supabase Realtime channel
`live_call:{conversation_id}` so the dashboard shows live sentiment/intent.

### 1.3 Tool Framework

Tools are pluggable capabilities attached to an agent. Each tool is a row
in `agent_tools`. User enables/configures per agent in dashboard.

**Tool invocation — two paths:**

```
Path 1 — Rule-based trigger (fast, ~0ms):
  Tier 1 intent detection matches a tool trigger
  Example: intent=booking → check if booking tool enabled → invoke

Path 2 — LLM function calling (complex, ~200ms extra):
  Agent system prompt includes tool definitions in OpenAI tool_calls format
  Groq returns tool_calls in response → FastAPI executes → result injected
  Used for: ambiguous intents, multi-step tools, conditional logic
```

**V2 tool types:**

```
booking
  config: {
    mode: "slot_filling" | "sms_link" | "calendar_api",
    slots: ["date", "time", "name", "service"],   -- for slot_filling
    calendar_provider: "google" | "calendly",      -- for calendar_api
    calendar_id: str,
    confirmation_sms: bool
  }

call_transfer
  config: {
    transfer_to: "+91XXXXXXXXXX",  -- number to transfer to
    trigger_phrase: "transfer to human | speak to agent"
  }

send_sms
  config: {
    template: "Here is the link you requested: {url}",
    default_url: "https://...",
  }

custom_webhook
  config: {
    url: "https://...",
    method: "POST",
    headers: {},
    body_template: "{ 'caller': '{phone}', 'query': '{text}' }"
  }
```

**Execution is logged** in `tool_executions` table for analytics.

**During a call, if tool invocation requires waiting** (e.g. booking API call):
Agent says a filler phrase → "Let me check that for you, just a moment..."
→ tool executes → agent responds with result.
Never leaves dead silence.

**Analytics retention:**
- `turn_signals`: keep 90 days raw, then archive to cold storage
- `conversation_analytics`: keep forever (small, one row per conversation)
- `tool_executions`: keep 1 year

---

## PILLAR 2 — Analytics Platform

### 2.1 Real-time Signals (during call)

Dashboard `/conversations/[id]` live view shows:
- Live transcript (already V1 via Supabase Realtime)
- **NEW:** Sentiment indicator (color: green/yellow/red) updating per turn
- **NEW:** Current detected intent badge
- **NEW:** Current topic badge
- **NEW:** Urgency indicator
- Live call duration

Data path:
```
FastAPI (turn analysis) → Redis pub/sub → Supabase Realtime
→ Dashboard subscribes to channel live_call:{conv_id}
→ Updates UI without polling
```

### 2.2 Post-call Deep Analysis (Celery task extension)

Extends existing `save_conversation` Celery task:

```python
# After saving messages, run deep analysis:
analysis = await deep_analyse_conversation(messages, turn_signals)
# analysis = {
#   overall_intent: "booking",        # dominant intent for the call
#   sentiment_start: "neutral",
#   sentiment_end: "positive",
#   sentiment_arc: [{turn:1, s:"neutral"}, {turn:2, s:"positive"}...],
#   topics: ["product_A", "pricing"], # all topics mentioned
#   entities_mentioned: {
#     products: ["iPhone 15", "AirPods"],
#     dates: ["Monday", "next week"],
#     amounts: ["₹5000"]
#   },
#   outcome: "resolved",              # resolved|unresolved|transferred|booked
#   key_phrases: ["does it come in black", "what's the warranty"],
#   tool_calls_made: [{"tool": "booking", "success": true}],
#   resolution_turns: 4               # how many turns to resolve
# }
INSERT INTO conversation_analytics ...
```

Uses `llama-3.1-8b-instant` (fast, cheap) for post-call analysis — not
the main llm_model. Keeps cost low.

### 2.3 Analytics Dashboard Pages

#### /analytics — Workspace Overview

```
KPI Row (cards):
  Total calls | Avg duration | Resolution rate | Returning caller % | Busiest hour

Charts row 1:
  Call volume over time (line, filterable: 7d/30d/90d)
  Sentiment distribution (donut: positive/neutral/negative)

Charts row 2:
  Top intents (horizontal bar: booking 34%, enquiry 28%...)
  Top topics/products (bar or word cloud)

Charts row 3:
  Call outcomes (donut: resolved/unresolved/transferred/booked)
  Peak hours heatmap (7-day × 24-hour grid, colour by call volume)

Customer behaviour section:
  Most frequent callers table (phone masked: +91XXXXX1234)
  New vs returning ratio (this week vs last week)
  Avg calls per customer
  Customers with unresolved calls (follow-up list)

Agent comparison table:
  Agent | Calls | Avg Duration | Resolution Rate | Sentiment Score
```

#### /agents/[id]/analytics — Agent Drill-down

```
Same charts filtered to this agent +
  Top questions asked (extracted key_phrases, ranked by frequency)
  KB documents most retrieved (Phase B — when RAG is live)
  Tool usage breakdown (bookings made, SMS sent, transfers)
  Topics this agent handles most
```

### 2.4 New Tables

```sql
conversation_analytics
  id                  uuid pk
  conversation_id     uuid UNIQUE → conversations
  overall_intent      text
  sentiment_start     enum (positive|neutral|negative|frustrated)
  sentiment_end       enum
  sentiment_arc       jsonb   -- [{turn, sentiment}]
  topics              text[]
  entities_mentioned  jsonb   -- {products, dates, amounts, names}
  outcome             enum (resolved|unresolved|transferred|booked|hung_up)
  key_phrases         text[]
  tool_calls_made     jsonb
  resolution_turns    integer
  analysed_at         timestamptz

turn_signals
  id                  uuid pk
  conversation_id     uuid → conversations
  message_id          uuid → messages
  intent              text
  sentiment           enum
  topic               text
  urgency             enum (low|medium|high)
  entities            jsonb
  tier                enum (rule_based|llm)
  created_at          timestamptz

agent_tools
  id                  uuid pk
  agent_id            uuid → agents
  tool_type           enum (booking|call_transfer|send_sms|custom_webhook)
  display_name        text
  config              jsonb   -- tool-specific config (encrypted if contains secrets)
  trigger_intents     text[]  -- rule-based triggers: ['booking', 'appointment']
  is_active           bool default true
  created_at          timestamptz

tool_executions
  id                  uuid pk
  conversation_id     uuid → conversations
  message_id          uuid → messages  -- which turn triggered it
  tool_id             uuid → agent_tools
  tool_type           text
  input               jsonb   -- what was sent to the tool
  output              jsonb   -- what the tool returned
  success             bool
  error_message       text
  duration_ms         integer
  created_at          timestamptz
```

---

## PILLAR 3 — RAG + Search Layer

### 3.1 Architecture

```
V2.0 — pgvector (Phase A):
  Built into Supabase PostgreSQL
  Zero new infrastructure
  Hybrid search = vector cosine similarity + full-text search (tsvector)
  Combined with RRF (Reciprocal Rank Fusion) for best accuracy

V2.1 — RAGFlow (Phase B, optional upgrade):
  Self-hosted on Azure VM (or separate VM)
  agent.rag_provider = 'ragflow' switches retrieval
  pgvector remains for workspaces that don't need advanced RAG

V2.2+ — Other providers:
  Weaviate, Pinecone, LlamaIndex etc.
  All via same pluggable interface
```

### 3.2 Chunking Strategy

User controls per KB (not per agent — KB owns the chunking config):

```
knowledge_bases additions:
  chunk_size          integer  default 500   -- tokens per chunk
  chunk_overlap       integer  default 50    -- overlap between chunks
  index_status        enum     (unindexed|indexing|indexed|error)
                               default 'unindexed'
  indexed_at          timestamptz
  embedding_provider  text     default 'openai'
  embedding_model     text     default 'text-embedding-3-small'
```

**Chunking rules:**
- Files (PDF/DOCX/TXT): chunked at `chunk_size` tokens with `chunk_overlap`
- Plain text entries: if < chunk_size → single chunk, else split

**Supported embedding providers:**
```
openai  → text-embedding-3-small (1536-dim, best quality, paid)
nomic   → nomic-embed-text (768-dim, free via Ollama or API)
cohere  → embed-multilingual-v3 (1024-dim, multilingual)
```

### 3.3 New Tables for RAG

```sql
-- Enable extension (run in Supabase SQL editor)
create extension if not exists vector;

kb_document_chunks
  id                  uuid pk
  kb_document_id      uuid → kb_documents  on delete cascade
  kb_id               uuid → knowledge_bases  -- denormalised for fast filter
  chunk_index         integer
  content             text
  token_count         integer
  embedding           vector(1536)   -- NULL until indexed
                                     -- dimension matches embedding model
  ts_vector           tsvector       -- for keyword search, auto-updated
  metadata            jsonb          -- {page, section, source_file}
  created_at          timestamptz

-- Indexes
create index kb_chunks_vector_idx
  on kb_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index kb_chunks_fts_idx
  on kb_document_chunks
  using gin (ts_vector);

create index kb_chunks_kb_id_idx
  on kb_document_chunks (kb_id);
```

### 3.4 Hybrid Search SQL Function

```sql
create or replace function hybrid_search(
  query_embedding    vector(1536),
  query_text         text,
  kb_ids             uuid[],
  match_count        int default 5,
  vector_weight      float default 0.7,
  keyword_weight     float default 0.3
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
    select id, content, kb_id,
      1 - (embedding <=> query_embedding) as score,
      row_number() over (order by embedding <=> query_embedding) as rank
    from kb_document_chunks
    where kb_id = any(kb_ids)
      and embedding is not null
    order by embedding <=> query_embedding
    limit match_count * 2
  ),
  keyword_results as (
    select id, content, kb_id,
      ts_rank(ts_vector, plainto_tsquery(query_text)) as score,
      row_number() over (
        order by ts_rank(ts_vector, plainto_tsquery(query_text)) desc
      ) as rank
    from kb_document_chunks
    where kb_id = any(kb_ids)
      and ts_vector @@ plainto_tsquery(query_text)
    order by score desc
    limit match_count * 2
  ),
  -- Reciprocal Rank Fusion
  rrf as (
    select
      coalesce(v.id, k.id) as id,
      coalesce(v.content, k.content) as content,
      coalesce(v.kb_id, k.kb_id) as kb_id,
      (vector_weight  * coalesce(1.0 / (60 + v.rank), 0)) +
      (keyword_weight * coalesce(1.0 / (60 + k.rank), 0)) as score
    from vector_results v
    full outer join keyword_results k using (id)
  )
  select id, content, kb_id, score as similarity
  from rrf
  order by score desc
  limit match_count;
$$;
```

### 3.5 Indexing Flow (Manual Trigger)

```
Dashboard: KB detail page → "Index KB" button
    ↓
POST /api/kb/{kb_id}/index (FastAPI, JWT auth)
    ↓
UPDATE knowledge_bases SET index_status='indexing'
    ↓
Celery task: index_knowledge_base(kb_id)
    ├── Fetch all kb_documents WHERE kb_id = ?
    ├── For each document:
    │     ├── If plain_text: use content directly
    │     ├── If file: extract text (PyMuPDF for PDF, python-docx for DOCX)
    │     ├── Chunk text (chunk_size + overlap from KB config)
    │     ├── Batch embed chunks (embedding_provider from KB config)
    │     ├── Generate tsvector for each chunk
    │     └── UPSERT kb_document_chunks
    ├── UPDATE knowledge_bases SET index_status='indexed', indexed_at=now()
    └── Supabase Realtime notify → dashboard updates status badge
```

**Re-indexing:** When user adds/deletes a document in an already-indexed KB,
show "KB needs re-indexing" warning badge. User clicks Index KB again.
Old chunks for deleted documents are cascade-deleted via FK.

### 3.6 Pipeline Integration

```python
# app/services/rag.py

async def get_context(payload: QueryPayload) -> str:
    agent = payload.agent_config
    rag_provider = agent.get("rag_provider", "none")

    if rag_provider == "none":
        # V1 mode — full context dump (fallback always available)
        return "\n\n".join(payload.kb_documents)[:60000]

    elif rag_provider == "pgvector":
        # V2 mode — hybrid search
        kb_ids = payload.kb_snapshot_ids
        embedding = await embed(payload.text, agent["embedding_provider"])
        chunks = await hybrid_search(
            query_embedding=embedding,
            query_text=payload.text,
            kb_ids=kb_ids,
            match_count=agent.get("rag_top_k", 3)  # 3 for voice, 5 for text
        )
        return "\n\n".join([c["content"] for c in chunks])

    elif rag_provider == "ragflow":
        return await ragflow_retrieve(payload.text, agent["rag_kb_id"])
```

**rag_top_k defaults:**
- Voice calls: 3 chunks (shorter context → faster LLM response)
- Text/API queries: 5 chunks (latency less critical)
- User can override via agent config

### 3.7 Agent Config Additions for RAG

```sql
alter table agents add column
  rag_top_k               integer  default 3,
  embedding_provider      text     default 'openai',
  embedding_model         text     default 'text-embedding-3-small';
```

Note: `rag_provider` already exists from V1 schema (default 'none').
These are all internal — NOT exposed in user UI directly.
User controls RAG by choosing their embedding provider on the KB settings page.

---

## PILLAR 4 — Pluggable Telephony

### 4.1 Architecture

Every workspace can connect multiple telephony providers.
Each phone number is linked to a specific provider connection.
Platform-provided numbers use the platform's own provider connection.

```
workspace_telephony_providers
  ├── Platform Twilio (type=platform)     ← your account, managed by admin
  ├── User's Twilio (type=own)            ← user connects their SID
  ├── User's Vonage (type=own, V2.1)
  └── User's Plivo (type=own, V2.1)

phone_numbers
  └── each number → FK → workspace_telephony_providers
```

### 4.2 New Schema

```sql
workspace_telephony_providers
  id                  uuid pk
  workspace_id        uuid → workspaces
  provider            text        -- 'twilio' | 'vonage' | 'plivo'
  display_name        text        -- e.g. "My Twilio Account"
  provider_type       enum (platform|own)

  -- Credentials stored in Supabase Vault
  -- Only vault_secret_id stored here, never raw credentials
  vault_secret_id     uuid        -- reference to vault.secrets

  is_active           bool default true
  is_verified         bool default false  -- test call passed
  verified_at         timestamptz
  created_at          timestamptz

  UNIQUE (workspace_id, provider, provider_type)
  -- one own-Twilio per workspace in V2
  -- platform row is shared / pre-inserted by admin

-- Alter phone_numbers to link to provider
alter table phone_numbers
  add column telephony_provider_id uuid
    references workspace_telephony_providers(id);
```

### 4.3 Supabase Vault for Credential Storage

Supabase Vault uses `pgsodium` encryption at the DB layer.
Credentials are NEVER stored in plain text anywhere.

```sql
-- Store credentials (called from FastAPI using service role)
select vault.create_secret(
  '{"account_sid": "ACxxx", "auth_token": "xxx"}',
  'twilio_creds_workspace_{workspace_id}'
);
-- Returns vault_secret_id (uuid) → stored in workspace_telephony_providers

-- Read credentials (FastAPI, server-side only)
select decrypted_secret
from vault.decrypted_secrets
where id = '{vault_secret_id}';
```

**What gets stored per provider:**
```
Twilio:  { account_sid, auth_token }
Vonage:  { api_key, api_secret }
Plivo:   { auth_id, auth_token }
```

### 4.4 Call Flow with Pluggable Telephony

```python
# app/ws/call_handler.py — updated

async def handle_call(ws: WebSocket, agent_id: str):
    # On 'start' event:
    to_number = start_event["start"]["to"]

    # Look up which provider owns this number
    phone = await get_phone_number(to_number)
    provider_conn = await get_telephony_provider(
        phone["telephony_provider_id"]
    )

    # Decrypt credentials from Supabase Vault
    creds = await decrypt_vault_secret(provider_conn["vault_secret_id"])

    # Store in session — all subsequent Twilio API calls use these
    session.telephony_provider = provider_conn["provider"]
    session.telephony_creds = creds

    # For sending SMS, transfers, etc. — use session.telephony_creds
    # not the platform's hardcoded env vars
```

### 4.5 Webhook Setup (V2 — Manual)

When user connects their own Twilio account and adds a number:

Dashboard shows:
```
✅ Number added successfully.

Configure your Twilio webhook:
  1. Go to console.twilio.com → Phone Numbers → [your number]
  2. Set "A Call Comes In" webhook to:

     https://api.callmind.com/voice?agent_id={agent_id}

  3. Method: HTTP POST
  4. Save and make a test call.

[Copy webhook URL]  [Mark as configured]
```

V2.1: Auto-configure via Twilio API using user's credentials (they have
to grant the permission explicitly in a checkbox).

### 4.6 Dashboard — Telephony Settings Page

New: `/settings/telephony`

```
Connected Accounts
  ├── Platform Number Pool (read-only if admin assigned numbers)
  └── [+ Connect Your Twilio Account]
        → Modal: Display Name + Account SID + Auth Token
        → FastAPI encrypts → stores in Vault → is_verified=false
        → Test button: make a test API call to verify credentials
        → On success: is_verified=true
        → [Vonage] [Plivo] (coming soon badges)

My Phone Numbers (from connected accounts)
  ├── Table: number | provider | agent | status | webhook configured
  ├── [+ Add Number] → enter number → select agent → shows webhook URL
  └── Status toggle (is_active)

Platform Numbers (if any assigned by admin)
  └── Read-only view, contact support to change
```

---

## V2 Schema — Complete Change Summary

### New Tables (7)

```
kb_document_chunks          RAG: chunked + vectorised documents
conversation_analytics      Post-call deep analysis (1 row per conv)
turn_signals                Per-turn real-time intent/sentiment
agent_tools                 Pluggable tool configs per agent
tool_executions             Log of tool calls made during calls
workspace_telephony_providers  Multi-provider credential connections
```

### Altered Tables (6)

```
knowledge_bases    + chunk_size, chunk_overlap, index_status,
                     indexed_at, embedding_provider, embedding_model

agents             + greeting_enabled, greeting_template,
                     tool_calling_enabled, rag_top_k,
                     embedding_provider, embedding_model

conversations      + outcome enum, had_tool_call bool,
                     real_time_signals jsonb (live snapshot)

phone_numbers      + telephony_provider_id → workspace_telephony_providers

-- V1 nullable cols now populated:
kb_documents       rag_document_id, rag_kb_id, rag_status (Phase B)
knowledge_bases    rag_kb_id (Phase B)
agents             rag_provider = 'pgvector' (from 'none')
```

### New Extensions

```sql
create extension if not exists vector;   -- pgvector for embeddings
-- supabase_vault is already enabled in all Supabase projects
```

---

## V2 Latency Targets

```
Current V1:     ~780ms end-to-end
V2.0 target:    ~400-500ms

How achieved:
  Greeting pre-synthesis    → caller hears something in <200ms
  RAG replaces KB dump      → 60k char prompt → 2k char context → faster LLM
  TTS connection reuse      → saves ~80ms connection setup per sentence
  LLM response caching      → FAQ-type queries: Redis cache hit → ~50ms
  Tighter sentence pipeline → parallel LLM sentence N+1 while TTS plays N
```

---

## V2 Analytics — Retention Policy

```
turn_signals            90 days raw → archive / delete
conversation_analytics  Forever (one small row per conversation)
tool_executions         1 year
live call signals       Redis only (TTL = call duration + 1 hour)
```

---

## V2 Business Model Implications

```
Individual tier (free / low cost):
  → Platform number pool (1 number)
  → pgvector RAG
  → Basic analytics
  → Tools: SMS + booking (slot-filling)

Business tier (paid SaaS):
  → Bring own Twilio + multiple providers
  → Multiple agents + KBs
  → Full analytics dashboard
  → All tools including custom webhook
  → Priority support

White-label / API tier (developer):
  → API key auth (already built in V1)
  → Embed widget (V2.2)
  → Custom domain
  → Webhook for all events
```

---

## V2 Key Decisions — Frozen

| Decision | Choice | Reason |
|----------|--------|--------|
| RAG architecture | pgvector first, RAGFlow optional upgrade | Zero infra for phase A |
| RAG scope | Per KB (chunks belong to KB) | KB is dynamic, agent attaches/detaches |
| Search strategy | Hybrid (vector + keyword, RRF) | Best accuracy for voice queries |
| Chunking control | User controls per KB (chunk_size, overlap) | Different docs need different sizes |
| Embedding trigger | Manual "Index KB" button | User controls when to embed |
| Embedding provider | Pluggable (openai/nomic/cohere) | Different cost/quality tradeoffs |
| rag_top_k voice | 3 chunks default | Shorter context = faster LLM |
| rag_top_k text | 5 chunks default | Latency less critical |
| Greeting | Dynamic (name + last topic) + intent detection | Most human-feeling approach |
| Behaviour detection | Parallel async stream, never blocks call | Cannot add latency to pipeline |
| Intent classification | Two-tier: rule-based (0ms) + LLM (async) | Speed + accuracy |
| Analytics timing | Both real-time signals + post-call deep analysis | Complementary data |
| Analytics retention | turn_signals 90d, analytics forever | Balance storage vs insight |
| Tool invocation | Both rule-based (fast) + LLM function calling (complex) | Best of both |
| Tool waiting UX | Filler phrase ("let me check...") | Never dead silence |
| Telephony | Multi-provider + user brings own account | Platform independence |
| Credential storage | Supabase Vault (pgsodium encryption) | Zero extra infra |
| Webhook setup | Manual V2, auto V2.1 | Simplest first |
| Analytics scope | Both workspace overview + agent drill-down | Different use cases |
| Caller history in RAG | No — keep as SQL retrieval | Structured, fits in context |
| Filler during tool | Agent speaks filler phrase | No dead silence ever |
