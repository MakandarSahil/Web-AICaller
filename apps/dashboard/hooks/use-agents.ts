import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  setAgentKnowledgeBases,
} from '@aicaller/supabase/queries'
import { agentKeys } from '@/lib/query-keys'
import { analyticsKeys, conversationKeys, phoneNumberKeys } from '@/lib/query-keys'
import type { TablesInsert, TablesUpdate } from '@aicaller/supabase'

/**
 * List all agents in the workspace.
 *
 * @param initialData — SSR-fetched agents for zero-loading-state first paint.
 *   Pass from the agents page server component.
 */
export function useAgents(initialData?: Awaited<ReturnType<typeof getAgents>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: agentKeys.all,
    queryFn: () => getAgents(supabase),
    initialData: initialData ?? undefined,
  })
}

/**
 * Fetch a single agent by ID.
 * Used on agent detail / edit pages.
 */
export function useAgent(
  id: string,
  initialData?: Awaited<ReturnType<typeof getAgent>>
) {
  const supabase = createClient()
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => getAgent(supabase, id),
    enabled: !!id,
    initialData: initialData ?? undefined,
  })
}

/**
 * Create a new agent.
 * Invalidates the full agents list on success.
 */
export function useCreateAgent() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (
      payload: Omit<TablesInsert<'agents'>, 'id' | 'rag_provider' | 'created_at' | 'updated_at'>
    ) => createAgent(supabase, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agentKeys.all })
    },
  })
}

/**
 * Update an agent.
 * Invalidates both the list and the specific detail cache.
 */
export function useUpdateAgent() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Omit<TablesUpdate<'agents'>, 'id' | 'rag_provider' | 'workspace_id' | 'created_at' | 'updated_at'>
    }) => updateAgent(supabase, id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: agentKeys.all })
      qc.invalidateQueries({ queryKey: agentKeys.detail(id) })
    },
  })
}

/**
 * Delete an agent.
 *
 * IMPORTANT: Caller must check before calling:
 *  1. Agent is NOT is_default
 *  2. It's not the last remaining agent in the workspace
 *  These are UI-level guards — the DB does not enforce them.
 *
 * Invalidates the full agents list on success.
 */
export function useDeleteAgent() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAgent(supabase, id),
    onSuccess: (_void, id) => {
      qc.invalidateQueries({ queryKey: agentKeys.all })
      qc.removeQueries({ queryKey: agentKeys.detail(id) })
      qc.invalidateQueries({ queryKey: phoneNumberKeys.all })
      qc.invalidateQueries({ queryKey: conversationKeys.all })
      qc.invalidateQueries({ queryKey: analyticsKeys.all })
    },
  })
}

/**
 * Replace the KB attachments for a given agent.
 */
export function useSetAgentKnowledgeBases() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { agentId: string; kbIds: string[] }) =>
      setAgentKnowledgeBases(supabase, payload.agentId, payload.kbIds),
    onSuccess: (_void, variables) => {
      qc.invalidateQueries({ queryKey: agentKeys.detail(variables.agentId) })
      qc.invalidateQueries({ queryKey: agentKeys.all })
    },
  })
}
