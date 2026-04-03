import type { SupabaseClientType } from './_types'

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

