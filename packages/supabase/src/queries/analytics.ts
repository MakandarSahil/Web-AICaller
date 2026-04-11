import type { SupabaseClientType } from './_types'
import type { Tables } from '../types'

type ConversationAnalyticsRow = Tables<'conversation_analytics'>

export async function getConversationAnalytics(supabase: SupabaseClientType, conversationId: string) {
  const { data, error } = await supabase
    .from('conversation_analytics')
    .select('*')
    .eq('conversation_id', conversationId)
    .single()

  if (error) throw error
  return data as ConversationAnalyticsRow
}

export async function getWorkspaceConversationAnalytics(supabase: SupabaseClientType, days: 7 | 30 | 90 = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('conversation_analytics')
    .select(
      `
      id,
      conversation_id,
      overall_intent,
      sentiment_end,
      outcome,
      topics,
      analysed_at,
      conversations!inner(
        id,
        started_at,
        agent_id,
        had_tool_call,
        agents!inner(id, workspace_id)
      )
    `
    )
    .gte('analysed_at', since)

  if (error) throw error
  return data ?? []
}