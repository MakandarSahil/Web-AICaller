import { GraduationCap, Lightbulb, Target } from 'lucide-react'

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
    <section id="about" className="section bg-white py-24 lg:py-32">
      <div className="container-wide">
        <div className="mb-16">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl lg:text-[2.75rem] font-medium leading-[1.1] tracking-tight text-[#1e1e1e]">
              Why we built CallMind
            </h2>
            <div className="space-y-4 text-[15px] sm:text-base text-gray-500">
              <p>
                Most businesses miss calls. Most IVR systems are frustrating. Most AI solutions
                require ML expertise to set up. We wanted to fix all three problems at once.
              </p>
              <p>
                CallMind is a pluggable STT → LLM → TTS pipeline with a clean dashboard on top.
                You configure the agent, we handle the infrastructure. Your callers get intelligent
                responses in real-time.
              </p>
              <p>
                We&apos;re a small team of engineers who believe great voice AI should be accessible to
                every business, not just the ones with ML teams.
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-3xl bg-[#f4f4f5] p-8 md:p-10 transition-transform"
            >
              <p className="text-[15px] sm:text-base text-[#1e1e1e] leading-relaxed mb-12">
                {description}
              </p>
              
              <div className="mt-auto">
                <div className="mb-6">
                  <h4 className="text-[15px] text-[#1e1e1e] font-medium">{title}</h4>
                  <p className="text-sm text-gray-500 mt-1">CallMind</p>
                </div>
                
                <div className="w-full border-t border-dashed border-gray-300 mb-6" />
                
                <div className="text-gray-400">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}