import { UserPlus, BookOpen, PhoneCall } from 'lucide-react'

const STEPS = [
  {
    step: '1',
    icon: UserPlus,
    title: 'Sign up & configure your agent',
    description:
      'Create your account in seconds. Give your agent a name, a persona, and a system prompt that defines how it talks and what it knows.',
  },
  {
    step: '2',
    icon: BookOpen,
    title: 'Upload your knowledge base',
    description:
      'Drop in your PDFs, docs, or paste plain text — FAQs, product manuals, support docs. Your agent reads everything and uses it on every call.',
  },
  {
    step: '3',
    icon: PhoneCall,
    title: 'Get a number and go live',
    description:
      'Assign a phone number from our pool or bring your own. Your agent starts answering calls immediately — 24/7, no human intervention needed.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="w-full max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-20 flex flex-col items-center text-center">
          <span className="inline-block rounded-full bg-[#f3f4f6] px-5 py-2 text-base text-gray-600 font-semibold mb-6">
            How it works
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            From zero to live calls
            <br />
            <span>in under 10 minutes</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            No ML expertise required. No infrastructure to manage. Just configure, connect, and call.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 lg:mt-24">

          {/* Connector line — desktop */}
          <div className="absolute left-0 right-0 top-[48px] hidden lg:block z-0">
            <div className="mx-auto w-[65%] h-[1px] bg-gray-200" />
          </div>

          <div className="grid gap-16 lg:gap-10 lg:grid-cols-3 relative z-10 w-full">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative flex flex-col items-center text-center p-10 rounded-none border border-gray-200 bg-white">

                {/* Step icon shape matching the screenshot */}
                <div className="relative mb-8 flex h-[96px] w-[96px] items-center justify-center rounded-[28px] bg-white shadow-[0_12px_40px_rgb(0,0,0,0.06)] ring-1 ring-gray-100">
                  <Icon className="h-9 w-9 text-[#3763f4] stroke-[2]" />

                  {/* Blue circle badge Top Right exactly like screenshot */}
                  <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#3763f4] text-[13px] font-bold text-white shadow-lg shadow-blue-500/40">
                    {step}
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-base leading-relaxed text-gray-500 max-w-[18rem]">{description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}