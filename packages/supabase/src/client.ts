import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types/database.types'

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
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}