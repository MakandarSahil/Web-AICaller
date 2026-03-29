import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { OverviewClient } from './components/overview-client'
import { getWorkspaceStats } from '@aicaller/supabase/queries'

/**
 * Dashboard overview page — Server Component.
 *
 * SSR fetches:
 *  - workspace stats + recent agents → for stats grid + recent agents table
 *
 * Profile + workspace come from the layout via UserProvider — no re-fetch here.
 * Passes stats as props to OverviewClient → zero loading flash.
 */
export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient()

  // Auth + workspace guards are already enforced by the parent layout.
  // Only fetch stats specific to this page.
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
