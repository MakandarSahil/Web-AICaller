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
    <section id="pricing" className="section py-24 lg:py-32 bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="badge-pill">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e1e1e] sm:text-4xl lg:text-5xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
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
                  ? 'border-2 border-brand bg-brand-50 shadow-blue-glow'
                  : 'card-light'
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white shadow-blue-glow">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1e1e1e]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-[#1e1e1e]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-gray-500">/ {plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px bg-gray-100" />

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-50">
                      <Check className="h-2.5 w-2.5 text-brand" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-brand text-white hover:bg-brand-dark shadow-blue-glow hover:shadow-lg'
                    : 'border-2 border-gray-200 text-[#1e1e1e] hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-gray-400">
          All prices in INR. International pricing coming soon.
          Questions? <a href="mailto:hello@callmind.ai" className="text-brand hover:underline">hello@callmind.ai</a>
        </p>
      </div>
    </section>
  )
}