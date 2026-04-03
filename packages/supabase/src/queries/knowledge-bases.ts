import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

/**
 * Get all knowledge bases for the current workspace.
 */
export async function getKnowledgeBases(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('knowledge_bases')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get a specific knowledge base.
 */
export async function getKnowledgeBase(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from('knowledge_bases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Get documents for a specific knowledge base.
 */
export async function getKBDocuments(supabase: SupabaseClient<Database>, kbId: string) {
  const { data, error } = await supabase
    .from('kb_documents')
    .select('*')
    .eq('kb_id', kbId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
