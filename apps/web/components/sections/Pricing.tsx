import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For trying CallMind and building your first agent.',
    cta: 'Get started free',
    ctaHref: `${DASHBOARD_URL}/signup`,
    highlight: false,
    features: [
      '1 AI agent',
      '1 knowledge base',
      'Up to 50 calls / month',
      'Basic conversation logs',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '₹2,999',
    period: 'per month',
    description: 'For businesses that need reliable AI call handling at scale.',
    cta: 'Start Pro trial',
    ctaHref: `${DASHBOARD_URL}/signup?plan=pro`,
    highlight: true,
    badge: 'Most popular',
    features: [
      'Unlimited agents',
      'Unlimited knowledge bases',
      '500 calls / month included',
      'Full conversation transcripts',
      'Summary editing',
      'API access + webhooks',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored to you',
    description: 'For large teams and high-volume deployments with custom needs.',
    cta: 'Contact us',
    ctaHref: 'mailto:hello@callmind.ai',
    highlight: false,
    features: [
      'Everything in Pro',
      'Custom call volumes',
      'Dedicated phone numbers',
      'Custom LLM / STT / TTS',
      'SLA guarantee',
      'Dedicated account manager',
      'On-premise option',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="section py-24 lg:py-32">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-content sm:text-4xl lg:text-5xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-content-secondary">
            Start free, scale when you need to. No hidden fees. No per-minute billing surprises.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 transition-all ${
                plan.highlight
                  ? 'border border-brand-500/40 bg-brand-500/[0.07] shadow-glow'
                  : 'glass border border-white/[0.06]'
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold text-white shadow-glow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-content">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-content">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-content-secondary">/ {plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-content-secondary">{plan.description}</p>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px bg-white/[0.06]" />

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/20">
                      <Check className="h-2.5 w-2.5 text-brand-400" />
                    </div>
                    <span className="text-sm text-content-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-brand-500 text-white shadow-glow-sm hover:bg-brand-600 hover:shadow-glow'
                    : 'border border-white/10 bg-white/5 text-content hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-content-tertiary">
          All prices in INR. International pricing coming soon.
          Questions? <a href="mailto:hello@callmind.ai" className="text-brand-400 hover:underline">hello@callmind.ai</a>
        </p>
      </div>
    </section>
  )
}