import type { SupabaseClientType } from './_types'
import type { Database, TablesUpdate } from '../types'

/**
 * Fetch the authenticated user's profile row.
 * Includes is_admin — used to guard /admin routes client-side.
 *
 * Note: server-side admin guard still runs in layout.tsx via
 * createServerSupabaseClient() — never trust client-only checks for security.
 */
export async function getProfile(supabase: SupabaseClientType) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Update profile fields (full_name, phone, avatar_url, account_type).
 * is_admin is intentionally excluded — can only be set by platform admin via service role.
 */
export async function updateProfile(
  supabase: SupabaseClientType,
  payload: Omit<TablesUpdate<'profiles'>, 'id' | 'is_admin' | 'created_at'>
) {
  // Physically strip is_admin at runtime as per security rules
  const safePayload = { ...payload }
  delete (safePayload as any).is_admin

  const { data, error } = await supabase
    .from('profiles')
    .update(safePayload)
    .select()
    .single()

  if (error) throw error
  return data
}