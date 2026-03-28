import Link from 'next/link'
import { ArrowRight, GraduationCap, Lightbulb, Target } from 'lucide-react'

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

const VALUES = [
  {
    icon: GraduationCap,
    title: 'Built in college, for the world',
    description:
      'CallMind started as a final year Computer Engineering project. We built what we wished existed — a platform that actually works.',
  },
  {
    icon: Lightbulb,
    title: 'Real technology, real results',
    description:
      'Azure Speech, Groq LLMs, and Azure Neural TTS — not toys. The same infrastructure that powers enterprise voice systems.',
  },
  {
    icon: Target,
    title: 'Voice AI for everyone',
    description:
      'Not just large companies. Any business — a clinic, a restaurant, a consultancy — should be able to deploy an intelligent voice agent.',
  },
]

export function About() {
  return (
    <section id="about" className="section py-24 lg:py-32">
      <div className="container-wide">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — story */}
          <div>
            <span className="inline-block rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
              About
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-content sm:text-4xl">
              Why we built
              <br />
              <span className="text-gradient">CallMind</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-content-secondary">
              Most businesses miss calls. Most IVR systems are frustrating. Most AI solutions
              require ML expertise to set up. We wanted to fix all three problems at once.
            </p>
            <p className="mt-4 text-base leading-relaxed text-content-secondary">
              CallMind is a pluggable STT → LLM → TTS pipeline with a clean dashboard on top.
              You configure the agent, we handle the infrastructure. Your callers get intelligent
              responses in real-time.
            </p>
            <p className="mt-4 text-base leading-relaxed text-content-secondary">
              We're a small team of engineers who believe great voice AI should be accessible to
              every business, not just the ones with ML teams.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={`${DASHBOARD_URL}/signup`}
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all hover:bg-brand-600 hover:shadow-glow"
              >
                Join us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right — values */}
          <div className="space-y-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass glass-hover flex gap-4 rounded-2xl border border-white/[0.06] p-6 transition-all hover:border-brand-500/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/25">
                  <Icon className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-content">{title}</h3>
                  <p className="text-sm leading-relaxed text-content-secondary">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}