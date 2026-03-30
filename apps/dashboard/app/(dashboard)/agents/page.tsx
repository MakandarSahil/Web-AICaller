import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents } from '@aicaller/supabase/queries'
import { AgentsList } from './components/agents-list'

/**
 * Agents Page — Server Component
 *
 * 1. Initialize SSR Supabase client
 * 2. Fetch all agents in the workspace
 * 3. Dehydrate to Client Component for instant first-paint
 */
export default async function AgentsPage() {
  const supabase = await createServerSupabaseClient()
  const initialData = await getAgents(supabase)

  return <AgentsList initialData={initialData} />
}
