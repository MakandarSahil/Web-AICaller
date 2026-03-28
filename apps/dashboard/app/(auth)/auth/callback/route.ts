import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } else {
      console.error('Email verification error:', error.message)
      // If error, redirect to login with error parameter to show properly in UI
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
    }
  }

  // Fallback if no code is present
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
