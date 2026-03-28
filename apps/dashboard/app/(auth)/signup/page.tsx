'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@aicaller/supabase/client'
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Google icon SVG                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

import { Button, Input, Label, cn } from '@aicaller/ui'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Signup Page                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const passwordsMatch = password === confirmPassword
  const isFormValid =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    password.length >= 6 &&
    passwordsMatch

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      
      if (data.session) {
        // Email confirmation is disabled
        router.push('/onboarding')
      } else {
        // Email confirmation is required
        setSuccess(true)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google signup failed'
      setError(message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-[15rem] mx-auto">
            We sent a verification link to <span className="font-semibold text-gray-900">{email}</span>. Please confirm your email to continue.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full h-12 rounded-xl mt-6">
            Return to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Sign up for an account to get started
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Google SSO */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="w-full h-12 rounded-xl"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-gray-700">Full Name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-gray-700">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-gray-700">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
              className="pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-xs text-amber-600">Must be at least 6 characters</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-confirm" className="text-gray-700">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className={cn("pl-10 pr-11", confirmPassword.length > 0 && !passwordsMatch && "border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-500")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full h-12 rounded-xl text-sm font-semibold relative mt-2"
        >
          <span className={loading ? 'invisible' : ''}>Continue with email</span>
          {loading && (
            <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin" />
          )}
        </Button>
      </form>

      {/* Footer link — mobile only */}
      <p className="text-center text-sm text-gray-500 lg:hidden">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Log in
        </Link>
      </p>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400">
        By signing up you agree to our{' '}
        <a href="#" className="underline hover:text-gray-500">Terms of Service</a>
        {' '}&{' '}
        <a href="#" className="underline hover:text-gray-500">Privacy Policy</a>
      </p>
    </div>
  )
}
