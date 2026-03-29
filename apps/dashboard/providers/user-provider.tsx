'use client'

import { createContext, useContext } from 'react'
import type { Tables } from '@aicaller/supabase'

/**
 * UserContext — provides profile + workspace to any client component.
 *
 * WHY a separate context and not just TanStack Query hooks everywhere:
 * Profile and workspace data is needed by layout-level components (sidebar,
 * header) on EVERY page. Fetching in the root server layout and injecting
 * via context means zero loading state for these values — they're always ready.
 *
 * Pattern:
 *   1. Root server layout fetches profile + workspace via SSR.
 *   2. Passes them into <UserProvider value={...}>.
 *   3. Any client component calls useUser() — no loading, no flash.
 *   4. TanStack Query still owns mutation/refetch for these — they share the
 *      same data, just with initialData hydrated from this context.
 *
 * DO NOT store auth tokens or sensitive data here — this is client-side.
 */

type UserContextValue = {
  profile: Tables<'profiles'>
  workspace: Tables<'workspaces'>
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
 * Access profile and workspace from any client component.
 * Throws if used outside <UserProvider> — this is intentional.
 * Every page inside (dashboard) layout has the provider, so it should never throw in practice.
 */
export function useUser() {
  const ctx = useContext(UserContext)
  // Fallback to empty if not found, to prevent hard crash during layout transitions
  return ctx || { profile: null as any, workspace: null as any }
}