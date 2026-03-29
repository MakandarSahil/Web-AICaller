import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { NextResponse } from 'next/server'

/**
 * /auth/callback — handles ALL Supabase auth redirects:
 *
 *  1. Google OAuth  — Supabase sends ?code= after Google approves
 *  2. Magic link    — Supabase sends ?code= from email link click
 *  3. OTP email     — user clicks link in OTP email (alternative to typing code)
 *
 * Flow:
 *   Supabase redirect → /auth/callback?code=XXX&next=/dashboard
 *   → exchangeCodeForSession (sets cookie)
 *   → redirect to `next`
 *
 * Security:
 *   - `next` is validated to be a safe relative path
 *   - Raw error messages are never forwarded to the client URL
 *   - If exchange fails, redirect to /login with a generic error param
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Validate `next` — only allow safe relative paths (prevents open redirect)
  const rawNext = requestUrl.searchParams.get('next') ?? '/'
  const next = /^\/[^/\\]/.test(rawNext) ? rawNext : '/'

  if (!code) {
    // No code — likely a direct navigation or stale link
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
    // Generic error — never expose raw message in URL (visible in browser history)
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', requestUrl.origin)
    )
  }

  // Success — forward to intended destination
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}