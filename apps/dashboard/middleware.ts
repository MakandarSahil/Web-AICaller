import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@aicaller/supabase/middleware'

// Public routes — no auth required
const PUBLIC_ROUTES = ['/login', '/signup', '/auth/callback', '/otp']

// Auth routes — redirect away if already logged in
const AUTH_ROUTES = ['/login', '/signup', '/otp']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow bypassing auth if NEXT_PUBLIC_DISABLE_AUTH is set
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
    return NextResponse.next()
  }

  // Refresh session on every request — keeps JWT alive
  const { supabaseResponse, user } = await updateSession(request)

  // Already logged in and hitting an auth page → go to dashboard home
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Not logged in and hitting a protected route → go to login
  if (!user && !PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
