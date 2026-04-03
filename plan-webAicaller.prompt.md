## Plan: Turborepo FastAPI Integration (Chat + Talk)

Set up a shared, type-safe API integration foundation in Web-AIcaller so the dashboard can reliably call the Python FastAPI backend in local Docker and production, starting with agent chat and talk flows. The recommended path is to extract backend API access into a new shared package, keep JWT as the primary dashboard auth path, preserve existing dummy toggles for safe rollout, and ship chat + talk behind clear verification gates.

**Steps**
1. Phase 1: Contract and environment alignment.
2. Define canonical API targets and environment behavior across local and prod: local uses http://localhost:8000, production uses https://api.iamspiderman.me, and dashboard toggles dummy behavior explicitly with NEXT_PUBLIC_DUMMY_QUERY/NEXT_PUBLIC_DUMMY_API_KEYS.
3. Document domain migration guardrail as an explicit compatibility decision: api.callmind.com treated as legacy/reference only unless a temporary dual-domain fallback is required.
4. Add a single frontend environment access layer in dashboard (read-only wrapper around process.env) so all backend URL and feature-flag reads come from one module. This blocks accidental scatter of env logic. Depends on step 2.
5. Phase 2: Shared API client package in Turborepo.
6. Create packages/api-client with clear boundaries: transport client, auth header injector hook, endpoint builders, stream parser utility, typed errors, and minimal public exports for dashboard consumption.
7. Move current FastAPI helpers from apps/dashboard/lib/fastapi.ts into package primitives while preserving behavior parity for /query and /api-keys. Keep a thin compatibility shim in dashboard during transition. Depends on step 6.
8. Normalize error handling in the package: map HTTP/network/parse errors to one ApiError shape so UI components and hooks can branch on status consistently.
9. Add cancellation support for streaming requests (AbortController) to prevent leaked streams when agent chat screen unmounts or user sends a new message quickly.
10. Phase 3: Chat flow integration (first functional slice).
11. Wire agent chat UI to shared api-client streaming path for POST /query with JWT auth first, preserving conversation_id lifecycle from first delta packet through subsequent turns.
12. Preserve dummy-mode behavior as a runtime branch in the dashboard integration layer so local frontend work still functions if backend is unavailable. Depends on step 11.
13. Add telemetry/log points around stream lifecycle (start, first token latency, done/error) for easier debugging in Docker and deployed environments.
14. Phase 4: Talk flow integration and voice readiness.
15. Map dashboard “Talk” action to backend voice flow contract and ensure integration surfaces required agent_id and callback expectations (/voice and Twilio stream path are backend-driven, dashboard role is orchestration/validation UI).
16. Add frontend-side diagnostics/guardrails for known operational issues: missing Twilio config, CORS/domain mismatch, and delayed API-key revoke effect due to Redis TTL.
17. Define fallback UX for voice failures: actionable error message + retry path + pointer to health endpoint status. Depends on step 15.
18. Phase 5: Hardening and rollout.
19. Add package-level unit tests for stream parsing, auth header precedence, and error mapping; add dashboard integration tests for chat happy path + auth failure path.
20. Add deployment checklist for env correctness (dashboard + backend + Twilio webhook domain) and release gating criteria for flipping dummy flags to false.

**Relevant files**
- d:/sidechicks/CallMind/Web-AIcaller/apps/dashboard/lib/fastapi.ts — existing FastAPI calls and current streaming parser to extract/migrate.
- d:/sidechicks/CallMind/Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/chat/page.tsx — primary chat UI integration point for streaming + conversation threading.
- d:/sidechicks/CallMind/Web-AIcaller/apps/dashboard/app/(dashboard)/agents/[id]/components/agent-detail-master.tsx — talk/chat entry actions and orchestration UX.
- d:/sidechicks/CallMind/Web-AIcaller/apps/dashboard/middleware.ts — auth assumptions and local auth bypass behavior constraints.
- d:/sidechicks/CallMind/Web-AIcaller/apps/dashboard/.env.local.example — local env template alignment for backend URL + dummy flags.
- d:/sidechicks/CallMind/Web-AIcaller/packages/supabase/src/queries/agents.ts — reference pattern for shared package design (typed data-access style).
- d:/sidechicks/CallMind/Web-AIcaller/packages/supabase/src/queries/conversations.ts — reference for typed query/function boundaries.
- d:/sidechicks/CallMind/Web-AIcaller/turbo.json — ensure package tasks/env dependencies are correctly wired for caching/build correctness.
- d:/sidechicks/CallMind/backend-AICaller/app/routers/query.py — source contract for /query request/stream response behavior.
- d:/sidechicks/CallMind/backend-AICaller/app/routers/voice.py — source contract for /voice webhook/TwiML behavior.
- d:/sidechicks/CallMind/backend-AICaller/app/middleware/auth.py — authoritative JWT/API-key auth behavior for frontend assumptions.
- d:/sidechicks/CallMind/backend-AICaller/app/config.py — backend CORS/public URL/env constraints that affect frontend connectivity.

**Verification**
1. Local Docker verification: backend up on localhost:8000, dashboard points NEXT_PUBLIC_FASTAPI_URL to local backend, dummy flags false, successful streamed reply from /query with valid JWT.
2. Chat continuity verification: first message creates conversation_id, second message reuses it, and transcript reflects threaded conversation.
3. Error-path verification: expired JWT returns 401/403 with expected UI message; network interruption cancels stream cleanly without stale UI state.
4. Voice readiness verification: from dashboard agent section, talk flow triggers expected backend voice orchestration prerequisites and reports meaningful failures when Twilio/backend config is incomplete.
5. Production config verification: dashboard build uses https://api.iamspiderman.me, backend CORS allows dashboard origin, Twilio webhook points to production voice endpoint for selected agent_id.
6. Regression verification: existing dashboard data hooks and non-agent pages remain unaffected after fastapi.ts extraction.

**Decisions**
- Included scope: foundational API client architecture plus first backend-integrated agent chat and talk flow.
- Excluded scope: redesign of backend endpoints, deep Twilio server-side pipeline refactors, and non-agent dashboard feature migration to api-client in the first pass.
- Auth decision: Supabase JWT is primary for dashboard first; API-key support remains available and can be elevated in a later iteration.
- Package decision: use a new shared package (packages/api-client) instead of keeping backend calls app-local.
- Domain decision: production target is api.iamspiderman.me.

**Further Considerations**
1. OpenAPI/type-sync strategy recommendation: Option A generate TS types from FastAPI OpenAPI for contract safety, Option B hand-maintained TS interfaces for speed. Recommendation: Option A after initial wiring if time-constrained now.
2. Rollout strategy recommendation: Option A enable real chat first then real talk, Option B enable both together under one feature flag. Recommendation: Option A for lower integration risk while still building both paths now.