# CallMind / AICaller — Developer Context

> This file is the source of truth for architecture decisions, conventions, and constraints.
> Read this before touching any code. AI assistants (Cursor, Copilot, Claude) should load this file first.

---

## Project Overview

CallMind is an AI voice + chat agent platform. Users configure AI agents, upload knowledge bases,
assign phone numbers, and let agents handle inbound calls and text sessions automatically.

**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + Storage + Realtime) · TanStack Query · TypeScript · Tailwind CSS · Turborepo

---

## Monorepo Structure

```
apps/
  dashboard/                ← Main user-facing dashboard (Next.js 14)
    app/                    ← Next.js routes ONLY (pages, layouts, route handlers)
    hooks/                  ← TanStack Query hooks (one file per table)
    lib/                    ← Utilities: query-client.ts, query-keys.ts
    providers/              ← React providers: query-provider.tsx, user-provider.tsx
    middleware.ts
    next.config.ts
    tailwind.config.ts
    tsconfig.json
  web/                      ← Marketing site
packages/
  supabase/                 ← Supabase clients, types, query functions (shared)
    src/
      client.ts             ← Browser client (createClient)
      server.ts             ← Server client (createServerSupabaseClient)
      middleware.ts         ← Session refresh (updateSession)
      types/                ← Auto-generated DB types (NEVER edit manually)
      queries/              ← Typed async query functions (no React, no hooks)
        _types.ts           ← Shared SupabaseClientType used by all query files
        index.ts            ← Barrel export
        workspace.ts
        profile.ts
        agents.ts
  ui/                       ← Shared component library (Shadcn-based)
  config/                   ← Shared ESLint, TypeScript, Tailwind config
```

---

## Turborepo Best Practices

- **`workspace:*`** — always use this prefix in `package.json` for internal dependencies.
- **`@aicaller/*`** — package import alias. Use `@aicaller/supabase`, `@aicaller/ui`, etc.
- **`@/`** — app-local alias inside `apps/dashboard`. Maps to `apps/dashboard/`.
- **Clean builds** — if you encounter strange routing or build issues run `pnpm clean` and restart.
- **Never use relative paths** like `../../../`. Always use `@/` or `@aicaller/` aliases.

---

## Supabase — Client Type Pattern

All query functions use a shared `SupabaseClientType` defined in `packages/supabase/src/queries/_types.ts`:

```ts
import type { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types/database.types'

export type SupabaseClientType = ReturnType<typeof createBrowserClient<Database>>
```

**WHY:** `@supabase/supabase-js >=2.39` changed the `SupabaseClient` generic signature.
Importing `SupabaseClient<Database>` directly causes a type mismatch between browser
and server clients. Deriving from `createBrowserClient` works for both since both
`createBrowserClient` and `createServerClient` from `@supabase/ssr` are structurally identical.

**Rule:** Never import `SupabaseClient` from `@supabase/supabase-js` in query files.
Always import `SupabaseClientType` from `./_types`.

### Dual-Client Strategy
- **Server Components / Server Actions / Route Handlers** → `createServerSupabaseClient()` from `@aicaller/supabase/server`
- **Client Components / TanStack hooks** → `createClient()` from `@aicaller/supabase/client`
- **Query functions** accept `SupabaseClientType` — compatible with both clients above.

### RLS-First Mentality
- RLS is always enforced on the frontend (anon key).
- `my_workspace_id()` SQL function scopes everything to the user's workspace automatically.
- **Never filter by `workspace_id` manually in frontend queries** — RLS handles it.
- FastAPI backend uses service_role key — RLS bypassed entirely on the backend.

---

## The Wiring Guide: Adding a New Entity

When adding a new feature (e.g., "Conversations"), follow this exact sequence:

### Step 1: Query function (`packages/supabase/src/queries/`)

Create `packages/supabase/src/queries/conversations.ts`:
```ts
import type { SupabaseClientType } from './_types'

export async function getConversations(supabase: SupabaseClientType) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
```

Add to `packages/supabase/src/queries/index.ts`:
```ts
export * from './conversations'
```

### Step 2: Cache keys (`apps/dashboard/lib/query-keys.ts`)

```ts
export const conversationKeys = {
  all: ['conversations'] as const,
  detail: (id: string) => ['conversations', id] as const,
  messages: (id: string) => ['conversations', id, 'messages'] as const,
}
```

### Step 3: TanStack hook (`apps/dashboard/hooks/use-conversations.ts`)

```ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getConversations } from '@aicaller/supabase/queries'
import { conversationKeys } from '@/lib/query-keys'

export function useConversations(initialData?: Awaited<ReturnType<typeof getConversations>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: conversationKeys.all,
    queryFn: () => getConversations(supabase),
    initialData: initialData ?? undefined,
  })
}
```

### Step 4: SSR + hydration (Next.js page)

```tsx
// app/(dashboard)/conversations/page.tsx — Server Component
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getConversations } from '@aicaller/supabase/queries'
import { ConversationsClient } from './conversations-client'

export default async function ConversationsPage() {
  const supabase = await createServerSupabaseClient()
  const initialData = await getConversations(supabase)
  return <ConversationsClient initialData={initialData} />
}
```

```tsx
// app/(dashboard)/conversations/conversations-client.tsx — Client Component
'use client'
import { useConversations } from '@/hooks/use-conversations'

export function ConversationsClient({ initialData }) {
  const { data: conversations } = useConversations(initialData)
  // render...
}
```

---

## Data Fetching Rules

- **Never fetch in Client Components without `initialData`** on page-level data.
- **Never use `useEffect` + `useState`** for data fetching — always use TanStack hooks.
- **Never call `supabase.from()` directly** in a component or hook — always use a function from `queries/`.
- **`initialData` always typed** as `Awaited<ReturnType<typeof getMyFn>>` — never use `any`.

---

## Providers

- **`QueryProvider`** — wraps the root layout `app/layout.tsx`. Contains TanStack QueryClient.
- **`UserProvider`** — wraps the dashboard group layout `app/(dashboard)/layout.tsx`.
  Provides `profile` + `workspace` SSR-fetched once per navigation.
  Access via `useUser()` from `@/providers/user-provider` — **never re-fetch this data**.

---

## Realtime

Supabase realtime is enabled on **`conversations`** and **`messages`** tables only.

- Realtime hooks live in `apps/dashboard/hooks/use-realtime.ts`.
- Realtime handlers use `qc.setQueryData()` to patch the cache — **never `invalidateQueries()`** inside a realtime handler (causes fetch storm on every WS message).
- Only subscribe to realtime inside **detail/active-session pages** — never in list pages.

---

## Database — Critical Rules

### Ownership chain
`auth.users` → `profiles` → `workspaces` → `agents` → `conversations` → `messages`
                                          → `knowledge_bases` → `kb_documents`
                                          → `phone_numbers`

### Triggers — never duplicate in frontend
| Trigger | What it does | Frontend rule |
|---|---|---|
| `message_count` | Auto-increments on conversation | Never update manually |
| `agent_usage` | Updates on conversation completion | Never increment in frontend |
| `callers.call_count` | Updates on call completion | Read-only from frontend |
| `profiles` + `workspaces` + default `agent` | Created on signup | Never create manually |

### NEVER expose in UI
- `agents.rag_provider` — internal Phase 4 column. Strip in `createAgent` and `updateAgent` at query layer. Hidden from all forms and displays.
- `number_pool` table — admin-only. Guard with `profile.is_admin === true` in layout.
- `kb_documents.rag_document_id` / `rag_kb_id` / `rag_status` — Phase 4 internal.
- `profiles.is_admin` — strip in `updateProfile` at query layer. Never settable from UI.

### Agent deletion guard
Frontend MUST verify before calling `deleteAgent`:
1. `agent.is_default === false`
2. Total agent count in workspace > 1
The DB does not enforce this — it is a UI responsibility.

### API keys
- Raw key shown ONCE on creation and never stored. `key_hash` is SHA-256.
- Frontend only ever sees `key_prefix` (first 16 chars) and `name`.
- Key generation happens **server-side only** (Server Action or FastAPI) — never in a Client Component.

### conversations.summary
- Auto-generated by Celery after call ends. Editable by workspace owner.
- Show an edit indicator in the UI when `summary_edited === true`.

---

## Build Phases — Do not build Phase 4 features in UI

| Phase | Scope |
|---|---|
| **1 (current)** | Auth, onboarding, dashboard overview, agents CRUD, basic KB upload |
| **2** | Conversations list + detail, phone number assignment, callers |
| **3** | API keys management, settings, realtime transcript view |
| **4** | RAG/pgvector — internal only, zero UI surface |

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Query functions | camelCase verb + entity | `getAgents`, `updateAgent` |
| Query files | kebab-case | `knowledge-bases.ts` |
| Hook files | `use-` prefix, kebab-case | `use-agents.ts` |
| Hook exports | `use` + PascalCase | `useAgents`, `useUpdateAgent` |
| Cache key objects | camelCase + `Keys` suffix | `agentKeys`, `workspaceKeys` |
| Components | PascalCase | `AgentCard`, `KnowledgeBaseList` |
| Route files | Next.js convention | `page.tsx`, `layout.tsx` |

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL        — Supabase project URL (public, safe in browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY   — Supabase anon key (public, RLS enforced)
```

Service role key is NEVER in the dashboard app. It lives in the FastAPI backend only.

---

## Golden Rules for AI Agents

1. **Read first** — always read `CONTEXT.md` at the repo root before any feature implementation.
2. **No raw queries** — never use `supabase.from('table')` directly in a component or hook. Always use a function from `packages/supabase/src/queries/`.
3. **Use `useUser()`** — for `profile` or `workspace` info use `useUser()` from `@/providers/user-provider`. Never re-fetch this data.
4. **No placeholders** — never use placeholder text or mock data. Use a proper loading skeleton or a documented stub.
5. **Clean imports** — use `@/` for app-local imports, `@aicaller/` for package imports. No relative paths like `../../../`.
6. **Type everything** — never use `any` for data returned from Supabase. Derive types from `Tables<'table_name'>` or from query function return types.
7. **`rag_provider` is forbidden in UI** — never render, edit, or pass this field from any component or form.
8. **Check build phase** — never implement Phase 4 (RAG) features in the UI.

