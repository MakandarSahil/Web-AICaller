import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getKnowledgeBases } from '@aicaller/supabase/queries'
import AgentCreateClient from './create-agent-client'

export default async function CreateAgentPage() {
  const supabase = await createServerSupabaseClient()
  const knowledgeBases = await getKnowledgeBases(supabase).catch(() => [])

  return <AgentCreateClient initialKnowledgeBases={knowledgeBases} />
}
