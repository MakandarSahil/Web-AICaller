import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background split: white left, blue right */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-[#3655E8] hidden lg:block" />
      </div>

      {/* Subtle decorative network lines on white area */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] hidden lg:block pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Radiating thin lines from center-right */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16
            const rad = (angle * Math.PI) / 180
            const x2 = 650 + Math.cos(rad) * 600
            const y2 = 450 + Math.sin(rad) * 600
            return (
              <line
                key={i}
                x1="650"
                y1="450"
                x2={x2}
                y2={y2}
                stroke="#9ca3af"
                strokeWidth="0.5"
              />
            )
          })}
          {/* Small circles at intersections */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16
            const rad = (angle * Math.PI) / 180
            const cx = 650 + Math.cos(rad) * 200
            const cy = 450 + Math.sin(rad) * 200
            return (
              <circle
                key={`c-${i}`}
                cx={cx}
                cy={cy}
                r="3"
                fill="#d1d5db"
              />
            )
          })}
        </svg>
      </div>

      <div className="container-wide relative z-10 flex min-h-screen items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full gap-12 py-32 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left — Text content */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="animate-fade-in mb-8">
              <span className="badge-pill">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                Built for Every Business
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up text-[3.25rem] font-bold leading-[1.08] tracking-tight text-[#1e1e1e] sm:text-[3.75rem] lg:text-[4.25rem]">
              Your calls answered right. Built on{' '}
              <span className="text-gradient-blue">CallMind.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 animate-fade-in-up text-lg leading-relaxed text-gray-500 max-w-lg"
              style={{ animationDelay: '0.1s' }}
            >
              CallMind sits at the front line, handling the simple questions,
              checks, and outreach across the customer lifecycle in the same way
              a good human would. It answers, qualifies, and routes through your
              existing stack in seconds.
            </p>

            {/* CTA buttons */}
            <div
              className="mt-10 flex animate-fade-in-up flex-wrap items-center gap-4"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                href={`${DASHBOARD_URL}/signup`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-blue px-7 py-3.5 text-base gap-2"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="btn-outline px-7 py-3.5 text-base gap-2"
              >
                <Phone className="h-4 w-4" />
                Try a live call
              </a>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="animate-fade-in-right relative"
              style={{ animationDelay: '0.3s' }}
            >
              {/* Phone */}
              <div className="phone-mockup w-[280px] sm:w-[320px] animate-float">
                <div className="notch" />
                <div className="flex flex-col items-center justify-center px-6 py-20 min-h-[480px] sm:min-h-[540px]">
                  {/* Phone input UI */}
                  <div className="w-full rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="text-lg">🇮🇳</span>
                      <span className="font-medium">+91</span>
                      <span className="text-gray-300">•</span>
                    </div>
                    <span className="text-gray-400 text-sm">81234 56789</span>
                  </div>

                  {/* Try Now button */}
                  <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e1e1e] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#333]">
                    <Phone className="h-4 w-4" />
                    Try Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by strip */}
      <div className="relative z-10 border-t border-gray-100 bg-white py-8">
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12">
            {['TechCorp', 'MediHealth', 'FinStart', 'EduLearn', 'RetailPro', 'CloudServ'].map(
              (name) => (
                <span
                  key={name}
                  className="text-lg font-bold text-gray-300 tracking-tight"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}