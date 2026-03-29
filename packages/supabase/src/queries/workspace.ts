import type { SupabaseClientType } from './_types'
import type { TablesUpdate } from '../types'

/**
 * Fetch the authenticated user's workspace.
 * Returns null if no workspace exists (should redirect to /onboarding).
 *
 * Used in:
 *  - Server Components: page-level SSR fetch
 *  - hooks/use-workspace.ts: TanStack Query wrapper
 */
export async function getWorkspace(supabase: SupabaseClientType) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .single()

  if (error) {
    // PGRST116 = no rows — workspace not yet created (redirect to onboarding)
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Update workspace fields.
 * Never called server-side (mutations go through server actions or client).
 */
export async function updateWorkspace(
  supabase: SupabaseClientType,
  payload: TablesUpdate<'workspaces'>
) {
  const { data, error } = await supabase
    .from('workspaces')
    .update(payload)
    .select()
    .single()


  if (error) throw error
  return data
}

/**
 * Fetch overview statistics for the active workspace.
 * Uses RLS to automatically filter counts to the current workspace.
 * Used on the dashboard home page.
 */
export async function getWorkspaceStats(supabase: SupabaseClientType) {
  const [
    { count: agentsCount, error: agentsErr },
    { count: kbCount, error: kbErr },
    { count: callersCount, error: callersErr },
    { count: numbersCount, error: numbersErr },
    { data: recentAgents, error: recentErr }
  ] = await Promise.all([
    supabase.from('agents').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_bases').select('*', { count: 'exact', head: true }),
    supabase.from('callers').select('*', { count: 'exact', head: true }),
    supabase.from('phone_numbers').select('*', { count: 'exact', head: true }),
    supabase.from('agents').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  if (agentsErr) throw agentsErr
  if (kbErr) throw kbErr
  if (callersErr) throw callersErr
  if (numbersErr) throw numbersErr
  if (recentErr) throw recentErr

  return {
    agentsCount: agentsCount ?? 0,
    kbCount: kbCount ?? 0,
    callersCount: callersCount ?? 0,
    numbersCount: numbersCount ?? 0,
    recentAgents: recentAgents ?? []
  }
}