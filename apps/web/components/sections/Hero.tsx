import Link from 'next/link'
import { ArrowRight, Phone, Zap, Shield } from 'lucide-react'

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

const TRUST_BADGES = [
  { icon: Zap, label: 'Live in minutes' },
  { icon: Phone, label: 'Any phone number' },
  { icon: Shield, label: 'Enterprise-grade' },
]

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      {/* Radial glow behind headline */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] rounded-full bg-brand-500/[0.07] blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Announcement pill */}
        <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
          <span className="text-xs font-medium text-brand-300">
            Now in V1 — AI voice agents for every business
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up max-w-4xl text-5xl font-bold tracking-tighter text-content sm:text-6xl lg:text-7xl xl:text-8xl">
          Your business,{' '}
          <span className="text-gradient">always answering.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-lg leading-relaxed text-content-secondary sm:text-xl"
          style={{ animationDelay: '0.1s' }}
        >
          Configure an AI agent with your knowledge base, assign a phone number,
          and let it handle calls and queries intelligently — in minutes, not months.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex animate-fade-in-up flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: '0.2s' }}
        >
          <Link
            href={`${DASHBOARD_URL}/signup`}
            className="group btn-glow inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all hover:bg-brand-600 hover:shadow-glow-lg"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-content transition-all hover:border-white/20 hover:bg-white/10"
          >
            <Phone className="h-4 w-4 text-brand-400" />
            Try a live call
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="mt-12 flex animate-fade-in-up flex-wrap items-center justify-center gap-6"
          style={{ animationDelay: '0.3s' }}
        >
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm text-content-secondary"
            >
              <Icon className="h-4 w-4 text-brand-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Hero visual — phone call mockup */}
        <div
          className="relative mt-20 w-full max-w-3xl animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-4 rounded-3xl bg-brand-500/10 blur-2xl" />

          <div className="glass relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-glass-lg">
            {/* Fake terminal / call UI */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-brand-500/80" />
              <span className="ml-2 text-xs text-content-tertiary">
                CallMind — Live conversation
              </span>
            </div>
            <div className="space-y-4 p-6">
              {[
                { role: 'caller', text: 'Hi, what are your business hours?' },
                {
                  role: 'agent',
                  text: "We're open Monday to Friday, 9am to 6pm IST. On weekends we're closed but you can leave a message!",
                },
                { role: 'caller', text: 'Do you offer a free trial?' },
                {
                  role: 'agent',
                  text: 'Yes! You can start with our free tier — no credit card required. Would you like me to send you the sign-up link?',
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.role === 'agent' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/20 ring-1 ring-brand-500/30">
                      <span className="text-[10px] font-bold text-brand-400">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-sm rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'agent'
                        ? 'bg-white/5 text-content'
                        : 'bg-brand-500/20 text-brand-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 ring-1 ring-brand-500/30">
                  <span className="text-[10px] font-bold text-brand-400">AI</span>
                </div>
                <div className="flex gap-1 rounded-xl bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom stats bar */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                <span className="text-xs text-content-tertiary">Live call · 0:42</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-content-tertiary">
                <span>STT: Azure</span>
                <span>LLM: Groq</span>
                <span>TTS: Azure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}