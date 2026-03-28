import { Phone, Mic, Volume2, ArrowRight } from 'lucide-react'

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER ?? '+91 XXXXX XXXXX'

const DEMO_STEPS = [
  { icon: Phone, text: 'Call the number below from your phone' },
  { icon: Mic, text: 'Ask anything — hours, pricing, how it works' },
  { icon: Volume2, text: 'Hear the AI respond in real-time' },
]

const SAMPLE_QUESTIONS = [
  'What does CallMind do?',
  'How long does setup take?',
  'What languages do you support?',
  'How much does it cost?',
  'Can I bring my own phone number?',
  'Is there a free trial?',
]

export function Demo() {
  return (
    <section id="demo" className="section py-24 lg:py-32">
      <div className="container-tight">
        {/* Outer glow wrapper */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-brand-500/5 blur-3xl" />

          <div className="relative glass overflow-hidden rounded-3xl border border-brand-500/20 shadow-glass-lg">
            {/* Top gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700" />

            <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — copy */}
              <div className="flex flex-col justify-center">
                <span className="inline-block w-fit rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
                  Live demo
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-content sm:text-4xl">
                  Hear it for yourself.
                  <br />
                  <span className="text-gradient">Call our demo agent.</span>
                </h2>

                <p className="mt-4 text-base leading-relaxed text-content-secondary">
                  Our demo agent knows everything about CallMind. Ask it anything — pricing,
                  features, how it works. It's the same technology you'll deploy for your business.
                </p>

                {/* Steps */}
                <div className="mt-8 space-y-4">
                  {DEMO_STEPS.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/25">
                        <Icon className="h-4 w-4 text-brand-400" />
                      </div>
                      <span className="text-sm text-content-secondary">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Sample questions */}
                <div className="mt-8">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-content-tertiary">
                    Try asking
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_QUESTIONS.map((q) => (
                      <span
                        key={q}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-content-secondary"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — phone number card */}
              <div className="flex flex-col items-center justify-center">
                <div className="glass w-full max-w-sm rounded-2xl border border-white/[0.08] p-8 text-center shadow-glass">
                  {/* Animated phone icon */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    {/* Ripple rings */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping"
                        style={{
                          animationDelay: `${i * 0.4}s`,
                          animationDuration: '2s',
                          transform: `scale(${1 + i * 0.25})`,
                        }}
                      />
                    ))}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20 ring-2 ring-brand-500/40 shadow-glow">
                      <Phone className="h-8 w-8 text-brand-400" />
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                    <span className="text-xs font-medium text-brand-400">
                      Agent online · 24/7
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-content-secondary">Call this number now</p>

                  {/* Phone number */}
                  <a
                    href={`tel:${DEMO_PHONE.replace(/\s/g, '')}`}
                    className="group mt-2 block"
                  >
                    <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 px-6 py-4 transition-all hover:border-brand-500/40 hover:bg-brand-500/15 hover:shadow-glow-sm">
                      <span className="font-mono text-2xl font-bold tracking-wider text-content">
                        {DEMO_PHONE}
                      </span>
                      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-brand-400">
                        <span>Tap to call</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </a>

                  <p className="mt-4 text-xs text-content-tertiary">
                    Standard call rates apply. No account needed.
                  </p>
                </div>

                {/* Powered by */}
                <div className="mt-6 flex items-center gap-3 text-xs text-content-tertiary">
                  <span>Powered by</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">Azure STT</span>
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">Groq LLM</span>
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">Azure TTS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}