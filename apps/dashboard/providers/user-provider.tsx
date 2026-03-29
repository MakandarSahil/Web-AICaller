'use client'

import { createContext, useContext } from 'react'
import type { Tables } from '@aicaller/supabase'

/**
 * UserContext — provides profile + workspace to any client component.
 *
 * WHY nullable:
 * A newly verified user has a session but Supabase's `handle_new_user` trigger
 * runs asynchronously. In the rare case the layout SSR fetch runs before the
 * trigger completes, profile/workspace may be null. Components using useUser()
 * should handle null gracefully (show skeleton or fall back to email).
 *
 * In practice this window is <100ms and almost never visible to the user.
 *
 * DO NOT store auth tokens or sensitive data here — this is client-side.
 */

type UserContextValue = {
  profile: Tables<'profiles'> | null
  workspace: Tables<'workspaces'> | null
  /** Always available — comes from auth.users, not the trigger. */
  email: string
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: UserContextValue
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/**
 * Access profile, workspace, and email from any client component.
 *
 * Always available inside (dashboard) layout — throws if called outside it.
 *
 * Handle nulls:
 *   const { profile, workspace, email } = useUser()
 *   const displayName = profile?.full_name ?? email
 *   if (!workspace) return <OnboardingPrompt />
 */
export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be called within a <UserProvider>')
  return ctx
}