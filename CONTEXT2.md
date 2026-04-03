# AICaller / CallMind — Developer Context v4

> **AI assistant rule:** Read this entire file before touching any code.
> **Last updated:** March 2026
> **Current focus:** Dashboard pages — Agents, KB, Phone Numbers, Agent Chat → then wire FastAPI backend

---

## Product

**Name:** CallMind (brand) / aicaller (repos)
**What it is:** AI voice + text query platform. Users configure AI agents with knowledge bases, assign phone numbers, and let agents handle inbound calls and text queries automatically.
**Stage:** V1 active development. Final year B.E./B.Tech CE mega project + research paper.

---

## Repository

**GitHub:** `https://github.com/MakandarSahil/Web-AICaller` (branch: `develop`)
**Package manager:** pnpm 9 · **Node:** 20.9+

```
Web-AICaller/                     ← monorepo root
├── apps/
│   ├── dashboard/                ← main user dashboard (Next.js 16, port 3001)
│   │   ├── app/
│   │   │   ├── (auth)/           ← login, signup, onboarding (no sidebar)
│   │   │   ├── (dashboard)/      ← protected pages (with sidebar layout)
│   │   │   │   ├── layout.tsx    ← sidebar + header shell
│   │   │   │   ├── page.tsx      ← overview / home
│   │   │   │   ├── agents/
│   │   │   │   ├── knowledge-bases/
│   │   │   │   ├── phone-numbers/
│   │   │   │   ├── conversations/
│   │   │   │   ├── api-keys/
│   │   │   │   └── settings/
│   │   │   └── auth/callback/    ← OAuth route handler
│   │   ├── hooks/                ← TanStack Query hooks (one file per entity)
│   │   ├── lib/
│   │   │   ├── query-client.ts
│   │   │   ├── query-keys.ts     ← all cache key factories
│   │   │   └── fastapi.ts        ← FastAPI client (query + api-keys)
│   │   ├── providers/
│   │   │   ├── query-provider.tsx
│   │   │   └── user-provider.tsx ← useUser() hook — never re-fetch
│   │   └── middleware.ts
│   └── web/                      ← marketing site (port 3000)
└── packages/
    ├── supabase/                 ← @aicaller/supabase
    │   └── src/
    │       ├── client.ts         ← createClient() browser
    │       ├── server.ts         ← createServerSupabaseClient() SSR
    │       ├── middleware.ts     ← updateSession()
    │       ├── types/database.types.ts  ← NEVER edit manually
    │       └── queries/          ← typed async query functions (no React)
    │           ├── _types.ts     ← SupabaseClientType
    │           ├── index.ts
    │           ├── profile.ts
    │           ├── workspace.ts
    │           ├── agents.ts
    │           ├── knowledge-bases.ts
    │           ├── kb-documents.ts
    │           ├── phone-numbers.ts
    │           ├── conversations.ts
    │           └── api-keys.ts
    ├── ui/                       ← @aicaller/ui (shadcn components + cn)
    └── config/                   ← @aicaller/config (tailwind, tsconfig, eslint)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS 3 + shadcn/ui (in packages/ui) |
| Server state | TanStack Query v5 |
| Global UI state | Zustand 5 |
| Forms | React Hook Form 7 + Zod 3 |
| URL state | nuqs |
| Auth | Supabase Auth (@supabase/ssr) |
| DB/Storage/Realtime | Supabase |
| Shared packages | @aicaller/supabase, @aicaller/ui, @aicaller/config |
| AI Backend | FastAPI (Python) on Azure VM |
| HTTP to FastAPI | Native fetch (SSE requires it — no Axios) |
| Monorepo | Turborepo + pnpm workspaces |
| Theme | Light — blue brand (#3655E8), white/gray backgrounds |

---

## Import Rules — Never Break These

```typescript
// ✅ Correct — package aliases
import { Button, Card, cn } from '@aicaller/ui'
import { createClient } from '@aicaller/supabase/client'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents } from '@aicaller/supabase/queries'

// ✅ Correct — app-local alias
import { agentKeys } from '@/lib/query-keys'
import { useAgents } from '@/hooks/use-agents'
import { useUser } from '@/providers/user-provider'

// ❌ Never — relative paths crossing package boundaries
import { Button } from '../../../packages/ui/src'
import { getAgents } from '../../packages/supabase/src/queries/agents'
```

---

## Supabase Client Type Pattern

```typescript
// packages/supabase/src/queries/_types.ts
import type { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types/database.types'

export type SupabaseClientType = ReturnType<typeof createBrowserClient<Database>>
```

**Why:** `@supabase/supabase-js >=2.39` changed the generic signature. Deriving from `createBrowserClient` is compatible with both browser and server clients from `@supabase/ssr`.

**Rule:** Never import `SupabaseClient` from `@supabase/supabase-js` in query files.

---

## Dual-Client Strategy

| Context | Client | Import |
|---------|--------|--------|
| Server Components, Server Actions, Route Handlers | `createServerSupabaseClient()` | `@aicaller/supabase/server` |
| Client Components, TanStack hooks | `createClient()` | `@aicaller/supabase/client` |

Query functions accept `SupabaseClientType` — works with both.

---

## The Wiring Pattern — Follow This for Every Entity

### Step 1 — Query function (`packages/supabase/src/queries/agents.ts`)
```typescript
import type { SupabaseClientType } from './_types'
import type { Tables } from '../types/database.types'

export type Agent = Tables<'agents'>

export async function getAgents(supabase: SupabaseClientType): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*, agent_usage(total_calls, total_messages)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateAgent(
  supabase: SupabaseClientType,
  id: string,
  updates: Partial<Omit<Agent, 'id' | 'workspace_id' | 'created_at' | 'rag_provider'>>
) {
  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
```

### Step 2 — Cache keys (`apps/dashboard/lib/query-keys.ts`)
```typescript
export const agentKeys = {
  all:    ['agents'] as const,
  detail: (id: string) => ['agents', id] as const,
}
export const kbKeys = {
  all:    ['knowledge-bases'] as const,
  detail: (id: string) => ['knowledge-bases', id] as const,
  docs:   (id: string) => ['knowledge-bases', id, 'documents'] as const,
}
export const phoneKeys = {
  all: ['phone-numbers'] as const,
}
export const conversationKeys = {
  all:      ['conversations'] as const,
  detail:   (id: string) => ['conversations', id] as const,
  messages: (id: string) => ['conversations', id, 'messages'] as const,
}
export const apiKeyKeys = {
  all: ['api-keys'] as const,
}
```

### Step 3 — TanStack hook (`apps/dashboard/hooks/use-agents.ts`)
```typescript
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getAgents, updateAgent } from '@aicaller/supabase/queries'
import { agentKeys } from '@/lib/query-keys'

export function useAgents(initialData?: Awaited<ReturnType<typeof getAgents>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: agentKeys.all,
    queryFn: () => getAgents(supabase),
    initialData: initialData ?? undefined,
  })
}

export function useUpdateAgent() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: {
      id: string
      updates: Parameters<typeof updateAgent>[2]
    }) => updateAgent(supabase, id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agentKeys.all })
    },
  })
}
```

### Step 4 — SSR page + client component
```typescript
// app/(dashboard)/agents/page.tsx — Server Component
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents } from '@aicaller/supabase/queries'
import { AgentsClient } from './agents-client'

export default async function AgentsPage() {
  const supabase = await createServerSupabaseClient()
  const initialData = await getAgents(supabase)
  return <AgentsClient initialData={initialData} />
}

// app/(dashboard)/agents/agents-client.tsx — Client Component
'use client'
import { useAgents } from '@/hooks/use-agents'
import type { getAgents } from '@aicaller/supabase/queries'

export function AgentsClient({
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof getAgents>>
}) {
  const { data: agents } = useAgents(initialData)
  // render
}
```

---

## Data Fetching Rules — Non-Negotiable

1. **Never fetch in Client Components without `initialData`** on page-level data
2. **Never use `useEffect` + `useState` for data fetching** — always TanStack Query hooks
3. **Never call `supabase.from()` directly in a component or hook** — always use a function from `queries/`
4. **`initialData` always typed as `Awaited<ReturnType<typeof getMyFn>>`** — never `any`
5. **Never re-fetch profile/workspace** — use `useUser()` from `@/providers/user-provider`

---

## RLS Rules — Never Filter by workspace_id Manually

```typescript
// ❌ Wrong — RLS handles this automatically
.from('agents').select('*').eq('workspace_id', workspaceId)

// ✅ Correct — my_workspace_id() SQL function scopes it via RLS
.from('agents').select('*')
```

---

## Realtime Rules

- Enabled on: `conversations` and `messages` tables only
- Use `qc.setQueryData()` in handlers — **never** `invalidateQueries()` (causes fetch storm)
- Only subscribe inside detail pages — never in list pages

---

## Providers

**`QueryProvider`** — wraps `app/layout.tsx`. Contains TanStack QueryClient.

**`UserProvider`** — wraps `app/(dashboard)/layout.tsx`. SSR-fetches profile + workspace once.
```typescript
const { profile, workspace, isAdmin } = useUser()
// Never re-fetch profile or workspace anywhere else
```

---

## Database Schema v3 — What Dashboard Touches

```
profiles          id, full_name, phone, avatar_url, account_type, is_admin
workspaces        id, owner_id, name, business_name, industry, website, size, status
agents            id, workspace_id, name, persona, system_prompt,
                  stt_provider, stt_model, tts_provider, tts_model, tts_voice,
                  llm_provider, llm_model, rag_provider [NEVER UI],
                  status, is_default
agent_knowledge_bases  id, agent_id, kb_id, attached_at
knowledge_bases   id, workspace_id, name, description
kb_documents      id, kb_id, name, type, content, file_path, file_size, status
phone_numbers     id, workspace_id, agent_id, number, number_type,
                  provider, provider_sid, webhook_url, is_active
conversations     id, agent_id, caller_id, session_id, channel, status,
                  visitor_id, kb_snapshot_ids, summary, summary_edited,
                  message_count, started_at, ended_at
messages          id, conversation_id, role, content, created_at
agent_usage       id, agent_id, total_calls, total_messages, last_active_at
api_keys          id, workspace_id, name, key_hash, key_prefix,
                  is_active, created_at, last_used_at, created_by
callers           id, workspace_id, phone_number, first_seen_at, last_seen_at, call_count
number_pool       ← ADMIN ONLY (guard with isAdmin)
```

### Triggers — never duplicate in frontend

| Trigger | What it does | Rule |
|---------|-------------|------|
| `on_auth_user_created` | Creates profile + workspace + default agent | Never create manually |
| `on_message_inserted` | Increments `conversations.message_count` | Never update manually |
| `on_conversation_completed` | Upserts `agent_usage`, updates `callers` | Read-only |
| `on_agent_created` | **REMOVED** — caused double insert bug on signup | — |
| `set_updated_at` | Auto sets `updated_at` | Never set manually |

### Storage Buckets
```
knowledge-bases  private  50MB  PDF+DOCX+TXT
                 path: {workspace_id}/{kb_id}/{doc_id}_{filename}
avatars          public   3MB   image/*
                 path: {user_id}/avatar
```

---

## NEVER Expose in UI

```
agents.rag_provider           — Phase 4 internal, strip in createAgent/updateAgent
kb_documents.rag_document_id  — Phase 4 internal
kb_documents.rag_kb_id        — Phase 4 internal
kb_documents.rag_status       — Phase 4 internal
knowledge_bases.rag_kb_id     — Phase 4 internal
profiles.is_admin             — strip in updateProfile, never settable from UI
number_pool (entire table)    — guard with isAdmin === true
```

### Agent deletion guard (UI responsibility — DB does not enforce)
```typescript
if (agent.is_default) throw new Error('Cannot delete default agent')
const allAgents = await getAgents(supabase)
if (allAgents.length <= 1) throw new Error('Must have at least one agent')
```

---

## Dashboard Pages — Full Functionality Spec

### ✅ DONE — Auth

- `/login` — email+password + Google OAuth, redirects to `?redirectTo` or `/`
- `/signup` — creates user, trigger auto-creates profile + workspace + default agent, redirects to `/onboarding`
- `/onboarding` — updates workspace (business_name, industry, size, website)
- `/auth/callback` — exchanges OAuth code for session

---

### 🔜 Agents List — `/agents`

**Query:** `getAgents(supabase)` with `agent_usage` join for call counts. SSR + TanStack.

**Features:**
- Grid of agent cards: name, persona, status badge, is_default badge, KB count, total calls
- **Create Agent** button → modal: name (required), persona, system_prompt → INSERT agents → toast
- **Edit** → `/agents/[id]`
- **Chat** → `/agents/[id]/chat`
- **Delete** → confirm dialog, guard is_default + count > 1 → DELETE

---

### 🔜 Agent Detail/Edit — `/agents/[id]`

**Query:** `getAgent(supabase, id)` + `getAgentKBs(supabase, agentId)` + `getWorkspaceKBs(supabase)`

**Tab 1 — General**
```
Name            required text input
Persona         optional text input
System Prompt   large textarea (main LLM instruction)
Status          select: active | inactive
Save → PATCH agents
```

**Tab 2 — Voice & Model**
```
TTS Voice    select:
  en-IN-PrabhatNeural (default)   en-US-JennyNeural
  en-US-AriaNeural                en-US-GuyNeural
  en-GB-SoniaNeural               hi-IN-SwaraNeural
  en-AU-NatashaNeural

LLM Model    select:
  llama-3.3-70b-versatile (default, recommended)
  llama-3.1-8b-instant (faster)
  mixtral-8x7b-32768 (large context)

STT Provider   read-only badge: "Azure"
TTS Provider   read-only badge: "Azure"
LLM Provider   read-only badge: "Groq"

Save → PATCH agents (tts_voice, llm_model)
NEVER show or pass rag_provider
```

**Tab 3 — Knowledge Bases**
```
Attached KBs list: name, doc count, Detach button
  → DELETE from agent_knowledge_bases → invalidate

Attach KB dropdown: workspace KBs not yet attached
  → INSERT into agent_knowledge_bases → invalidate

Empty state: "No KBs attached. Attach one to give your agent context."
```

**Tab 4 — Danger Zone**
```
Delete Agent (red, outlined)
Disabled + tooltip if is_default or only agent
Confirm: "Delete [name]? This cannot be undone."
→ DELETE agents CASCADE
```

---

### 🔜 Agent Chat — `/agents/[id]/chat`

**Purpose:** Test the agent. Calls FastAPI `POST /query` with Supabase JWT auth.

**UI:**
```
Sidebar: agent name, status, attached KBs list
Chat area: message bubbles (user=right/blue, assistant=left/gray, streaming)
Input: textarea (Enter=send, Shift+Enter=newline) + Send button
"New Conversation" button → clear thread + new conversationId
```

**State:**
```typescript
const [messages, setMessages] = useState<{role:'user'|'assistant', content:string}[]>([])
const [conversationId, setConversationId] = useState<string | undefined>()
const [streaming, setStreaming] = useState(false)

const send = async (text: string) => {
  setMessages(prev => [...prev, { role: 'user', content: text }])
  setStreaming(true)
  let response = ''
  setMessages(prev => [...prev, { role: 'assistant', content: '' }])

  await queryAgent(agentId, text, conversationId,
    (delta) => {
      response += delta
      setMessages(prev => [...prev.slice(0,-1), { role:'assistant', content: response }])
    },
    (id) => setConversationId(id)
  )
  setStreaming(false)
}
```

**FastAPI client (`apps/dashboard/lib/fastapi.ts`):**
```typescript
const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL
const DUMMY_QUERY = process.env.NEXT_PUBLIC_DUMMY_QUERY === 'true'
const DUMMY_API_KEYS = process.env.NEXT_PUBLIC_DUMMY_API_KEYS === 'true'

async function getAuthHeader() {
  const { createClient } = await import('@aicaller/supabase/client')
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${session.access_token}` }
}

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
  const headers = await getAuthHeader()
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
      const raw = line.slice(6)
      if (raw === '[DONE]') return
      const parsed = JSON.parse(raw)
      if (!convIdSent && parsed.conversation_id) { onConversationId(parsed.conversation_id); convIdSent = true }
      if (parsed.delta) onDelta(parsed.delta)
    }
  }
}

export async function listApiKeys() {
  if (DUMMY_API_KEYS) return [
    { id: '1', name: 'Website chatbot', key_prefix: 'cm_live_a1b2c3d4',
      is_active: true, created_at: new Date().toISOString(), last_used_at: null }
  ]
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys`, { headers }).then(r => r.json())
}

export async function createApiKey(name: string) {
  if (DUMMY_API_KEYS) return {
    id: crypto.randomUUID(), name,
    key: 'cm_live_' + crypto.randomUUID().replace(/-/g,'') + crypto.randomUUID().replace(/-/g,'').slice(0,8),
    key_prefix: 'cm_live_a1b2c3d4', created_at: new Date().toISOString()
  }
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ name }),
  }).then(r => r.json())
}

export async function revokeApiKey(id: string) {
  if (DUMMY_API_KEYS) return { id, revoked: true }
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys/${id}`, { method: 'DELETE', headers }).then(r => r.json())
}
```

---

### 🔜 Knowledge Bases List — `/knowledge-bases`

**Query:** `getKnowledgeBases(supabase)` with doc count + agents using it. SSR + TanStack.

**Features:**
- KB cards: name, description, doc count, agents using it (badges)
- **Create KB** → modal: name + description → INSERT knowledge_bases → redirect to detail
- **Delete KB** → warn if attached to agents → DELETE (CASCADE)

---

### 🔜 KB Detail — `/knowledge-bases/[id]`

**Query:** `getKnowledgeBase(supabase, id)` + `getKBDocuments(supabase, kbId)`

**Features:**
- Name + description inline editable, auto-save on blur
- Document list: name, type badge, status badge (ready/processing/error), delete
- **Add Plain Text** (Tab A — primary in v1):
  - Title input, content textarea, char count / 60k limit
  - Save → INSERT `{type:'plain_text', content, status:'ready'}` → usable on next call
- **File Upload** (Tab B — storage only, processing comes in v2):
  - Upload → Supabase Storage, INSERT `{type, file_path, status:'processing'}`
  - Show amber banner: "File uploaded. Text extraction coming in v2. Add content as plain text for now."
- Attached agents section (read-only links)

---

### 🔜 Phone Numbers — `/phone-numbers`

**Query:** `getPhoneNumbers(supabase)` with agent join. SSR + TanStack.

**Features:**
- Table: number, type badge (platform/own), agent name, webhook URL (copy), status toggle
- **Add Number** modal → two tabs:

  **Request Platform Number:**
  - Form with preferred country → submit shows "Request received. We'll assign within 24 hours."
  - (v1: admin manually inserts via Supabase SQL)

  **Bring Your Own:**
  - Phone number (E.164), select agent, optional provider SID
  - Save → INSERT phone_numbers `{number_type:'own', webhook_url: auto-generated}`
  - Show webhook URL to configure on Twilio:
    `https://api.callmind.com/voice?agent_id={agent_id}`

- Status toggle (is_active) → PATCH phone_numbers

---

### 🔜 Conversations — `/conversations`

**Query:** `getConversations(supabase)` with agent join. SSR + TanStack.

**Features:**
- Table: agent, channel badge, status badge (active = green pulse), duration, messages, caller, date
- Filters: agent, channel, status, date range (via nuqs URL params)
- Realtime: subscribe to `conversations` INSERT → prepend to list via `qc.setQueryData()`

**Detail `/conversations/[id]`:**
- Caller info (phone, first seen, call count)
- Full transcript (messages chronological, user=right, assistant=left)
- Realtime if active: subscribe to `messages` INSERT for this conversation_id
- Summary: show text + edit button → PATCH `{summary, summary_edited: true}` + "Edited" badge
- KB snapshot: show KB names from kb_snapshot_ids

---

### 🔜 API Keys — `/api-keys`

Calls FastAPI with JWT. Uses DUMMY_API_KEYS toggle during dev.

**Features:**
- Table: name, prefix (cm_live_xxxx), status, last used, created, Revoke button
- **Create Key** modal → name input → POST /api-keys → show raw key once with copy + dismiss
- **Revoke** → confirm → DELETE /api-keys/{id} → gray out row

---

### 🔜 Settings — `/settings`

**Profile tab:**
- Avatar upload → `avatars` bucket → PATCH profiles.avatar_url
- Full name, phone → PATCH profiles
- Email: read-only

**Workspace tab:**
- Name, business name, industry, website, size (chip selector)
- Save → PATCH workspaces

---

## FastAPI Backend — Full API Reference

**Base URL prod:** `https://api.callmind.com`
**Base URL dev:** `http://localhost:8000`
**Swagger:** `/docs` (always on)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | none | Service info |
| GET | `/health` | none | Liveness + Redis check |
| GET/POST | `/voice?agent_id=X` | Twilio signature | TwiML webhook |
| WS | `/call?agent_id=X` | internal | Voice pipeline |
| POST | `/query` | JWT or API key | Text query → SSE/JSON |
| GET | `/api-keys` | JWT or API key | List API keys |
| POST | `/api-keys` | JWT only | Create API key |
| DELETE | `/api-keys/{id}` | JWT only | Revoke API key |

### POST /query contract
```json
Request: { "agent_id":"uuid", "text":"...", "conversation_id":"uuid", "stream":true }
Headers: Authorization: Bearer <supabase_jwt>
      OR Authorization: Bearer cm_live_xxx
      OR X-API-Key: cm_live_xxx

Stream response:
data: {"delta": "Hello there", "conversation_id": "uuid"}
data: {"delta": " how can I help?"}
data: [DONE]
```

---

## Environment Variables

### apps/dashboard/.env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Flip to false one at a time when wiring real backend
NEXT_PUBLIC_DUMMY_QUERY=true
NEXT_PUBLIC_DUMMY_API_KEYS=true
```

---

## Backend Testing — Steps After Frontend Pages Are Ready

### 1. Add Twilio number manually in Supabase
```sql
-- Add to number pool
INSERT INTO number_pool (number, provider, provider_sid, is_assigned, webhook_configured)
VALUES ('+91XXXXXXXXXX', 'twilio', 'PNxxxxxxxx', true, true);

-- Find your workspace_id and agent_id
SELECT w.id as workspace_id, a.id as agent_id, a.name
FROM workspaces w JOIN agents a ON a.workspace_id = w.id;

-- Assign number to agent
INSERT INTO phone_numbers (workspace_id, agent_id, number, number_type, provider, webhook_url, is_active)
VALUES ('workspace-id', 'agent-id', '+91XXXXXXXXXX', 'platform', 'twilio',
        'https://api.callmind.com/voice?agent_id=agent-id', true);
```

### 2. Configure Twilio console
Set webhook: `https://api.callmind.com/voice?agent_id={agent_id}`

### 3. Wire agent chat
```bash
NEXT_PUBLIC_DUMMY_QUERY=false
```

### 4. Test and verify
- Make a real call → check `conversations` table for new row
- Check `messages` table for transcript
- Check `agent_usage` for incremented counts

### Known issues to verify
- Twilio caller phone field: `start.customParameters.From` or `start.From`
- Azure TTS mulaw: RIFF header may need stripping (`strip_riff_header()` in audio.py)
- CORS: set `CORS_ORIGINS=https://dashboard.callmind.com` on FastAPI
- Redis cache TTL: agent edits take up to 5min to reflect on calls

---

## Build Order — Current Priority

```
✅ Auth (login, signup, onboarding, callback)
✅ Dashboard layout (sidebar, header, middleware)
✅ Signup bug fixed (on_agent_created trigger removed)

🔜 NOW — build to enable backend testing:
  1. Agent list + create modal
  2. Agent detail/edit (4 tabs: general, voice/model, KBs, danger zone)
  3. KB list + create
  4. KB detail + add plain text doc
  5. Phone numbers page (add own number + webhook URL display)
  6. Agent chat page (POST /query — dummy first, then real)

🔜 AFTER first successful call:
  7. Conversations list + detail + realtime transcript
  8. API Keys page
  9. Settings page
  10. Home overview (stats + realtime active calls)
```

---

## Phase Status

```
✅ Phase 1   Backend CI/CD + Frontend CI/CD (GitHub Actions + Vercel)
✅ Phase 2   Supabase schema v3 (13 tables, triggers, RLS, storage — deployed)
✅ Phase 3   FastAPI voice pipeline complete
             Auth middleware (JWT + API key), /api-keys endpoints, Swagger UI
✅ Auth      Login, signup, onboarding — WORKING
             Signup double-trigger bug FIXED

🔜 NOW       Dashboard pages (agents, KB, phone numbers, agent chat)
🔜 Next      Wire FastAPI → first end-to-end phone call test
⏳ Phase 4   RAG, WhatsApp, web widget, K3s — NOT in v1
```

---

## Key Decisions — All Frozen

| Decision | Choice |
|----------|--------|
| Auth | Supabase Email+Password + Google OAuth |
| One workspace per user | DB unique constraint on workspaces.owner_id |
| agent_usage | DB trigger ONLY — never touch from frontend or Celery |
| rag_provider | Internal Phase 4 — never in any UI or form |
| KB v1 | Plain text primary; file upload stores to storage but won't process until v2 |
| FastAPI auth | Supabase JWT (dashboard) or cm_live_ API key (external) |
| Dummy API | Per-feature: NEXT_PUBLIC_DUMMY_QUERY, NEXT_PUBLIC_DUMMY_API_KEYS |
| TanStack Query | All server state — no useEffect+useState for data |
| RLS | Never filter by workspace_id manually — RLS handles it |
| Realtime | setQueryData only — never invalidateQueries in realtime handlers |
| Theme | Light — blue brand #3655E8, white/gray-50 backgrounds |
| HTTP client | Native fetch — SSE requires it, no Axios |

---

## Research Paper

- **Title:** CallMind: Real-Time AI Voice Agent with Pluggable STT-LLM-TTS Pipeline
- **Target:** ICCUBEA 2026 (IEEE, Pune) — deadline April 10 2026 ⭐
- **Backup:** ICCMRAI 2026 (September 2026)
- **Needs:** 5 author names, college name, latency numbers (Table III), validation %

---

## Files Reference

| File | Purpose |
|------|---------|
| `CONTEXT.md` | This file — paste at start of every new chat |
| `001_schema_v3.sql` | Complete Supabase migration — already deployed ✅ |
| `eraser-schema-v3.md` | Paste into eraser.io for DB diagram |
