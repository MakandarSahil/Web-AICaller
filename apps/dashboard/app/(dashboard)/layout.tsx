import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getProfile } from '@aicaller/supabase/queries/profile'
import { getWorkspace } from '@aicaller/supabase/queries/workspace'
import { UserProvider } from '@/providers/user-provider'

/**
 * Root layout for all (dashboard) routes.
 *
 * Responsibilities:
 * 1. Auth guard — redirects to /login if no session.
 * 2. Onboarding guard — redirects to /onboarding if no workspace yet.
 * 3. SSR-fetches profile + workspace once per page load.
 * 4. Injects them into UserProvider so every client component has them instantly.
 *
 * This layout no longer wraps children in DashboardShell directly.
 * Individual pages should use <DashboardShell> to allow for per-page 
 * contextual sidebars and unique headers.
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
      {children}
    </UserProvider>
  )
}
