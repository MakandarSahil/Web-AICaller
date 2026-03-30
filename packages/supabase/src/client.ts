import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types/database.types'
import { getSupabaseEnv } from './env'

/**
 * Browser Supabase client — uses anon key.
 * Use in Client Components ('use client') for:
 *   - Auth state listeners
 *   - Realtime subscriptions
 *   - Client-side mutations
 *
 * Never use for sensitive data reads — use server client instead.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv()

  return createBrowserClient<Database>(
    url,
    anonKey
  )
}