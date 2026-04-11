# CallMind V2 — Skills & Implementation Patterns

> Paste alongside CONTEXT.md, V2_CONTEXT.md, and agents.md.
> These are the non-obvious patterns, gotchas, and decisions
> that any Claude chat needs to know to write correct code.

---

## SKILL 1 — Parallel Pipeline Pattern

Never block the voice pipeline. Any non-critical work runs as a background task.

```python
# ✅ CORRECT — fire and forget analysis
async def on_final_transcript(text: str, session: SessionState):
    # Main pipeline — SYNC, must complete fast
    await run_voice_pipeline(text, session)

    # Analysis — truly parallel, never awaited
    asyncio.create_task(analyse_turn(text, session))

# ❌ WRONG — awaiting analysis blocks next audio chunk
async def on_final_transcript(text: str, session: SessionState):
    await run_voice_pipeline(text, session)
    await analyse_turn(text, session)  # blocks!
```

**Rule:** Everything in `asyncio.create_task()` must handle its own exceptions.
Wrap with try/except — a crashed analysis task must never affect the call.

```python
async def analyse_turn(text: str, session: SessionState):
    try:
        result = await classify_intent(text)
        session.turn_signals.append(result)
        await publish_signal(session.conversation_id, result)
    except Exception as e:
        logger.warning(f"Turn analysis failed (non-critical): {e}")
        # Never re-raise — call continues regardless
```

---

## SKILL 2 — Filler Phrase Pattern (Tools)

Never leave dead silence while waiting for a tool to execute.

```python
FILLER_PHRASES = {
    "booking":   "Let me check the availability for you, just a moment...",
    "sms":       "I'll send that to you right away...",
    "transfer":  "Let me connect you with our team...",
    "default":   "Let me look that up for you, just a moment...",
}

async def execute_tool_with_filler(
    tool: AgentTool,
    session: SessionState
):
    # 1. Send filler phrase IMMEDIATELY (caller hears something)
    filler = FILLER_PHRASES.get(tool.tool_type, FILLER_PHRASES["default"])
    await synthesise_and_send(filler, session)

    # 2. Execute tool with timeout
    try:
        async with asyncio.timeout(5.0):
            result = await tool.execute(session)
    except asyncio.TimeoutError:
        result = ToolResult(
            success=False,
            message="I'm sorry, I couldn't complete that right now."
        )

    # 3. Log execution
    await log_tool_execution(tool, result, session)

    return result
```

---

## SKILL 3 — Hybrid Search Pattern

Always use the `hybrid_search` Supabase RPC function — never call vector
search and keyword search separately in Python and merge in memory.

```python
# ✅ CORRECT — single DB round trip, RRF done in Postgres
async def get_rag_context(
    query: str,
    kb_ids: list[str],
    embedding: list[float],
    top_k: int = 3
) -> list[str]:
    result = await supabase.rpc("hybrid_search", {
        "query_embedding": embedding,
        "query_text": query,
        "kb_ids": kb_ids,
        "match_count": top_k,
        "vector_weight": 0.7,
        "keyword_weight": 0.3
    }).execute()
    return [row["content"] for row in result.data]

# ❌ WRONG — two DB calls, Python merge, more latency
async def get_rag_context_bad(query, kb_ids, embedding, top_k):
    vector_results = await vector_search(embedding, kb_ids)
    keyword_results = await keyword_search(query, kb_ids)
    merged = merge_rrf(vector_results, keyword_results)  # in Python!
    return merged[:top_k]
```

**rag_top_k by channel:**
```python
def get_top_k(input_mode: str, agent_config: dict) -> int:
    base = agent_config.get("rag_top_k", 3)
    if input_mode == "text_api":
        return min(base + 2, 8)   # slightly more context for text
    return base                    # voice: keep it short for speed
```

---

## SKILL 4 — Supabase Vault Pattern

Never store raw credentials in any table column. Always use Vault.

```python
# ✅ CORRECT — store via Vault RPC
async def connect_telephony_provider(
    workspace_id: str,
    provider: str,
    creds: dict  # {"account_sid": "...", "auth_token": "..."}
) -> str:
    # Encrypt and store
    result = await supabase.rpc("vault_create_secret", {
        "secret": json.dumps(creds),
        "name": f"{provider}_{workspace_id[:8]}"
    }).execute()
    vault_secret_id = result.data

    # Store only the ID in our table
    await supabase.table("workspace_telephony_providers").insert({
        "workspace_id": workspace_id,
        "provider": provider,
        "vault_secret_id": vault_secret_id,
        # NO account_sid or auth_token here
    }).execute()

    return vault_secret_id

# ✅ CORRECT — read via Vault
async def get_provider_creds(vault_secret_id: str) -> dict:
    result = await supabase.table("vault.decrypted_secrets") \
        .select("decrypted_secret") \
        .eq("id", vault_secret_id) \
        .single() \
        .execute()
    return json.loads(result.data["decrypted_secret"])

# ❌ WRONG — storing in plain text
await supabase.table("workspace_telephony_providers").insert({
    "account_sid": "ACxxx",    # NEVER
    "auth_token": "xxx"         # NEVER
})
```

---

## SKILL 5 — Chunking Pattern

Chunk text correctly for embeddings. Wrong chunking = poor retrieval.

```python
import tiktoken

def chunk_text(
    text: str,
    chunk_size: int = 500,      # tokens
    chunk_overlap: int = 50,    # tokens
    model: str = "text-embedding-3-small"
) -> list[dict]:
    enc = tiktoken.encoding_for_model("text-embedding-ada-002")
    # All OpenAI embedding models use ada-002 tokenizer
    tokens = enc.encode(text)
    chunks = []
    start = 0
    chunk_index = 0

    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = enc.decode(chunk_tokens)
        chunks.append({
            "chunk_index": chunk_index,
            "content": chunk_text,
            "token_count": len(chunk_tokens),
            "metadata": {"start_token": start, "end_token": end}
        })
        start += chunk_size - chunk_overlap
        chunk_index += 1

    return chunks

# Plain text documents: chunk if > chunk_size, else single chunk
# File documents: extract text first, then chunk
# IMPORTANT: use same tokenizer regardless of embedding provider
# (tiktoken ada-002 is standard)
```

---

## SKILL 6 — Embedding Batch Pattern

Always batch embed — never embed one chunk at a time.

```python
# ✅ CORRECT — batch all chunks in one API call
async def embed_chunks(
    chunks: list[dict],
    provider: str,
    model: str
) -> list[dict]:
    texts = [c["content"] for c in chunks]

    if provider == "openai":
        client = AsyncOpenAI()
        response = await client.embeddings.create(
            model=model,
            input=texts
        )
        embeddings = [item.embedding for item in response.data]
    elif provider == "nomic":
        embeddings = await nomic_embed_batch(texts)

    # Merge embeddings back into chunks
    return [
        {**chunk, "embedding": emb}
        for chunk, emb in zip(chunks, embeddings)
    ]

# ❌ WRONG — one API call per chunk (slow + expensive)
for chunk in chunks:
    chunk["embedding"] = await embed_single(chunk["content"])
```

**Batch size limits:**
```
openai text-embedding-3-small: max 2048 inputs per request
                                max 8191 tokens per input
nomic-embed-text: max 512 inputs per request
```

---

## SKILL 7 — Analytics Query Pattern

Never run heavy aggregation queries on page load. Use pre-aggregated data.

```typescript
// ✅ CORRECT — use conversation_analytics (pre-computed)
const { data } = await supabase
  .from('conversation_analytics')
  .select('overall_intent, outcome, sentiment_end, topics')
  .gte('analysed_at', sinceDate)

// ❌ WRONG — COUNT on raw messages table (expensive)
const { count } = await supabase
  .from('messages')
  .select('*', { count: 'exact', head: true })
  .gte('created_at', sinceDate)
```

**Client-side aggregation for charts:**
```typescript
// Group and count in JavaScript after fetching
// This is fine for <10k rows (typical for a workspace)
const intentCounts = data.reduce((acc, row) => {
  acc[row.overall_intent] = (acc[row.overall_intent] || 0) + 1
  return acc
}, {} as Record<string, number>)

// For recharts BarChart:
const chartData = Object.entries(intentCounts)
  .map(([intent, count]) => ({ intent, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8)  // top 8 intents
```

---

## SKILL 8 — Real-time Signal Pattern

Publish live call signals without touching the main voice pipeline.

```python
# app/pipeline/behaviour.py

REDIS_SIGNAL_CHANNEL = "live_call:{conversation_id}"

async def publish_turn_signal(
    conversation_id: str,
    signal: TurnSignal,
    redis: Redis
):
    channel = REDIS_SIGNAL_CHANNEL.format(
        conversation_id=conversation_id
    )
    await redis.publish(channel, signal.model_dump_json())
    # Supabase Realtime Broadcast picks this up if configured
    # OR use Supabase client to broadcast directly:
    await supabase.realtime.channel(channel).send({
        "type": "broadcast",
        "event": "turn_signal",
        "payload": signal.dict()
    })
```

```typescript
// Dashboard — subscribe to live signals
const channel = supabase
  .channel(`live_call:${conversationId}`)
  .on('broadcast', { event: 'turn_signal' }, ({ payload }) => {
    setSentiment(payload.sentiment)
    setCurrentIntent(payload.intent)
    setCurrentTopic(payload.topic)
  })
  .subscribe()
```

---

## SKILL 9 — Tool State Machine Pattern

Slot-filling booking requires multi-turn state. Keep state in SessionState.

```python
@dataclass
class BookingSlotState:
    tool_id: str
    slots_required: list[str]          # ["date", "time", "name", "service"]
    slots_filled: dict[str, str] = field(default_factory=dict)
    current_slot: str | None = None
    confirmed: bool = False

    SLOT_QUESTIONS = {
        "date":    "What date works for you?",
        "time":    "What time would you prefer?",
        "name":    "May I have your name?",
        "service": "Which service are you booking for?"
    }

    def next_question(self) -> str | None:
        for slot in self.slots_required:
            if slot not in self.slots_filled:
                self.current_slot = slot
                return self.SLOT_QUESTIONS[slot]
        return None  # all slots filled

    def fill_current(self, value: str):
        if self.current_slot:
            self.slots_filled[self.current_slot] = value
            self.current_slot = None

    def is_complete(self) -> bool:
        return all(s in self.slots_filled for s in self.slots_required)

    def confirmation_text(self) -> str:
        return (f"Just to confirm — I'll book {self.slots_filled.get('service', 'an appointment')} "
                f"for {self.slots_filled.get('name', 'you')} "
                f"on {self.slots_filled.get('date')} "
                f"at {self.slots_filled.get('time')}. Is that correct?")

# Add to SessionState:
# active_booking: BookingSlotState | None = None
```

---

## SKILL 10 — Indexing Status Pattern

Show indexing status as a badge in the KB detail page.
Never poll — use Supabase Realtime.

```typescript
// When user clicks "Index KB":
const handleIndex = async () => {
  // Optimistic update
  queryClient.setQueryData(kbKeys.detail(kb.id), old => ({
    ...old, index_status: 'indexing'
  }))

  await fetch(`${FASTAPI_URL}/kb/${kb.id}/index`, {
    method: 'POST',
    headers: { ...authHeader }
  })
  // Don't await completion — Celery task runs async
}

// Realtime subscription — updates badge when Celery finishes:
const channel = supabase
  .channel(`kb_index:${kb.id}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'knowledge_bases',
    filter: `id=eq.${kb.id}`
  }, ({ new: updated }) => {
    queryClient.setQueryData(kbKeys.detail(kb.id), old => ({
      ...old,
      index_status: updated.index_status,
      indexed_at: updated.indexed_at
    }))
    // setQueryData NOT invalidateQueries
  })
  .subscribe()

// Badge colours:
// unindexed → gray  "Not indexed"
// indexing  → amber + spinner  "Indexing..."
// indexed   → green  "Indexed {date}"
// error     → red  "Index failed — try again"
```

---

## SKILL 11 — Greeting Pre-synthesis Pattern

Send greeting audio before STT is ready to receive. Timing is critical.

```python
# app/ws/call_handler.py

async def handle_start_event(msg: dict, session: SessionState):
    # 1. Extract call metadata
    session.stream_sid = msg["start"]["streamSid"]
    session.call_sid = msg["start"]["callSid"]

    # 2. Load agent config + KB + caller (parallel)
    await asyncio.gather(
        populate_session(session),
        resolve_caller(session)
    )

    # 3. Build greeting (fast — no LLM needed)
    greeting_text = build_greeting(session)

    # 4. Start STT stream (so it's ready when caller responds)
    session.stt_client = AzureSTT(...)
    session.stt_client.start()

    # 5. Send greeting LAST — STT already listening when caller responds
    await synthesise_and_send(greeting_text, session)
    session.greeting_sent = True

def build_greeting(session: SessionState) -> str:
    agent = session.agent_config
    if not agent.get("greeting_enabled", True):
        return ""  # some agents prefer no greeting

    template = agent.get("greeting_template")
    if template:
        return template.format(
            caller_name=get_caller_display_name(session),
            business_name=session.workspace_name,
            agent_name=agent["name"],
            last_topic=get_last_topic(session)
        )

    # Default dynamic greeting
    if session.caller_id and session.caller_history:
        last_topic = get_last_topic(session)
        name = get_caller_display_name(session)
        return (f"Hello {name}! Welcome back to {session.workspace_name}. "
                f"Last time you called about {last_topic}. "
                f"How can I help you today?")
    else:
        return (f"Hello! Thank you for calling {session.workspace_name}. "
                f"I'm {agent['name']}. How can I help you today?")
```

---

## Common Mistakes to Avoid in V2

```
❌ Awaiting background tasks (breaks pipeline latency)
❌ Storing credentials outside Supabase Vault
❌ Calling invalidateQueries in Realtime handlers (causes fetch storms)
❌ Embedding one chunk at a time (should batch)
❌ Mixing embedding providers within the same KB (dimension mismatch)
❌ Running COUNT(*) on conversations or messages for analytics
❌ Letting tool execution create dead silence (always send filler first)
❌ Filtering by workspace_id manually (RLS handles it)
❌ Using agent's llm_model for analytics (use llama-3.1-8b-instant)
❌ Showing raw phone numbers in analytics UI (always mask: +91XXXXX1234)
❌ Chunking with different chunk_size after KB is already indexed
   (forces full re-index)
❌ Exposing rag_provider, embedding_provider to UI as user settings
   (internal only — user sees "RAG enabled/disabled" not provider details)
```
