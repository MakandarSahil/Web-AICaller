import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgent, getKnowledgeBases } from '@aicaller/supabase/queries'
import { AgentDetailMaster } from './components/agent-detail-master'
import { notFound } from 'next/navigation'

/**
 * Agent Detail Page — Server Component
 * 
 * 1. Fetches the specific agent by ID
 * 2. Renders the tabbed Detail Master interface
 * 
 * Note: No DashboardShell here because it's already provided by agents/layout.tsx
 */
export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // Fetch specific agent data
  const agent = await getAgent(supabase, id).catch(() => null)
  const knowledgeBases = await getKnowledgeBases(supabase).catch(() => [])
  
  if (!agent) {
    notFound()
  }

  return <AgentDetailMaster agent={agent} knowledgeBases={knowledgeBases} />
}
