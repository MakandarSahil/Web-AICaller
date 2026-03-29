import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { OverviewClient } from './components/overview-client'
import { redirect } from 'next/navigation'
import { getWorkspace, getWorkspaceStats } from '@aicaller/supabase/queries'

/**
 * Dashboard overview page — Server Component.
 *
 * SSR fetches:
 *  - agents (with usage stats joined) → for stats grid + recent agents table
 *
 * Profile + workspace come from layout via UserProvider — no re-fetch here.
 * Passes agents as initialData to OverviewClient → zero loading flash.
 */
export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient()

  // 2. Fetch Active Workspace
  const workspaceRaw = await getWorkspace(supabase)

  if (!workspaceRaw) {
    redirect('/onboarding')
  }

  // 3. Fetch Dashboard Statistics
  const { agentsCount, kbCount, callersCount, numbersCount, recentAgents } = await getWorkspaceStats(supabase)

  return (
    <OverviewClient
      initialAgents={recentAgents}
      agentsCount={agentsCount}
      kbCount={kbCount}
      callersCount={callersCount}
      phoneNumbersCount={numbersCount}
    />
  )
}