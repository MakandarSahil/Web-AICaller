# AICaller / CallMind — Master Project Context

> Paste this at the start of any new Claude chat to restore full context.
> Last updated: March 2026
> Current focus: **Frontend v1 — marketing site (apps/web) + full dashboard (apps/dashboard)**
> Backend Phase 3: complete. Supabase schema v3: deployed.

---

## Product

**Name:** CallMind (brand) / aicaller (repo naming)

**What it is:** AI-powered voice + query platform. Businesses sign up, configure an
AI agent with their knowledge base, get a phone number, and the agent answers calls
and text queries intelligently — via phone or a website chatbot widget.

**Stage:** V1 active development. Final year B.E./B.Tech Computer Engineering mega project.

**V1 LLM strategy:** Full-context dump (Groq) — no RAG. RAG is Phase 4 internal swap only.

---

## Repositories

### 1. aicaller-frontend (Turborepo monorepo)
- **GitHub:** MakandarSahil/Web-AICaller
- **Package manager:** pnpm (pnpm-workspace.yaml)
- **Node version:** 20
- **Deployed:** Vercel
- **Apps:**
  - `apps/web` → marketing site → `web-aicaller-prod`
  - `apps/dashboard` → business dashboard → `dashboard-aicaller-dev` + `dashboard-aicaller-prod`
- **Packages:**
  - `packages/supabase` → shared Supabase client (browser + server + middleware + types)
  - `packages/ui` → shared shadcn/ui components
  - `packages/config` → shared Tailwind, TS, ESLint configs
- **Tech:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand, TanStack Query,
  React Hook Form + Zod, Supabase Auth (@supabase/ssr), Supabase Realtime
- **Current state:** CI/CD live on Vercel. Basic dummy pages for deployment testing only.
  No real UI built yet — **starting now.**

### apps/web — Marketing Site Scope
```
Pages:
  /                  Landing page — hero, features, pricing, CTA
  /about             About the product
  /pricing           Pricing tiers
  /demo              Live demo call page ← KEY FEATURE (see below)
  /blog              (optional, v2)

No Supabase usage in apps/web v1 (marketing only).
No auth. No dashboard features.
```

### Demo Call Feature (apps/web /demo)
The marketing site has a live demo where visitors can call a pre-configured
CallMind agent to experience the product before signing up.

**How it works:**
- A dedicated demo Twilio number is configured in number_pool pointing to a
  pre-built demo agent (stored in Supabase, workspace = platform demo workspace)
- The /demo page shows the number prominently: "Call +91-XXXX-XXXXXX to try it now"
- Optional: embed a browser-based call widget (Twilio Client SDK / WebRTC) so
  visitors can try it directly in the browser without using their own phone
- The demo agent has a fixed system_prompt explaining CallMind's features,
  answers questions about the product, and can direct to the signup page

**V1 implementation (simple):**
- Show the demo phone number on the page — visitor calls from their phone
- No browser WebRTC needed — just display the number + instructions
- Demo agent configured manually in Supabase

**V2 enhancement:**
- Embed Twilio Client SDK for in-browser voice call (no phone needed)
- Requires: Twilio Access Token endpoint in FastAPI, browser mic permission

**No auth required on /demo — fully public page.**

### Branch Strategy
```
feature/*  → PR to develop
develop    → auto-deploys dashboard-dev (dashboard-aicaller-dev on Vercel)
main       → approval gate → deploys web-prod + dashboard-prod
```

### CI/CD Pipelines (GitHub Actions)

**Dashboard CI/CD** — trigger: push to `develop` or `main` on `apps/dashboard/**` or `packages/**`
- `develop` → environment: `dashboard-dev` (secret: `DASHBOARD_VERCEL_PROJECT_ID_DEV`)
- `main` → environment: `dashboard-production` (secret: `DASHBOARD_VERCEL_PROJECT_ID_PROD`)
- Steps: pnpm install → vercel pull → vercel build --prod → vercel deploy --prebuilt --prod

⚠️ **CI/CD Warning:** Both `develop` and `main` use `--prod` flag in `vercel deploy`.
This is fine ONLY if `DASHBOARD_VERCEL_PROJECT_ID_DEV` and `DASHBOARD_VERCEL_PROJECT_ID_PROD`
are **different** Vercel project IDs. If they are the same, every develop push overwrites
production. **Verify these two secrets are different before pushing real UI.**

**Web CI/CD** — trigger: push to `main` or `develop` on `apps/web/**` or `packages/**`
- Always deploys to production (secret: `WEB_VERCEL_PROJECT_ID`)

**Required GitHub Secrets:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
DASHBOARD_VERCEL_PROJECT_ID_DEV
DASHBOARD_VERCEL_PROJECT_ID_PROD
WEB_VERCEL_PROJECT_ID
```

### 2. aicaller-backend (separate repo)
- **Deployed:** Azure VM via Docker Compose
- **Status:** ✅ Phase 3 complete — voice pipeline + text query + auth + Swagger
- **Tech:** Python 3.11+, FastAPI, Redis, Celery, Traefik

---

## Infrastructure

### Azure VM (backend)
- OS: Ubuntu 24 LTS · vCPU: 2 · RAM: 4GB · Disk: 123GB
- SSH user: spiderman · Deploy path: `/home/spiderman/aicaller/prod/`

### Docker Compose (prod)
| Service | Image | Memory |
|---------|-------|--------|
| Traefik | traefik:v3.6.5 | 128MB |
| FastAPI | dockerhub/aicaller-backend:latest | 512MB |
| Redis | redis:7-alpine | 256MB |
| Celery worker | same image, different CMD | 512MB |

---

## Architecture — Two Backends, One Frontend

```
Dashboard (Next.js — Vercel)
  │
  ├── Supabase (direct via supabase-js + @supabase/ssr)
  │     Auth, agent CRUD, KB management, file uploads,
  │     conversation history, realtime subscriptions
  │
  └── FastAPI (REST — api.callmind.com)
        POST /query      → text query → SSE streaming response
        GET  /api-keys   → list API keys
        POST /api-keys   → create API key
        DELETE /api-keys → revoke API key

Twilio → FastAPI (never through dashboard)
  POST /voice?agent_id=X → TwiML webhook
  WS   /call?agent_id=X  → audio stream → STT → LLM → TTS
```

**Golden rule:** Supabase service role key = FastAPI ONLY. Dashboard always uses anon key + RLS.

---

## Supabase — Schema v3 (deployed ✅)

### 13 Tables

```
profiles
  id uuid pk → auth.users
  full_name text, phone text, avatar_url text
  account_type enum (individual|business)  default individual
  is_admin bool  default false  ← platform admin only
  created_at, updated_at

workspaces
  id uuid pk
  owner_id uuid → profiles.id  [UNIQUE — one workspace per user v1]
  name text, business_name text, industry text, website text
  size enum (xs|sm|md|lg|xl)
  status enum (active|inactive|suspended)  default active
  created_at, updated_at

knowledge_bases
  id uuid pk
  workspace_id uuid → workspaces.id
  name text, description text
  rag_kb_id text  ← Phase 4: RAGFlow/pgvector collection ID
  created_at, updated_at

kb_documents
  id uuid pk
  kb_id uuid → knowledge_bases.id
  name text
  type enum (pdf|docx|txt|plain_text)
  content text  ← plain_text stored here; extracted text for files
  file_path text  ← Supabase Storage path for file types
  file_size integer
  status enum (processing|ready|error)  default processing
  rag_document_id text, rag_kb_id text
  rag_status enum (pending|indexed|error)  default pending
  created_at, updated_at
  CHECK: plain_text requires content; file types require file_path

agents
  id uuid pk
  workspace_id uuid → workspaces.id
  name text, persona text, system_prompt text
  stt_provider text (default azure), stt_model text (default default)
  tts_provider text (default azure), tts_model text (default default)
  tts_voice text (default en-IN-PrabhatNeural)
  llm_provider text (default groq), llm_model text (default llama-3.3-70b-versatile)
  rag_provider text (default none)  ← INTERNAL ONLY — NEVER show in UI
  status enum (active|inactive|suspended)  default active
  is_default bool  default false  ← auto-created on signup
  created_at, updated_at

agent_knowledge_bases
  id uuid pk
  agent_id uuid → agents.id
  kb_id uuid → knowledge_bases.id
  attached_at timestamptz
  UNIQUE(agent_id, kb_id)

number_pool  ← admin only, users never see
  id uuid pk
  number text UNIQUE (E.164 e.g. +919876543210)
  provider text (default twilio), provider_sid text
  is_assigned bool  default false
  assigned_to uuid → workspaces.id
  webhook_configured bool  default false
  created_at

phone_numbers
  id uuid pk
  workspace_id uuid → workspaces.id
  agent_id uuid → agents.id
  number text, number_type enum (platform|own)
  provider text, provider_sid text
  webhook_url text  ← https://api.callmind.com/voice?agent_id=X
  is_active bool  default true
  created_at

callers
  id uuid pk
  workspace_id uuid → workspaces.id
  phone_number text (E.164)
  first_seen_at, last_seen_at, call_count int  default 0
  UNIQUE(workspace_id, phone_number)

conversations
  id uuid pk
  agent_id uuid → agents.id
  caller_id uuid → callers.id  (null for text/API sessions)
  session_id text  ← Twilio CallSid or UUID
  channel enum (twilio|text_api|websocket)
  status enum (active|completed|failed)  default active
  visitor_id text  ← optional external widget visitor ID
  kb_snapshot_ids uuid[]  ← KB IDs attached at call time
  summary text  ← LLM-generated, user-editable
  summary_edited bool  default false
  message_count int  default 0  ← auto-incremented by trigger
  started_at, ended_at

messages
  id uuid pk
  conversation_id uuid → conversations.id
  role enum (user|assistant)
  content text
  created_at

agent_usage
  id uuid pk
  agent_id uuid → agents.id  [UNIQUE]
  total_calls int, total_messages int, last_active_at
  ← DB trigger owns updates. Celery does NOT touch this table.

api_keys
  id uuid pk
  workspace_id uuid → workspaces.id
  name text  ← e.g. "Website chatbot"
  key_hash text UNIQUE  ← SHA-256 of raw key. Raw key never stored.
  key_prefix text  ← first 16 chars shown in dashboard e.g. cm_live_a1b2c3d4
  is_active bool  default true
  created_at, last_used_at
  created_by uuid → profiles.id
```

### 5 Triggers (auto-maintained — no manual action needed)
```
1. auth.users INSERT
   → INSERT profiles + workspaces + agents (is_default=true) + agent_usage

2. messages INSERT
   → UPDATE conversations SET message_count = message_count + 1

3. conversations UPDATE WHERE status → 'completed'
   → UPSERT agent_usage (total_calls+1, total_messages+message_count)
   → UPDATE callers SET last_seen_at=now(), call_count+1
   NOTE: Celery does NOT touch agent_usage — DB trigger owns it atomically

4. agents INSERT → INSERT agent_usage ON CONFLICT DO NOTHING

5. profiles/workspaces/agents/kb_documents/knowledge_bases UPDATE
   → SET updated_at = now()
```

### RLS Policy Chain
```
profiles          → id = auth.uid()
workspaces        → owner_id = auth.uid()
knowledge_bases   → workspace_id = my_workspace_id()
kb_documents      → kb_id IN (owned KBs)
agents            → workspace_id = my_workspace_id()
agent_kb          → agent_id IN (owned agents)
phone_numbers     → workspace_id = my_workspace_id()
callers           → workspace_id = my_workspace_id()
conversations     → agent_id IN (owned agents)
messages          → conversation_id IN (owned conversations)
agent_usage       → agent_id IN (owned agents) — SELECT only
api_keys          → workspace_id = my_workspace_id()
number_pool       → admin only (is_admin=true on profiles)

FastAPI → service_role key → bypasses ALL RLS
```

### Storage Buckets (both created ✅)
```
knowledge-bases  private  50MB  PDF+DOCX+TXT
                 path: {workspace_id}/{kb_id}/{document_id}_{filename}

avatars          public   3MB   image/*
                 path: {user_id}/avatar
```
⚠️ Storage RLS policies = 0. Run the storage policy block from 001_schema_v3.sql.

### Realtime enabled on: `conversations`, `messages` ✅

---

## packages/supabase — Shared Package

**Package name:** `@aicaller/supabase`

### File Structure
```
packages/supabase/
  src/
    client.ts            browser client (anon key) → createClient()
    server.ts            server client (SSR) → createServerSupabaseClient()
    middleware.ts        session refresh helper → updateSession()
    types/
      database.types.ts  generated (pnpm gen:types) — commit to git
      index.ts           re-exports types
  index.ts               re-exports everything
  package.json
  tsconfig.json
```

### client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### server.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types/database.types'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

### middleware.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser()
  return supabaseResponse
}
```

### apps/dashboard/middleware.ts
```typescript
import { updateSession } from '@aicaller/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — no auth needed
  const publicRoutes = ['/login', '/signup']
  if (publicRoutes.includes(pathname)) {
    return await updateSession(request)
  }

  // Refresh session + check auth
  const response = await updateSession(request)
  const supabase = // create supabase inside middleware
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to onboarding if workspace not yet named
  if (pathname !== '/onboarding') {
    // check if onboarding complete
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Generate types command
```bash
# Add to root package.json scripts:
"gen:types": "supabase gen types typescript --project-id <your-project-id> --schema public > packages/supabase/src/types/database.types.ts"

# Run:
pnpm gen:types
```

---

## Dashboard — All Pages & Data Sources

### Route Structure
```
apps/dashboard/app/
  (auth)/
    login/page.tsx
    signup/page.tsx
    onboarding/page.tsx
  (dashboard)/
    layout.tsx                 ← sidebar + nav shell, auth guard
    page.tsx                   ← home / overview
    agents/
      page.tsx                 ← agent list
      new/page.tsx             ← create agent
      [id]/page.tsx            ← agent detail + edit
      [id]/chat/page.tsx       ← test chat with this agent
    knowledge-bases/
      page.tsx                 ← KB list
      new/page.tsx             ← create KB
      [id]/page.tsx            ← KB detail + document list
    phone-numbers/
      page.tsx                 ← assigned numbers
    conversations/
      page.tsx                 ← conversation list + filters
      [id]/page.tsx            ← transcript + summary
    api-keys/
      page.tsx                 ← list + create + revoke
    settings/
      page.tsx                 ← profile + workspace
    admin/
      page.tsx                 ← number pool (is_admin only)
middleware.ts
```

### What Each Page Reads/Writes

**Auth**
- login: `supabase.auth.signInWithPassword({ email, password })`
- signup: `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
  - trigger auto-creates: profile + workspace + default agent + agent_usage
- onboarding: `UPDATE workspaces SET business_name, industry, size, website WHERE owner_id=uid`
- logout: `supabase.auth.signOut()`

**Home / Overview**
- `SELECT count(*) FROM agents WHERE workspace_id = my_workspace_id()`
- `SELECT * FROM agent_usage WHERE agent_id IN (owned agents)`
- `SELECT count(*), status FROM conversations WHERE ... GROUP BY status`
- Realtime: `conversations` INSERT → update live call count

**Agents**
- List: `SELECT * FROM agents WHERE workspace_id = my_workspace_id() ORDER BY created_at DESC`
- Create: `INSERT INTO agents (workspace_id, name, persona, system_prompt, tts_voice, ...)`
- Update: `UPDATE agents SET name, persona, system_prompt, tts_voice, llm_model, stt_model, status WHERE id=X`
- Delete: `DELETE FROM agents WHERE id=X` (check not last agent)
- Attached KBs: `SELECT kb_id FROM agent_knowledge_bases WHERE agent_id=X`
- Attach KB: `INSERT INTO agent_knowledge_bases (agent_id, kb_id)`
- Detach KB: `DELETE FROM agent_knowledge_bases WHERE agent_id=X AND kb_id=Y`

**Agent Chat (test)**
- Calls FastAPI `POST /query` (JWT auth) via `lib/fastapi.ts → queryAgent()`
- SSE streaming — renders response word by word
- Saves conversation_id to continue thread
- Use dummy API during dev (NEXT_PUBLIC_USE_DUMMY_API=true)

**Knowledge Bases**
- List KBs: `SELECT * FROM knowledge_bases WHERE workspace_id = my_workspace_id()`
- Create KB: `INSERT INTO knowledge_bases (workspace_id, name, description)`
- Documents: `SELECT * FROM kb_documents WHERE kb_id=X ORDER BY created_at DESC`
- Upload file:
  ```typescript
  const path = `${workspaceId}/${kbId}/${docId}_${filename}`
  await supabase.storage.from('knowledge-bases').upload(path, file)
  await supabase.from('kb_documents').insert({ kb_id, name, type, file_path: path, file_size, status: 'processing' })
  ```
- Add plain text: `INSERT INTO kb_documents (kb_id, name, type='plain_text', content, status='ready')`
- Delete doc: storage delete + `DELETE FROM kb_documents WHERE id=X`
- Status badge: processing (spinner) | ready (green) | error (red)

**Phone Numbers**
- List: `SELECT pn.*, a.name as agent_name FROM phone_numbers pn JOIN agents a ON a.id=pn.agent_id WHERE pn.workspace_id = my_workspace_id()`
- Show webhook_url per number (for reference)
- Request number: form → in v1 admin manually assigns (no self-serve API yet)

**Conversations**
- List: `SELECT c.*, a.name as agent_name FROM conversations c JOIN agents a ON a.id=c.agent_id WHERE a.workspace_id = my_workspace_id() ORDER BY c.started_at DESC`
- Filters: by agent_id, channel, status, date range
- Realtime: subscribe to `conversations` table → show active calls live
- Single: `SELECT * FROM messages WHERE conversation_id=X ORDER BY created_at ASC`
- Edit summary: `UPDATE conversations SET summary=X, summary_edited=true WHERE id=X`
- Realtime transcript: subscribe to `messages` INSERT WHERE conversation_id=X

**API Keys**
- List: `GET /api-keys` with JWT header
- Create: `POST /api-keys` body `{name}` → show `key` field ONCE in copy modal
- Revoke: `DELETE /api-keys/{id}` → confirm dialog
- Use dummy responses during dev

**Settings**
- Load: `SELECT * FROM profiles WHERE id = auth.uid()` + `SELECT * FROM workspaces WHERE owner_id = auth.uid()`
- Update profile: `UPDATE profiles SET full_name, phone WHERE id = auth.uid()`
- Upload avatar: `supabase.storage.from('avatars').upload(`${uid}/avatar`, file)` → `UPDATE profiles SET avatar_url`
- Update workspace: `UPDATE workspaces SET name, business_name, industry, website, size WHERE owner_id = auth.uid()`

**Admin (is_admin=true only)**
- Number pool: `SELECT * FROM number_pool ORDER BY created_at DESC`
- Add number: `INSERT INTO number_pool (number, provider, provider_sid)`
- Assign to workspace: UPDATE number_pool + INSERT phone_numbers + set webhook_configured=true

---

## FastAPI — Full API Reference

Base URL prod: `https://api.callmind.com`
Base URL dev:  `http://localhost:8000`
Swagger:       `/docs` (always on — auth required per endpoint)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | none | Service info |
| GET | `/health` | none | Liveness + Redis check |
| GET/POST | `/voice?agent_id=X` | Twilio sig | TwiML webhook |
| WS | `/call?agent_id=X` | internal | Voice pipeline |
| POST | `/query` | JWT or API key | Text query → SSE/JSON |
| GET | `/api-keys` | JWT or API key | List API keys |
| POST | `/api-keys` | JWT only | Create API key |
| DELETE | `/api-keys/{id}` | JWT only | Revoke API key |

### POST /query
```json
// Request
{
  "agent_id": "uuid",
  "text": "What are your hours?",
  "conversation_id": "uuid",  // optional — continue thread
  "stream": true,             // default true
  "visitor_id": "uuid"        // optional — widget cross-session
}

// Auth: Authorization: Bearer <supabase_jwt>  OR  X-API-Key: cm_live_xxx

// Response stream=true (text/event-stream):
data: {"delta": "Our hours are", "conversation_id": "uuid"}
data: {"delta": " 9am to 6pm."}
data: [DONE]

// Response stream=false:
{"text": "Our hours are 9am to 6pm.", "conversation_id": "uuid", "agent_id": "uuid"}
```

---

## lib/fastapi.ts — Dashboard FastAPI Client

```typescript
// apps/dashboard/lib/fastapi.ts

import { createClient } from '@aicaller/supabase/client'

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL

// Per-feature dummy toggles — switch one at a time during backend integration
const DUMMY_QUERY    = process.env.NEXT_PUBLIC_DUMMY_QUERY === 'true'
const DUMMY_API_KEYS = process.env.NEXT_PUBLIC_DUMMY_API_KEYS === 'true'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${session.access_token}` }
}

// ── Text query (streaming) ────────────────────────────────────────────────────
export async function queryAgent(
  agentId: string,
  text: string,
  conversationId: string | undefined,
  onDelta: (delta: string) => void,
  onConversationId: (id: string) => void
) {
  if (DUMMY_QUERY) {
    onConversationId(crypto.randomUUID())
    const words = "Hello! I'm your AI assistant. How can I help you today?".split(' ')
    for (const word of words) {
      await new Promise(r => setTimeout(r, 80))
      onDelta(word + ' ')
    }
    return
  }

  const headers = await getAuthHeaders()
  const res = await fetch(`${FASTAPI_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ agent_id: agentId, text, conversation_id: conversationId, stream: true }),
  })

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let convIdSent = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') return
      const parsed = JSON.parse(data)
      if (!convIdSent && parsed.conversation_id) {
        onConversationId(parsed.conversation_id)
        convIdSent = true
      }
      if (parsed.delta) onDelta(parsed.delta)
    }
  }
}

// ── API key management ────────────────────────────────────────────────────────
export async function listApiKeys() {
  if (DUMMY_API_KEYS) return [
    { id: '1', name: 'Website chatbot', key_prefix: 'cm_live_a1b2c3d4', is_active: true, created_at: new Date().toISOString(), last_used_at: null }
  ]
  const headers = await getAuthHeaders()
  const res = await fetch(`${FASTAPI_URL}/api-keys`, { headers })
  return res.json()
}

export async function createApiKey(name: string) {
  if (DUMMY_API_KEYS) return {
    id: crypto.randomUUID(), name, key: 'cm_live_' + Math.random().toString(36).slice(2).repeat(3),
    key_prefix: 'cm_live_a1b2c3d4', created_at: new Date().toISOString()
  }
  const headers = await getAuthHeaders()
  const res = await fetch(`${FASTAPI_URL}/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ name }),
  })
  return res.json()
}

export async function revokeApiKey(id: string) {
  if (DUMMY_API_KEYS) return { id, revoked: true }
  const headers = await getAuthHeaders()
  const res = await fetch(`${FASTAPI_URL}/api-keys/${id}`, { method: 'DELETE', headers })
  return res.json()
}
```

---

## Environment Variables

### apps/dashboard/.env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000    # https://api.callmind.com for prod
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Per-feature dummy toggles — flip to false one at a time during backend integration
NEXT_PUBLIC_DUMMY_QUERY=true       # agent chat via POST /query
NEXT_PUBLIC_DUMMY_API_KEYS=true    # api key CRUD via /api-keys
```

### apps/web/.env.local
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
NEXT_PUBLIC_DEMO_PHONE_NUMBER=+91XXXXXXXXXX    # demo Twilio number for /demo page
# No Supabase keys needed — marketing site has no auth in v1
```

### Vercel (dashboard-dev + dashboard-prod environments)
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_FASTAPI_URL=https://api.callmind.com
NEXT_PUBLIC_APP_URL=https://dashboard.callmind.com
NEXT_PUBLIC_DUMMY_QUERY=false
NEXT_PUBLIC_DUMMY_API_KEYS=false
```

### Vercel (web-prod environment)
```bash
NEXT_PUBLIC_APP_URL=https://callmind.com
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.callmind.com
NEXT_PUBLIC_DEMO_PHONE_NUMBER=+91XXXXXXXXXX
```

### FastAPI (.env on VM / GitHub Secrets)
```bash
ENV=production
PUBLIC_URL=https://api.callmind.com
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...    # NEVER in frontend
REDIS_URL=redis://redis:6379/0
AZURE_SPEECH_KEY=xxx · AZURE_SPEECH_REGION=eastus
GROQ_API_KEY=xxx · GROQ_MODEL=llama-3.3-70b-versatile
TWILIO_ACCOUNT_SID=xxx · TWILIO_AUTH_TOKEN=xxx
CORS_ORIGINS=https://dashboard.callmind.com
ACME_EMAIL=xxx@xxx.com · API_DOMAIN=api.callmind.com
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| State management | Zustand (global), TanStack Query (server state) |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth — Email+Password v1 |
| Common backend | Supabase (Postgres, Storage, Realtime, RLS) |
| Shared FE package | @aicaller/supabase |
| AI backend | Python FastAPI + WebSocket |
| STT | Azure Cognitive Speech (streaming push stream) |
| LLM v1 | Groq API (llama-3.3-70b-versatile, full context dump) |
| LLM v2 | RAGFlow / pgvector (Phase 4 — internal swap only) |
| TTS | Azure Neural TTS (sentence streaming, mulaw output) |
| Telephony | Twilio Media Streams WebSocket |
| Cache | Redis (agent config, KB docs, caller history, auth) |
| Task queue | Celery + Redis |
| Reverse proxy | Traefik (auto SSL via Let's Encrypt) |
| Containers | Docker Compose |
| Registry | Docker Hub private → ACR at K8s |
| VM | Azure 2vCPU / 4GB / Ubuntu 24 |
| CI/CD | GitHub Actions + Vercel |
| Future infra | K3s → K8s/AKS |

---

## Phase Status

```
✅ Phase 1   Backend CI/CD (GitHub Actions + Docker + Azure VM)
✅ Phase 1   Frontend CI/CD (GitHub Actions + Vercel + dummy pages)
✅ Phase 2   Supabase schema v3 (13 tables, triggers, RLS, storage — deployed)
✅ Phase 3   FastAPI voice pipeline (STT→LLM→TTS, /voice, /call, /query)
✅ Phase 3   FastAPI auth (JWT + API key), /api-keys endpoints, Swagger UI

🔜 NOW       Frontend v1
             apps/web  → marketing site + /demo page
             apps/dashboard → all dashboard pages

🔜 Phase 3b  POST /query fully stateful (conv history, auth — partially done)
⏳ Phase 4   RAG (RAGFlow/pgvector) + WhatsApp + web widget + K3s
             V2: In-browser demo call (Twilio Client SDK/WebRTC)
             V2: Booking/action tools (tool calling in pipeline)
```

---

## Frontend Build Order

### apps/web (marketing site) — build first, simpler
```
1.  Layout + shared nav/footer
2.  / landing page (hero, features, how it works, CTA → signup)
3.  /pricing page
4.  /demo page
    → show demo phone number prominently
    → instructions to call from their phone
    → (V2: embed browser call widget)
5.  /about page
```

### apps/dashboard — build after web or in parallel
```
1.  packages/supabase scaffold
    → client.ts, server.ts, middleware.ts
    → pnpm gen:types → database.types.ts

2.  apps/dashboard middleware.ts
    → route protection, session refresh

3.  Auth pages
    → /login, /signup, /onboarding

4.  Dashboard layout shell
    → sidebar navigation, top bar, auth guard

5.  Home / overview
    → stats cards, active calls, recent conversations

6.  Agents
    → list, create, edit, delete
    → KB attach/detach

7.  Knowledge Bases
    → list, create, document upload, plain text add, delete

8.  Agent Chat (test interface)
    → SSE streaming chat UI, dummy API

9.  Conversations
    → list with filters, transcript view, summary edit, realtime

10. Phone Numbers
    → list, request flow, webhook URL display

11. API Keys
    → list, create (show-once modal), revoke

12. Settings
    → profile, avatar, workspace details

13. Admin panel
    → number pool, assign numbers (is_admin only)
```

---

## Key Decisions — All Frozen

| Decision | Choice |
|----------|--------|
| Auth | Supabase Email+Password v1 |
| Workspace naming | 'workspace' — neutral for individual + business |
| Auto-onboarding | DB trigger creates profile+workspace+default agent on signup |
| agent_usage ownership | DB trigger — Celery does NOT touch this table |
| rag_provider | Internal only — never show in any UI or frontend |
| API key security | SHA-256 hash only stored, raw key shown exactly once |
| Dummy API toggle | Per-feature env vars (NEXT_PUBLIC_DUMMY_QUERY, NEXT_PUBLIC_DUMMY_API_KEYS) |
| Demo call v1 | Phone number displayed on /demo — visitor calls from own phone |
| Demo call v2 | In-browser WebRTC via Twilio Client SDK (Phase 4) |
| Package manager | pnpm |
| Node version | 20 |
| Next.js version | 14 (App Router) |
| Frontend→FastAPI auth | Supabase JWT (dashboard) or cm_live_ API key (external) |
| Supabase service role | FastAPI ONLY — never in frontend code |
| Realtime tables | conversations + messages |

---

## Pre-Deploy Checklist

- [ ] Verify `DASHBOARD_VERCEL_PROJECT_ID_DEV` ≠ `DASHBOARD_VERCEL_PROJECT_ID_PROD` in GitHub Secrets
- [ ] Run storage RLS policies SQL (currently 0 policies on both buckets)
- [ ] Verify 5 triggers exist in Supabase (run trigger verification SQL)
- [ ] Generate database.types.ts (pnpm gen:types)
- [ ] Set CORS_ORIGINS on FastAPI to dashboard production URL
- [ ] Set NEXT_PUBLIC_DUMMY_QUERY=false + NEXT_PUBLIC_DUMMY_API_KEYS=false in Vercel prod
- [ ] Add redirect URLs in Supabase Auth → URL Configuration
- [ ] Configure demo Twilio number + demo agent in Supabase
- [ ] Set NEXT_PUBLIC_DEMO_PHONE_NUMBER in Vercel web-prod env

---

## Research Paper

- **Title:** CallMind: Real-Time AI Voice Agent with Pluggable STT-LLM-TTS Pipeline
- **Status:** Drafted — needs: 5 author names, college name, latency numbers, validation %
- **Target:** ICCUBEA 2026 (IEEE, Pune) — deadline April 10 2026 ⭐
- **Backup:** ICCMRAI 2026 (IEEE, Pune, September 2026)
- **Key contribution:** QueryPayload abstraction + dual backend + sentence streaming latency

---

## Files Reference

| File | Purpose |
|------|---------|
| `CONTEXT.md` | This file — paste at start of every new chat |
| `001_schema_v3.sql` | Complete Supabase migration — already run ✅ |
| `eraser-schema-v3.md` | Paste into eraser.io for DB diagram |
| `aicaller-backend-capabilities.docx` | Full backend capabilities doc |
| `aicaller-backend-phase3-context.docx` | Backend Phase 3 detailed context |
| `supabase-setup-guide.docx` | Step-by-step Supabase setup |
| `supabase-integration-guide.docx` | packages/supabase code patterns |
| `callmind-v1-plan.docx` | Full product plan |