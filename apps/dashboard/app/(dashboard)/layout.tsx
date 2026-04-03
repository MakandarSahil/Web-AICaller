import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getProfile } from '@aicaller/supabase/queries/profile'
import { getWorkspace } from '@aicaller/supabase/queries/workspace'
import { UserProvider } from '@/providers/user-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { DashboardShell } from '@/components/layout/dashboard-shell'

/**
 * Root layout for all (dashboard) routes.
 * 
 * Now provides a consistent, non-re-rendering shell for the entire dashboard.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile + workspace in parallel. 
  const [profile, workspace] = await Promise.all([
    getProfile(supabase).catch(() => null),
    getWorkspace(supabase).catch(() => null),
  ])

  return (
    <UserProvider value={{ profile, workspace, email: user.email ?? '' }}>
      <NuqsAdapter>
        <SidebarProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  )
}
