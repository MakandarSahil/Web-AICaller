'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Phone, Zap, Shield, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Floating feature pills for the brand panel                              */
/* ────────────────────────────────────────────────────────────────────────── */
const features = [
  { icon: Bot, label: 'AI Voice Agents' },
  { icon: Phone, label: 'Smart Phone Numbers' },
  { icon: Zap, label: 'Instant Setup' },
  { icon: Shield, label: 'Enterprise Security' },
  { icon: MessageSquare, label: 'Real-time Transcripts' },
]

const testimonials = [
  {
    quote: "CallMind replaced our entire call center. Response quality is incredible and setup took 15 minutes.",
    name: "Priya Sharma",
    role: "CTO, TechVista Solutions",
  },
  {
    quote: "Our customer satisfaction scores jumped 40% within a week of switching to CallMind's AI agents.",
    name: "Rahul Mehta",
    role: "Head of Support, CloudNine",
  },
  {
    quote: "The knowledge base integration is brilliant — our agent answers domain-specific questions better than our team.",
    name: "Ananya Iyer",
    role: "Founder, DataPulse AI",
  },
]

/* ────────────────────────────────────────────────────────────────────────── */
/*  Brand Panel (right side)                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
function BrandPanel() {
  return (
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4338ca] via-[#6366f1] to-[#a78bfa] p-10 lg:flex xl:p-14">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-muted/30 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-300/10 blur-2xl" />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight text-white">
            call<span className="font-semibold">Mind</span>
          </span>
          <span className="rounded-md bg-muted/200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            AI
          </span>
        </Link>
      </div>

      {/* Main headline */}
      <div className="relative z-10 my-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
        >
          The Future of
          <br />
          <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            Voice AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md text-base leading-relaxed text-indigo-100/80"
        >
          Configure your AI agent, upload your knowledge base, and let it handle
          calls and queries intelligently — in minutes, not months.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap gap-2.5"
        >
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.span
                key={f.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </motion.span>
            )
          })}
        </motion.div>
      </div>

      {/* Testimonial ticker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10"
      >
        <div className="overflow-hidden">
          <div className="flex animate-scroll gap-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="w-72 flex-shrink-0 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md"
              >
                <p className="text-sm leading-relaxed text-white/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/200 text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-indigo-200">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Auth Layout                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'
  const isSignup = pathname === '/signup'

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — Form */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Mobile-only logo */}
        <div className="absolute left-6 top-6 lg:hidden">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              call<span className="font-semibold">Mind</span>
            </span>
            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              AI
            </span>
          </Link>
        </div>

        {/* Desktop top-right nav */}
        <div className="absolute right-6 top-6 hidden lg:block">
          {isLogin && (
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          )}
          {isSignup && (
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Log in
              </Link>
            </p>
          )}
        </div>

        {/* Form content */}
        <div className="w-full max-w-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right — Brand panel */}
      <div className="hidden h-screen w-1/2 lg:block">
        <BrandPanel />
      </div>
    </div>
  )
}
