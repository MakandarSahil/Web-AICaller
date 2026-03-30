import { DashboardShell } from '@/components/layout/dashboard-shell'
import { OverviewClient } from './components/overview-client'

/**
 * Dashboard overview page — Server Component.
 *
 * Profile + workspace come from the layout via UserProvider — no re-fetch here.
 */
export default async function DashboardOverviewPage() {
  return (
    <DashboardShell>
      <OverviewClient />
    </DashboardShell>
  )
}
