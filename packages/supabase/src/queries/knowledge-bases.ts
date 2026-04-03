import type { SupabaseClientType } from './_types'
import type { Tables, TablesInsert, TablesUpdate } from '../types'

type KnowledgeBase = Tables<'knowledge_bases'>
type KnowledgeBaseListItem = KnowledgeBase & {
  document_count: number
  agents_using_it: Array<Pick<Tables<'agents'>, 'id' | 'name'>>
}

type KnowledgeBaseDetail = KnowledgeBase & {
  agents_using_it: Array<Pick<Tables<'agents'>, 'id' | 'name'>>
}

/**
 * Get all knowledge bases for the current workspace.
 */
export async function getKnowledgeBases(supabase: SupabaseClientType): Promise<KnowledgeBaseListItem[]> {
  const { data: kbs, error } = await supabase
    .from('knowledge_bases')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  const kbRows = kbs ?? []
  if (kbRows.length === 0) return []

  const kbIds = kbRows.map((kb) => kb.id)

  // 1) Doc counts: fetch docs for those KBs and group by kb_id.
  const { data: docsRows, error: docsError } = await supabase
    .from('kb_documents')
    .select('kb_id, id')
    .in('kb_id', kbIds)

  if (docsError) throw docsError

  const docCountByKbId = new Map<string, number>()
  for (const doc of docsRows ?? []) {
    docCountByKbId.set(doc.kb_id, (docCountByKbId.get(doc.kb_id) ?? 0) + 1)
  }

  // 2) Attached agents: join agent_knowledge_bases -> agents.
  const { data: agentLinksRows, error: linksError } = await supabase
    .from('agent_knowledge_bases')
    .select('kb_id, agents(id, name)')
    .in('kb_id', kbIds)

  if (linksError) throw linksError

  const agentsByKbId = new Map<string, Array<Pick<Tables<'agents'>, 'id' | 'name'>>>()
  for (const link of agentLinksRows ?? []) {
    const kbId = link.kb_id
    const agent = (link as { agents?: Pick<Tables<'agents'>, 'id' | 'name'> | null }).agents ?? null
    if (!agent) continue

    if (!agentsByKbId.has(kbId)) agentsByKbId.set(kbId, [])
    agentsByKbId.get(kbId)!.push(agent)
  }

  return kbRows.map((kb) => ({
    ...kb,
    document_count: docCountByKbId.get(kb.id) ?? 0,
    agents_using_it: agentsByKbId.get(kb.id) ?? [],
  }))
}

/**
 * Get a specific knowledge base.
 */
export async function getKnowledgeBase(supabase: SupabaseClientType, id: string): Promise<KnowledgeBaseDetail> {
  const { data: kbRow, error } = await supabase
    .from('knowledge_bases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!kbRow) throw new Error('Knowledge base not found')

  const { data: agentLinksRows, error: linksError } = await supabase
    .from('agent_knowledge_bases')
    .select('agents(id, name)')
    .eq('kb_id', id)

  if (linksError) throw linksError

  const agents_using_it = (agentLinksRows ?? [])
    .map((link) => (link as { agents?: Pick<Tables<'agents'>, 'id' | 'name'> | null }).agents ?? null)
    .filter((a): a is Pick<Tables<'agents'>, 'id' | 'name'> => Boolean(a))

  return {
    ...kbRow,
    agents_using_it,
  }
}

export async function createKnowledgeBase(
  supabase: SupabaseClientType,
  payload: Pick<TablesInsert<'knowledge_bases'>, 'workspace_id' | 'name'> & { description?: string | null }
): Promise<KnowledgeBase> {
  const { data, error } = await supabase
    .from('knowledge_bases')
    .insert({
      workspace_id: payload.workspace_id,
      name: payload.name,
      description: payload.description ?? null,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateKnowledgeBase(
  supabase: SupabaseClientType,
  id: string,
  updates: Pick<TablesUpdate<'knowledge_bases'>, 'name' | 'description'>
): Promise<KnowledgeBase> {
  const { data, error } = await supabase
    .from('knowledge_bases')
    .update({
      name: updates.name,
      description: updates.description ?? null,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteKnowledgeBase(supabase: SupabaseClientType, id: string): Promise<void> {
  const { error } = await supabase.from('knowledge_bases').delete().eq('id', id)
  if (error) throw error
}
