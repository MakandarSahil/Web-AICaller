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
    <section id="about" className="section section-gray py-24 lg:py-32">
      <div className="container-wide">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — story */}
          <div>
            <span className="badge-pill">
              About
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e1e1e] sm:text-4xl">
              Why we built
              <br />
              <span className="text-gradient-blue">CallMind</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Most businesses miss calls. Most IVR systems are frustrating. Most AI solutions
              require ML expertise to set up. We wanted to fix all three problems at once.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              CallMind is a pluggable STT → LLM → TTS pipeline with a clean dashboard on top.
              You configure the agent, we handle the infrastructure. Your callers get intelligent
              responses in real-time.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              We&apos;re a small team of engineers who believe great voice AI should be accessible to
              every business, not just the ones with ML teams.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={`${DASHBOARD_URL}/signup`}
                className="group btn-blue px-6 py-3 text-sm gap-2"
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
                className="card-light flex gap-4 rounded-2xl p-6 transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-[#1e1e1e]">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}