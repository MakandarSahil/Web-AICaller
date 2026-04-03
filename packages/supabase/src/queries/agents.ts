import type { SupabaseClientType } from './_types'
import type { TablesInsert, TablesUpdate } from '../types'

/**
 * Fetch all agents in the authenticated user's workspace.
 * Joins agent_usage + phone_numbers for dashboard overview.
 * Add more joins here as new pages require them.
 */
export async function getAgents(supabase: SupabaseClientType) {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      agent_usage (
        total_calls,
        total_messages,
        last_active_at
      ),
      phone_numbers (
        id,
        number,
        number_type,
        is_active
      ),
      agent_knowledge_bases (
        kb_id,
        knowledge_bases (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Fetch a single agent by ID.
 * Used on agent detail / edit pages.
 */
export async function getAgent(supabase: SupabaseClientType, id: string) {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      agent_usage (*),
      phone_numbers (*),
      agent_knowledge_bases (
        kb_id,
        knowledge_bases (id, name, description)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new agent.
 *
 * NEVER pass rag_provider in payload — it's internal only.
 * Enforced here by stripping before insert.
 */
export async function createAgent(
  supabase: SupabaseClientType,
  payload: Omit<TablesInsert<'agents'>, 'id' | 'rag_provider' | 'created_at' | 'updated_at'>
) {
  // Physically strip rag_provider at runtime as per security rules
  const safePayload = { ...payload }
  delete (safePayload as any).rag_provider

  const { data, error } = await supabase
    .from('agents')
    .insert(safePayload)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an agent.
 *
 * NEVER expose rag_provider to the UI — stripped here at the data layer.
 */
export async function updateAgent(
  supabase: SupabaseClientType,
  id: string,
  payload: Omit<TablesUpdate<'agents'>, 'id' | 'rag_provider' | 'workspace_id' | 'created_at' | 'updated_at'>
) {
  // Physically strip rag_provider at runtime as per security rules
  const safePayload = { ...payload }
  delete (safePayload as any).rag_provider

  const { data, error } = await supabase
    .from('agents')
    .update(safePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete an agent.
 * Caller must verify this is NOT the last/default agent before calling.
 * The DB does not enforce this — it's a frontend responsibility.
 */
export async function deleteAgent(supabase: SupabaseClientType, id: string) {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Set the knowledge bases attached to an agent.
 *
 * This is a dashboard-level helper: it wipes existing links for the agent
 * and inserts the provided KB IDs.
 */
export async function setAgentKnowledgeBases(
  supabase: SupabaseClientType,
  agentId: string,
  kbIds: string[]
) {
  const uniqueKbIds = Array.from(new Set(kbIds))

  const { error: deleteError } = await supabase
    .from('agent_knowledge_bases')
    .delete()
    .eq('agent_id', agentId)

  if (deleteError) throw deleteError

  if (uniqueKbIds.length === 0) return

  const { error: insertError } = await supabase
    .from('agent_knowledge_bases')
    .insert(
      uniqueKbIds.map((kbId) => ({
        agent_id: agentId,
        kb_id: kbId,
      }))
    )

  if (insertError) throw insertError
}