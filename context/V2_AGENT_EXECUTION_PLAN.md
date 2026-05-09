# CallMind V2 Agent Execution Plan

Last updated: 2026-05-08

This plan is written for an implementation agent. It turns the existing V2 context into executable phases across the Next.js dashboard, Supabase schema/data layer, and FastAPI backend.

Read first:
- `Web-AIcaller/context/V2_CONTEXT.md`
- `Web-AIcaller/context/CONTEXT.md`
- `Web-AIcaller/packages/supabase/001_schema_v_4.sql`
- `backend-AICaller/context/V2_CONTEXT.md`
- `backend-AICaller/app/routers/query.py`
- `backend-AICaller/app/ws/call_handler.py`

## Current State Summary

Frontend:
- Dashboard is a Next.js turborepo app using manually added shadcn-style components.
- API key page exists but is currently mock-only and must be wired to FastAPI.
- Phone number page supports a basic bring-your-own number form, but not secure Twilio credential storage, verification, or provider-specific webhook validation.
- Analytics page reads from Supabase query helpers, but only renders a basic view.
- Agent settings UI does not fully expose V4 behavior fields such as greeting, RAG top K, tool calling, multilingual/STT language, or tool config.

Backend:
- `/query` supports JWT or API key auth, SSE streaming, `visitor_id`, `conversation_id`, message persistence, and basic text chat.
- API key create/list/revoke endpoints exist in FastAPI and API client helpers already exist.
- Voice calls use Twilio media streams, Azure STT, Groq LLM, and TTS.
- Post-call Celery analysis writes `conversation_analytics` and updates `conversations.outcome` and `had_tool_call`.
- Greeting fields exist in schema, but call greeting is not implemented in the voice runtime.
- `PGVECTOR` and `RAGFLOW` branches in the LLM pipeline are not implemented.
- Tool tables exist in schema, but execution runtime and dashboard management do not exist yet.
- BYO Twilio is not production-safe yet because `/voice` validates against platform Twilio auth token only.

Schema:
- V4 adds telephony providers, conversation analytics, turn signals, agent tools, tool executions, KB chunks, greeting fields, RAG fields, and tool flags.
- The v4 migration appears to reference `workspace_telephony_providers` from `phone_numbers.telephony_provider_id` before the table is created. Fix ordering before applying to a fresh database.

## Implementation Principles

- Keep each phase small enough to typecheck/build independently.
- Prefer existing query hooks, Supabase query modules, and API client patterns.
- Do not store raw Twilio auth tokens in normal tables. Use Supabase Vault or a backend-controlled secret path.
- Do not block live voice response on analytics, intent classification, RAG indexing, or tool calls unless the feature explicitly needs the result before answering.
- For browser website widgets, treat API keys as publishable unless domain restrictions are added. Do not expose server-secret credentials.
- Validate frontend with `pnpm --filter dashboard typecheck` and `pnpm --filter dashboard build`.
- Validate backend with `pytest` from `backend-AICaller` when backend code changes.

## Phase 0: Schema And Type Safety (APPLIED)

Goal: confirm V4 schema changes are applied and move work to backend wiring.

Notes:
- The v4 migrations in both `Web-AIcaller/packages/supabase/001_schema_v_4.sql` and
  `backend-AICaller/app/supabase/001_schema_v_4.sql` have been executed in
  Supabase. DB-related tasks from Phase 0 can be considered complete.

Remaining action items (backend-focused):
- Regenerate TypeScript DB types in `Web-AIcaller/packages/supabase/src/types` so frontend query helpers include V4 tables.
- Wire backend code to use the new schema fields/tables:
  - Honor `phone_numbers.telephony_provider_id` and resolve `workspace_telephony_providers` when validating webhooks.
  - Use `workspace_telephony_providers.vault_secret_id` to fetch provider credentials via Vault when handling BYO Twilio flows.
  - Ensure RLS policies and Vault access are documented and testable from the FastAPI service role.

Acceptance:
- DB migration applied and verified in Supabase (no action required here).
- Frontend types regenerated and query helpers updated to include new tables.
- Backend routes and call handling code use the new telephony provider and Vault fields correctly.

## Phase 1: Real API Keys Dashboard

Goal: let users create, view, and revoke real API keys for website/widget usage.

Files:
- `Web-AIcaller/apps/dashboard/app/(dashboard)/api-keys/page.tsx`
- `Web-AIcaller/apps/dashboard/hooks/use-api-keys.ts` (new)
- `Web-AIcaller/apps/dashboard/lib/query-keys.ts`
- `Web-AIcaller/packages/api-client/src/query.ts`
- `backend-AICaller/app/routers/api_keys.py`

Tasks:
- Replace mock API key state with React Query hooks.
- Use existing API client helpers:
  - `listApiKeys`
  - `createApiKey`
  - `revokeApiKey`
- Show the raw key only immediately after creation.
- Add copy action and clear warning that the key cannot be viewed again.
- Invalidate API key queries after create/revoke.
- Keep create/revoke JWT-only. Do not allow API key auth to manage keys.

Acceptance:
- User can create a key and see the returned raw `cm_...` key once.
- Existing keys list shows prefix, label, created date, last used date, and active/revoked state.
- Revoke disables a key and refreshes the list.
- `pnpm --filter dashboard typecheck` passes.

## Phase 2: Website Widget MVP

Goal: provide a customer-installable chat widget that uses `/query`.

Files:
- `Web-AIcaller/apps/web/public/callmind-widget.js` or a new package if preferred
- `Web-AIcaller/apps/dashboard/app/(dashboard)/api-keys/page.tsx`
- `Web-AIcaller/packages/api-client/src/query.ts`
- `backend-AICaller/app/routers/query.py`

Tasks:
- Build a lightweight embeddable browser script with:
  - floating launcher
  - chat panel
  - visitor ID persistence in localStorage
  - conversation ID persistence per visitor/session
  - SSE support for streamed assistant responses
  - API key and agent ID from script attributes
- Example snippet:
  ```html
  <script
    src="https://APP_DOMAIN/callmind-widget.js"
    data-agent-id="AGENT_ID"
    data-api-key="cm_xxx"
    data-theme="light"
    async
  ></script>
  ```
- Add dashboard UI to copy the install snippet.
- Add graceful error states for invalid key, inactive agent, and network failure.
- Decide whether the first version supports public keys only or requires domain restrictions.

Recommended backend hardening:
- Add optional allowed domains to API keys before production widget launch.
- Log `origin`, `visitor_id`, and `user_agent` for abuse investigation.

Acceptance:
- A static HTML page can load the widget and complete a streamed conversation through `/query`.
- The dashboard can generate a copyable snippet for a selected agent and API key.
- Messages are persisted to the same conversation when `conversation_id` is reused.

## Phase 3: BYO Twilio Production Flow

Goal: allow users to connect their own Twilio account and assign their own numbers safely.

Files:
- `Web-AIcaller/apps/dashboard/app/(dashboard)/phone-numbers/phone-numbers-client.tsx`
- `Web-AIcaller/apps/dashboard/hooks/use-phone-numbers.ts`
- `Web-AIcaller/packages/supabase/src/queries/phone-numbers.ts`
- `backend-AICaller/app/routers/voice.py`
- `backend-AICaller/app/config.py`
- New backend router, suggested: `backend-AICaller/app/routers/telephony.py`

Tasks:
- Add provider connection flow:
  - display name
  - Twilio Account SID
  - Twilio Auth Token
  - verify credentials via backend test call
  - store only Vault secret ID or backend-managed secret reference
  - create/update `workspace_telephony_providers`
- Update phone number assignment:
  - `phone_numbers.telephony_provider_id` points to the connected Twilio provider.
  - number can be assigned to an agent after provider is verified.
- Fix `/voice` signature validation:
  - Resolve called number from request.
  - Find matching `phone_numbers` row.
  - If platform number, validate with platform auth token.
  - If BYO number, load that provider's Twilio auth token from secure storage and validate with it.
- Add webhook setup instructions or auto-config endpoint:
  - Voice webhook URL should include enough context to resolve the number/provider.
  - Media Stream custom parameters must still pass `agent_id`, `caller_id`, and `call_sid`.
- Ensure inactive numbers or inactive providers reject calls cleanly.

Acceptance:
- User can connect Twilio credentials and verify them.
- User can attach a BYO Twilio number to an agent.
- Incoming calls to BYO numbers pass Twilio signature validation using the user's auth token.
- Platform numbers continue to work with platform credentials.

## Phase 4: Analytics Dashboard Upgrade

Goal: make analytics useful with data already available in V4.

Files:
- `Web-AIcaller/apps/dashboard/app/(dashboard)/analytics/page.tsx`
- `Web-AIcaller/apps/dashboard/hooks/use-analytics.ts`
- `Web-AIcaller/packages/supabase/src/queries/analytics.ts`
- `backend-AICaller/app/tasks/conversation.py`
- `backend-AICaller/app/routers/query.py`

Tasks:
- Add dashboard sections:
  - call/chat volume over time
  - outcome breakdown: resolved, unresolved, transferred, booked, hung up
  - sentiment distribution
  - top intents
  - average duration
  - tool-call rate
  - booked/resolved/unresolved counts
  - agent comparison table
- Add filters:
  - date range
  - agent
  - channel: voice/chat
  - outcome
- Extend text `/query` completion path to create or update analytics rows, not just voice Celery flows.
- Clearly handle empty states when `conversation_analytics` has no rows.

Acceptance:
- Analytics page gives useful numbers from real Supabase data.
- Voice and website chat both contribute analytics.
- Empty and loading states are professional and non-mock.

## Phase 5: Greeting And Conversation Behavior

Goal: make calls feel more natural immediately after connect.

Files:
- `backend-AICaller/app/ws/call_handler.py`
- `backend-AICaller/app/models/session.py`
- `backend-AICaller/app/pipeline/prompt.py`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/components/tabs/general-tab.tsx`
- `Web-AIcaller/packages/supabase/src/queries/agents.ts`

Tasks:
- Implement `send_greeting()` after the Twilio start event initializes session state.
- Respect `agents.greeting_enabled`.
- Use `agents.greeting_template` when present.
- Default greeting can use:
  - agent name
  - business/workspace name if available
  - caller name or caller ID if available
  - last topic only if reliably stored
- Stream greeting through the same TTS and Twilio mark flow as other assistant speech.
- Add dashboard controls:
  - greeting enabled switch
  - greeting template textarea
  - helper text listing supported variables
- Avoid blocking STT setup for too long. If needed, start STT first and speak greeting immediately after.

Acceptance:
- New calls hear the agent speak first when greeting is enabled.
- Turning off greeting makes the old listen-first behavior return.
- Custom template is used without breaking calls when variables are missing.

## Phase 6: Multilingual Support

Goal: make multilingual behavior explicit and configurable end to end.

Files:
- `backend-AICaller/app/pipeline/stt.py`
- `backend-AICaller/app/pipeline/prompt.py`
- `backend-AICaller/app/ws/call_handler.py`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/components/tabs/transcriber-tab.tsx`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/components/tabs/voice-tab.tsx`
- `Web-AIcaller/packages/supabase/001_schema_v_4.sql` if schema fields are missing

Tasks:
- Decide explicit schema fields:
  - `stt_language` or `stt_locale`
  - optional `response_language`
  - optional `auto_detect_language`
- If fields are not in schema, add an additive migration.
- Update dashboard transcriber settings with supported locales.
- Ensure Azure STT gets the selected locale.
- Ensure prompt language rule maps locale to response language.
- Verify TTS voice locale matches the target language where possible.

Acceptance:
- Agent can be configured for English, Hindi, and Marathi at minimum.
- STT, prompt behavior, and TTS voice are aligned.
- Existing agents without explicit language keep current behavior.

## Phase 7: Call End, Goodbye, And Basic Tools

Goal: add practical behavior tools without building the full tool ecosystem first.

Files:
- `backend-AICaller/app/ws/call_handler.py`
- `backend-AICaller/app/pipeline/llm.py`
- `backend-AICaller/app/tasks/conversation.py`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/components/tabs/advanced-tab.tsx`
- New backend module, suggested: `backend-AICaller/app/pipeline/tools.py`

Tasks:
- Add rule-based goodbye detection:
  - examples: "bye", "thank you bye", "that's all", "cut the call", "good night"
  - agent replies with a short closing line.
  - end the Twilio call using Twilio REST API when credentials are available.
  - fallback: close websocket cleanly if REST end-call is not possible.
- Add first booking tool:
  - slot-filling mode only for MVP.
  - collect name, date, time, service.
  - log execution in `tool_executions`.
  - mark `conversations.had_tool_call = true`.
  - set `outcome = booked` when booking completes.
- Add tool settings UI:
  - enable tool calling
  - enable booking tool
  - configure required fields and optional confirmation text.

Acceptance:
- Agent can naturally end a call after a goodbye phrase.
- Booking flow can capture required fields and persist a tool execution.
- Analytics can show tool-call rate and booked outcome.

## Phase 8: RAG And Search MVP

Goal: implement pgvector retrieval before considering RAGFlow.

Files:
- `backend-AICaller/app/pipeline/llm.py`
- `backend-AICaller/app/pipeline/prompt.py`
- `backend-AICaller/app/tasks/*`
- `backend-AICaller/app/clients/supabase.py`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/knowledge-bases/[id]/components/tabs/kb-documents-tab.tsx`
- `Web-AIcaller/packages/supabase/src/queries/knowledge-bases.ts`
- `Web-AIcaller/packages/supabase/src/queries/kb-documents.ts`

Tasks:
- Add indexing task:
  - load KB documents
  - chunk using KB `chunk_size` and `chunk_overlap`
  - create embeddings
  - insert `kb_document_chunks`
  - update `knowledge_bases.index_status`
- Add retrieval helper:
  - embed user query
  - vector similarity search
  - optional text search on `ts_vector`
  - merge/rank results
  - respect `agents.rag_top_k`
- Inject retrieved chunks into the prompt with strict "only use retrieved context when relevant" instructions.
- Add dashboard indexing controls:
  - chunk size
  - overlap
  - embedding provider/model
  - index/reindex button
  - index status

Acceptance:
- KB can be indexed from dashboard.
- Agent answers can include relevant KB context when `rag_provider` is pgvector.
- Non-indexed KBs fail gracefully with clear UI state.

## Phase 9: Live Turn Signals

Goal: add human behavior analytics without slowing calls.

Files:
- `backend-AICaller/app/ws/call_handler.py`
- `backend-AICaller/app/tasks/conversation.py`
- New backend module, suggested: `backend-AICaller/app/pipeline/signals.py`
- `Web-AIcaller/apps/dashboard/app/(dashboard)/conversations/[id]/components/conversation-detail-client.tsx`

Tasks:
- Add rule-based classifier for intent, sentiment, urgency, and topic.
- Store one row per turn in `turn_signals`.
- Add optional async LLM refinement task after rule-based signal is stored.
- Show latest signal in conversation detail:
  - intent badge
  - sentiment badge
  - urgency badge
  - topic
- Do not block STT, LLM response, or TTS on signal analysis.

Acceptance:
- Completed conversations have turn signal rows.
- Live or near-live conversation detail can show behavior signals.
- Voice latency is not noticeably affected.

## Recommended Execution Order

1. Phase 0: schema ordering and type safety.
2. Phase 1: real API keys dashboard.
3. Phase 2: website widget MVP.
4. Phase 3: BYO Twilio production flow.
5. Phase 4: analytics dashboard upgrade.
6. Phase 5: greeting behavior.
7. Phase 6: multilingual support.
8. Phase 7: goodbye and booking tools.
9. Phase 8: pgvector RAG.
10. Phase 9: live turn signals.

This order unlocks user-facing value early: real API keys, website widget, BYO Twilio, and analytics. Human behavior, tools, multilingual, and RAG then build on stable data and integration surfaces.

## Validation Checklist

Frontend:
- `pnpm --filter dashboard typecheck`
- `pnpm --filter dashboard build`
- Manual browser check for:
  - API keys page
  - phone numbers page
  - analytics page
  - agent settings tabs
  - widget snippet flow

Backend:
- `pytest`
- Manual API checks for:
  - `/api-keys`
  - `/query` with JWT
  - `/query` with API key
  - `/voice` with platform Twilio signature
  - `/voice` with BYO Twilio signature after Phase 3

Database:
- Apply v4 migration on a fresh local database.
- Verify RLS still prevents cross-workspace access.
- Verify deleting an agent cascades to related V4 rows through existing foreign keys.

## Known Risks And Decisions

- BYO Twilio cannot be considered complete until provider-specific signature validation is implemented.
- Website widget API keys are public in browser contexts unless domain restrictions are added.
- Supabase Vault access from FastAPI may require a service-role path or RPC. Do not improvise raw credential storage in normal app tables.
- Current post-call analytics are heuristic. Deep analytics can be added later with an LLM task, but the dashboard should first expose the data already available.
- Call ending via Twilio REST requires access to the correct account credentials. Platform and BYO calls must resolve credentials differently.
- Multilingual support is partially present in prompt/STT behavior, but schema and dashboard controls need to make it explicit.
- RAGFlow should wait until pgvector MVP is working unless there is a hard product requirement for RAGFlow.
