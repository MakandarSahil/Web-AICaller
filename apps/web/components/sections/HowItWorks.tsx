import { UserPlus, BookOpen, Phone } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Sign up & configure your agent',
    description:
      'Create your account in seconds. Give your agent a name, a persona, and a system prompt that defines how it talks and what it knows.',
  },
  {
    step: '02',
    icon: BookOpen,
    title: 'Upload your knowledge base',
    description:
      'Drop in your PDFs, docs, or paste plain text — FAQs, product manuals, support docs. Your agent reads everything and uses it on every call.',
  },
  {
    step: '03',
    icon: Phone,
    title: 'Get a number and go live',
    description:
      'Assign a phone number from our pool or bring your own. Your agent starts answering calls immediately — 24/7, no human intervention needed.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-gray py-24 lg:py-32">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="badge-pill">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e1e1e] sm:text-4xl lg:text-5xl">
            From zero to live calls
            <br />
            <span className="text-gradient-blue">in under 10 minutes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            No ML expertise required. No infrastructure to manage. Just configure, connect, and call.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="absolute left-0 right-0 top-[60px] hidden lg:block">
            <div className="mx-auto w-2/3 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="group relative flex flex-col items-center text-center">
                {/* Step icon */}
                <div className="relative mb-6">
                  <div className="card-light flex h-20 w-20 items-center justify-center rounded-2xl transition-all group-hover:shadow-card-hover">
                    <Icon className="h-8 w-8 text-brand" />
                  </div>
                  {/* Step number */}
                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white shadow-blue-glow">
                    {step.slice(1)}
                  </div>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-[#1e1e1e]">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}