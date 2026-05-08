import type { SupabaseClientType } from './_types'
import type { Tables } from '../types'

type ConversationRow = Tables<'conversations'>
type AgentRow = Tables<'agents'>
type CallerRow = Tables<'callers'>

export type ConversationListRow = Pick<
  ConversationRow,
  | 'id'
  | 'agent_id'
  | 'caller_id'
  | 'channel'
  | 'ended_at'
  | 'message_count'
  | 'outcome'
  | 'started_at'
  | 'status'
  | 'summary'
  | 'visitor_id'
> & {
  agents?: Pick<AgentRow, 'name'> | null
  callers?: Pick<CallerRow, 'phone_number'> | null
}

/**
 * Fetch conversations for a single agent, newest first.
 */
export async function getConversationsByAgent(supabase: SupabaseClientType, agentId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      agent_id,
      caller_id,
      channel,
      ended_at,
      message_count,
      outcome,
      started_at,
      status,
      summary,
      visitor_id,
      agents ( name ),
      callers ( phone_number )
    `)
    .eq('agent_id', agentId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as ConversationListRow[]
}

/**
 * Fetch a single conversation by ID.
 */
export async function getConversation(supabase: SupabaseClientType, id: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch conversations for the current workspace, newest first.
 */
export async function getConversations(supabase: SupabaseClientType) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      agent_id,
      caller_id,
      channel,
      ended_at,
      message_count,
      outcome,
      started_at,
      status,
      summary,
      visitor_id,
      agents ( name ),
      callers ( phone_number )
    `)
    .order('started_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as ConversationListRow[]
}

/**
 * Fetch messages for a conversation (oldest -> newest).
 */
export async function getMessages(supabase: SupabaseClientType, conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

