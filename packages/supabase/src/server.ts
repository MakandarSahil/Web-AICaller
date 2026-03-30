import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types/database.types'
import { getSupabaseEnv } from './env'

/**
 * Server Supabase client — uses anon key + RLS.
 * Use in:
 *   - Server Components (data fetching)
 *   - Server Actions (mutations)
 *   - Route Handlers (API routes)
 *
 * Automatically reads auth session from cookies.
 * RLS policies apply — user only sees their own data.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — cookies can't be set.
            // Middleware handles session refresh, this is safe to ignore.
          }
        },
      },
    }
  )
}