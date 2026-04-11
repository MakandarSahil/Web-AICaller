# CallMind V2 — Agents Definition

> Paste this alongside CONTEXT.md and V2_CONTEXT.md at the start of any
> new Claude chat working on V2 features.
> Each agent definition describes a focused implementation scope.

---

## How to use this file

When starting a new chat for a specific V2 feature, paste:
1. CONTEXT.md (full V1 + current state)
2. V2_CONTEXT.md (V2 full plan)
3. This file (agents.md)
4. Tell Claude which agent you are working on

---

## Agent 1 — Greeting + Behaviour Agent

**Scope:** Implement the greeting system and parallel behaviour detection pipeline.

**Files to touch:**
```
app/ws/call_handler.py        add send_greeting() call on 'start' event
app/pipeline/greeting.py      NEW — build_greeting(session) → str
app/pipeline/behaviour.py     NEW — analyse_turn(text, session) async background task
app/pipeline/intent.py        NEW — tier1_classify(text) → TurnSignal (rule-based)
app/models/session.py         add turn_signals: list[TurnSignal], greeting_sent: bool
app/tasks/conversation.py     extend save_conversation to include turn_signals
```

**New table:**
```
turn_signals (see V2_CONTEXT.md schema)
```

**New agent config fields:**
```
agents.greeting_enabled    bool  default true
agents.greeting_template   text  nullable
```

**Key rules:**
- Greeting is synthesised BEFORE STT stream starts
- Behaviour analysis NEVER touches the voice pipeline path
- Tier 1 (rule-based) fires synchronously but cheaply (<1ms)
- Tier 2 (LLM) fires as asyncio background task, result stored when ready
- Use llama-3.1-8b-instant for Tier 2 (not the agent's main llm_model)
- Stream turn signals to Redis pub/sub channel: `live_call:{conversation_id}`

**Template variables for greeting_template:**
```
{caller_name}     → callers.phone_number (masked) or "there"
{business_name}   → workspaces.name
{agent_name}      → agents.name
{last_topic}      → last conversation_analytics.topics[0] for this caller
```

---

## Agent 2 — Analytics Agent

**Scope:** Post-call deep analysis + analytics dashboard pages.

**Files to touch:**
```
app/tasks/conversation.py     extend to call deep_analyse_conversation()
app/pipeline/analytics.py     NEW — deep_analyse_conversation(messages, signals)
apps/dashboard/app/(dashboard)/analytics/page.tsx         NEW
apps/dashboard/app/(dashboard)/analytics/analytics-client.tsx  NEW
apps/dashboard/app/(dashboard)/agents/[id]/analytics/     NEW
packages/supabase/src/queries/analytics.ts                NEW
apps/dashboard/hooks/use-analytics.ts                     NEW
apps/dashboard/lib/query-keys.ts                          add analyticsKeys
```

**New tables:**
```
conversation_analytics (see V2_CONTEXT.md)
turn_signals (shared with Agent 1)
```

**New conversations table columns:**
```
outcome       enum (resolved|unresolved|transferred|booked|hung_up)
had_tool_call bool default false
```

**Dashboard charts to implement (recharts library):**
```
LineChart     call volume over time (filterable: 7d/30d/90d)
PieChart      sentiment distribution
BarChart      top intents (horizontal)
BarChart      top topics/products
PieChart      call outcomes
Heatmap       peak hours (custom — 7×24 grid with colour intensity)
```

**Key rules:**
- Deep analysis uses llama-3.1-8b-instant (NOT agent's llm_model)
- Deep analysis runs AFTER save_conversation completes (sequential in same task)
- Analytics queries use agent_usage for counts (never COUNT(*) on conversations)
- All analytics filter by workspace via RLS — no manual workspace_id filter needed
- Charts filter by agent_id when on agent detail page
- Date range filter via nuqs URL params (consistent with V1 pattern)

**Supabase query pattern for analytics:**
```typescript
// packages/supabase/src/queries/analytics.ts
export async function getWorkspaceAnalytics(
  supabase: SupabaseClientType,
  days: 7 | 30 | 90 = 30
) {
  // Use Postgres date functions — don't filter in JS
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data } = await supabase
    .from('conversation_analytics')
    .select(`
      overall_intent, sentiment_end, outcome, topics,
      conversations!inner(agent_id, started_at, ended_at,
        agents!inner(workspace_id))
    `)
    .gte('conversations.started_at', since)
  return data
}
```

---

## Agent 3 — RAG Agent

**Scope:** pgvector hybrid search, chunking, embedding, indexing flow.

**Files to touch:**
```
app/services/rag.py           NEW — get_context(), hybrid_search()
app/services/embeddings.py    NEW — EmbeddingProvider protocol + implementations
app/tasks/indexing.py         NEW — index_knowledge_base(kb_id) Celery task
app/routers/kb.py             NEW — POST /kb/{id}/index endpoint
apps/dashboard/app/(dashboard)/knowledge-bases/[id]/page.tsx  add Index KB button
packages/supabase/src/queries/knowledge-bases.ts              add indexing queries
```

**New table:**
```
kb_document_chunks (see V2_CONTEXT.md)
```

**New knowledge_bases columns:**
```
chunk_size          integer  default 500
chunk_overlap       integer  default 50
index_status        enum     (unindexed|indexing|indexed|error)
indexed_at          timestamptz
embedding_provider  text     default 'openai'
embedding_model     text     default 'text-embedding-3-small'
```

**New agent columns:**
```
rag_top_k           integer  default 3
```

**Supabase SQL to run:**
```sql
create extension if not exists vector;
-- Then run kb_document_chunks table + indexes from V2_CONTEXT.md
-- Then run hybrid_search() function from V2_CONTEXT.md
```

**Embedding provider implementations:**
```python
# OpenAI (1536-dim)
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
response = await client.embeddings.create(
    model="text-embedding-3-small",
    input=texts
)

# Nomic (768-dim, free)
# Via Ollama local or Nomic API
# NOTE: dimension mismatch — cannot mix with OpenAI in same KB
# KB must use ONE provider consistently
```

**Key rules:**
- Chunk dimension must match embedding model dimension — enforced at index time
- Cannot switch embedding provider after KB is indexed without re-indexing
- rag_top_k=3 for voice, 5 for text queries (set in get_context() based on input_mode)
- File text extraction: PyMuPDF for PDF, python-docx for DOCX
- Re-indexing deletes old chunks for that document before inserting new ones
- Index status shown as badge in KB detail page: unindexed|indexing|indexed|error
- "Index KB" button disabled while status=indexing

**RAG context injection in pipeline:**
```python
# app/pipeline/prompt.py — updated build_prompt()
context = await get_context(payload)  # from app/services/rag.py
# replaces the old: "\n\n".join(payload.kb_documents)[:60000]
```

---

## Agent 4 — Tools Agent

**Scope:** Tool framework, tool execution engine, booking + SMS + transfer tools.

**Files to touch:**
```
app/services/tools/           NEW directory
  __init__.py
  base.py                     ToolBase protocol
  booking.py                  SlotFillingBookingTool
  sms.py                      SendSMSTool
  transfer.py                 CallTransferTool
  webhook.py                  CustomWebhookTool
  executor.py                 ToolExecutor — decides which tool to call
app/ws/call_handler.py        integrate ToolExecutor after LLM response
app/models/session.py         add active_tool_execution: bool
apps/dashboard/app/(dashboard)/agents/[id]/tools/  NEW page
packages/supabase/src/queries/tools.ts             NEW
```

**New tables:**
```
agent_tools      (see V2_CONTEXT.md)
tool_executions  (see V2_CONTEXT.md)
```

**New agent columns:**
```
tool_calling_enabled  bool  default false
greeting_enabled      bool  default true  (shared with Agent 1)
```

**Tool invocation flow:**
```python
# After LLM generates response text:
# 1. Check Tier 1: does detected intent match any active tool trigger?
if tier1_intent in [t.trigger_intents for t in session.active_tools]:
    tool = get_matching_tool(tier1_intent, session.active_tools)
    # Say filler phrase first (no dead silence)
    await send_filler(session, tool.filler_phrase)
    result = await execute_tool(tool, session)
    # Inject result into next LLM turn
    session.pending_tool_result = result

# 2. Check LLM function calling response:
if llm_response.tool_calls:
    for tool_call in llm_response.tool_calls:
        await send_filler(session, "Let me check that for you...")
        result = await execute_tool_by_name(tool_call.name, tool_call.args)
        session.pending_tool_result = result
```

**Slot-filling booking:**
```python
# Multi-turn state machine
# Slots: date, time, name, service (configurable in agent_tools.config)
# Each unfilled slot → agent asks question → user answers → STT → fill slot
# When all slots filled → confirm → book / send SMS confirmation
class SlotFillingState:
    slots_required: list[str]
    slots_filled: dict[str, str]
    current_slot: str | None

    def next_question(self) -> str: ...
    def is_complete(self) -> bool: ...
```

**Key rules:**
- Filler phrase ALWAYS sent before tool execution (never dead silence)
- Tool execution timeout: 5 seconds (then graceful failure message)
- tool_executions logged regardless of success/failure
- Agent_tools.config containing secrets (e.g. calendar API keys) → encrypted in Supabase Vault
- Tool calling disabled by default (agent.tool_calling_enabled=false)
- Dashboard: tool management tab on agent detail (new Tab 5)

---

## Agent 5 — Telephony Agent

**Scope:** workspace_telephony_providers table, Supabase Vault credential storage,
multi-provider call routing, telephony settings dashboard page.

**Files to touch:**
```
app/clients/telephony.py      NEW — TelephonyClient protocol + TwilioClient
app/ws/call_handler.py        update to load provider creds from session
app/routers/telephony.py      NEW — POST /telephony/providers (connect account)
                                     DELETE /telephony/providers/{id}
                                     POST /telephony/providers/{id}/verify
apps/dashboard/app/(dashboard)/settings/telephony/  NEW page
packages/supabase/src/queries/telephony.ts          NEW
```

**New table:**
```
workspace_telephony_providers (see V2_CONTEXT.md)
```

**New phone_numbers column:**
```
telephony_provider_id  uuid → workspace_telephony_providers
```

**Supabase Vault usage from FastAPI:**
```python
# Store credentials (on user connecting account)
async def store_credentials(workspace_id: str, provider: str, creds: dict):
    secret_name = f"{provider}_creds_{workspace_id}"
    secret_json = json.dumps(creds)  # {"account_sid": "...", "auth_token": "..."}

    result = await supabase.rpc("vault.create_secret", {
        "secret": secret_json,
        "name": secret_name
    })
    return result.data  # vault_secret_id

# Read credentials (on call start)
async def get_credentials(vault_secret_id: str) -> dict:
    result = await supabase.table("vault.decrypted_secrets") \
        .select("decrypted_secret") \
        .eq("id", vault_secret_id) \
        .single() \
        .execute()
    return json.loads(result.data["decrypted_secret"])
```

**Platform number pool:**
- Pre-seeded by admin with `provider_type=platform`
- Uses platform's own Twilio SID (env var on FastAPI, not in Vault)
- When admin assigns platform number to workspace → `phone_numbers` row
  gets `telephony_provider_id` pointing to platform's provider row

**Credential verification flow:**
```
User enters SID + Auth Token
    ↓
POST /telephony/providers/verify
    ↓
FastAPI: decrypt → make Twilio API call (list phone numbers)
    ↓
Success → is_verified=true, verified_at=now()
Failure → return error message (wrong credentials)
```

**Key rules:**
- Raw credentials NEVER logged, NEVER in application memory longer than needed
- credentials encrypted in Vault before INSERT
- FastAPI reads from Vault only when call starts, holds for call duration only
- Dashboard shows masked SID (ACxxxxxxxxxxxxxxxxxxxxxxxxx → AC...xxxx)
- Auth Token never shown after saving (write-only)
- One own-Twilio account per workspace in V2 (UNIQUE constraint)
- Vonage/Plivo: "Coming soon" badges in V2, implement in V2.1

---

## Agent 6 — V1 Completion Agent

**Scope:** Complete the remaining V1 work before V2 starts.

**Files to touch:**
```
apps/dashboard/app/(dashboard)/conversations/page.tsx        NEW
apps/dashboard/app/(dashboard)/conversations/[id]/page.tsx   NEW
apps/dashboard/app/(dashboard)/conversations/conversations-client.tsx
apps/dashboard/hooks/use-conversations.ts
packages/supabase/src/queries/conversations.ts
app/routers/query.py   complete Phase 3b (conv history, caller, auth)
```

**Conversations list page features:**
```
Table columns: agent, channel badge, status badge (active=green pulse),
               duration, message count, caller (masked phone), date
Filters: agent (select), channel (select), status (select), date range
         all via nuqs URL params
Realtime: subscribe to conversations INSERT → prepend via qc.setQueryData()
          (NOT invalidateQueries)
Pagination: infinite scroll or page-based (pick one, stay consistent)
```

**Conversations detail page features:**
```
Header: agent name, channel, status, duration, caller info
Transcript: messages chronological, user=right blue, assistant=left gray
Realtime (if active): subscribe to messages INSERT for this conversation_id
Summary section: show text + [Edit] → textarea → PATCH {summary, summary_edited:true}
                 show "Edited" badge if summary_edited=true
KB snapshot: resolve kb_snapshot_ids → show KB names
```

**POST /query completion (Phase 3b):**
```python
# app/routers/query.py
# Add:
# 1. JWT auth validation (already partially done in V1)
# 2. Load conversation_history from Supabase if conversation_id provided
# 3. Resolve caller_id if phone number in request metadata
# 4. Load caller_history
# 5. Save each turn to messages table (not Celery — synchronous for text)
# 6. Return conversation_id in SSE stream first event
```

**Key rules (from V1 context):**
- Realtime: setQueryData ONLY — never invalidateQueries in realtime handlers
- All Supabase queries via functions in packages/supabase/src/queries/
- Never filter by workspace_id manually — RLS handles it
- Use nuqs for all URL filter state
```
