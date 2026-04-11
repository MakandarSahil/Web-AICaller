/**
 * Centralised TanStack Query cache keys.
 *
 * RULES:
 * 1. Every table that gets queried has a key factory here.
 * 2. Use the most-specific key when invalidating — never invalidate ['agents']
 *    when you only changed one agent. Use agentKeys.detail(id) instead.
 * 3. Keys are arrays — TanStack Query matches by prefix for broad invalidation.
 *    e.g. invalidate(['agents']) invalidates ALL agent queries.
 *
 * HOW TO ADD NEW KEYS:
 *  1. Add a factory object below following the same pattern.
 *  2. Import in your hook file and use consistently.
 *  3. Never hardcode strings in useQuery/useMutation calls.
 */

export const workspaceKeys = {
  /** The single workspace for the current user. */
  all: ['workspace'] as const,
}

export const profileKeys = {
  /** The current user's profile row. */
  all: ['profile'] as const,
}

export const agentKeys = {
  /** All agents in the workspace — used in agents list page. */
  all: ['agents'] as const,
  /** Single agent — used in agent detail/edit page. */
  detail: (id: string) => ['agents', id] as const,
}

// ── Add below as pages are built ──────────────────────────────────────────────

export const knowledgeBaseKeys = {
  all: ['knowledge-bases'] as const,
  detail: (id: string) => ['knowledge-bases', id] as const,
  documents: (kbId: string) => ['knowledge-bases', kbId, 'documents'] as const,
}

export const conversationKeys = {
  all: ['conversations'] as const,
  detail: (id: string) => ['conversations', id] as const,
  messages: (conversationId: string) => ['conversations', conversationId, 'messages'] as const,
  agent: (agentId: string) => ['conversations', 'agent', agentId] as const,
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  conversation: (conversationId: string) => ['analytics', 'conversation', conversationId] as const,
  workspace: (days: 7 | 30 | 90) => ['analytics', 'workspace', days] as const,
}

export const phoneNumberKeys = {
  all: ['phone-numbers'] as const,
}

export const apiKeyKeys = {
  all: ['api-keys'] as const,
}

export const callerKeys = {
  all: ['callers'] as const,
  detail: (id: string) => ['callers', id] as const,
}