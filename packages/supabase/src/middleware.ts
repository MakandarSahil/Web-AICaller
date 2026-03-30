import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from './types/database.types'
import { getSupabaseEnv } from './env'

/**
 * Call this inside apps/dashboard/middleware.ts to refresh
 * the Supabase auth session on every request.
 *
 * This is required to keep the session alive — Supabase uses
 * short-lived JWTs that need refreshing via the middleware.
 */
export async function updateSession(request: NextRequest) {
  const { url, anonKey } = getSupabaseEnv()

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT remove this line
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}