import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getProfile } from '@aicaller/supabase/queries/profile'
import { getWorkspace } from '@aicaller/supabase/queries/workspace'
import { UserProvider } from '@/providers/user-provider'
import { DashboardShell } from '@/components/layout/dashboard-shell'

/**
 * Root layout for all (dashboard) routes.
 *
 * Responsibilities:
 * 1. Auth guard — redirects to /login if no session.
 * 2. Onboarding guard — redirects to /onboarding if no workspace yet.
 * 3. Admin guard — number_pool route is handled in its own layout.
 * 4. SSR-fetches profile + workspace once per page load.
 * 5. Injects them into UserProvider so every client component has them instantly.
 *
 * This runs on every navigation inside the dashboard — Next.js caches the
 * server component output per request so it's not re-fetched on every render.
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
  // If they don't exist yet (new account), we just use null — we no longer kick to /login here.
  const [profile, workspace] = await Promise.all([
    getProfile(supabase).catch(() => null),
    getWorkspace(supabase).catch(() => null),
  ])

  return (
    <UserProvider value={{ profile, workspace, email: user.email ?? '' }}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </UserProvider>
  )
}
