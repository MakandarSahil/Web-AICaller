'use client'

import { useState, useRef } from 'react'
import {
  Handshake,
  Share2,
  Globe,
  Layers,
  GitBranch,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react'

interface FeatureCardData {
  id: number
  title: string
  closedTitle: React.ReactNode
  description: string
  icon: LucideIcon
  bgImage: string
}

const CALLERS_FEATURES: FeatureCardData[] = [
  {
    id: 1,
    icon: Handshake,
    bgImage: '/multiligual-agent.png',
    closedTitle: (
      <>
        Human time <br /> where it matters
      </>
    ),
    title: 'Human time where it matters',
    description:
      'Callers keeps your teams on the moments where judgment and presence actually change the outcome, not on routine questions and follow‑ups.',
  },
  {
    id: 2,
    icon: Share2,
    bgImage: '/omni-channel.png',
    closedTitle: (
      <>
        Coverage across <br /> the whole lifecycle
      </>
    ),
    title: 'Coverage across the whole lifecycle',
    description:
      'From first outreach to win‑back, Callers handles simple questions, checks, nudges, and outreach across every stage of the customer journey.',
  },
  {
    id: 3,
    icon: Globe,
    bgImage: '/white-glove-care.png',
    closedTitle: (
      <>
        AI that feels human, <br /> not robotic
      </>
    ),
    title: 'AI that feels human, not robotic',
    description:
      'Calls and messages are handled the way a good human would, so customers get quick, natural responses without feeling the AI underneath.',
  },
  {
    id: 4,
    icon: Layers,
    bgImage: '/native-integrations.png',
    closedTitle: (
      <>
        Built into your <br /> existing stack
      </>
    ),
    title: 'Built into your existing stack',
    description:
      'Callers plugs into the systems you already run, answering, qualifying, re‑engaging, and routing through your current tools in seconds.',
  },
  {
    id: 5,
    icon: GitBranch,
    bgImage: '/1white-glove-care.png',
    closedTitle: (
      <>
        Clear routing between <br /> AI and people
      </>
    ),
    title: 'Clear routing between AI and people',
    description:
      'Simple work goes to Callers, high‑stakes moments go to your team—so customer work is always routed to the right place.',
  },
]

export function Features() {
  const [activeCardId, setActiveCardId] = useState<number | null>(1) // Default to opening the 1st card
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="features" className="relative w-full overflow-hidden bg-[#fafafa] py-24 pb-32 lg:py-32 xl:py-40">
      
      {/* Header Area constrained to standard wide container */}
      <div className="mx-auto mb-8 flex w-full max-w-[1300px] items-end justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-[700px] text-[36px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e1e] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[60px]">
          Route every customer
          <br className="hidden sm:block" />
          moment to the right place
        </h2>

        {/* Navigation Controls */}
        <div className="hidden shrink-0 items-center justify-end gap-3 md:flex">
          <button
            onClick={() => scroll('left')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/50 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/50 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Carousel Track: Unconstrained max-width, bleeds off the right edge, left padding dynamically aligns to container! */}
      <div className="relative w-full">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-12 pt-4 pr-8 md:gap-6 lg:gap-8 [&::-webkit-scrollbar]:hidden"
          style={{ 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none',
            /* Ensures every snapped card flawlessly aligns with the Header */
            scrollPaddingLeft: 'max(16px, calc(50vw - 650px + 32px))'
          }}
        >
          {CALLERS_FEATURES.map((feature, index) => {
            const isOpen = activeCardId === feature.id
            const Icon = feature.icon

            return (
              <div
                key={feature.id}
                className="snap-start shrink-0"
                style={{ 
                  /* ONLY the first item has the spatial buffer. This allows cards to smoothly bleed out of the left screen edge during scroll! */
                  paddingLeft: index === 0 ? 'max(16px, calc(50vw - 650px + 32px))' : '0px'
                }}
              >
                <div style={{ perspective: '1200px' }}>
                <div
                  /* Adjusted smaller sizes */
                  className={`group relative h-[380px] w-[280px] sm:h-[420px] sm:w-[310px] md:h-[440px] md:w-[325px] lg:h-[460px] lg:w-[340px] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpen ? 'cursor-default' : 'cursor-pointer hover:-translate-y-2'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                  onClick={() => setActiveCardId(isOpen ? null : feature.id)}
                >
                    
                    {/* --- FRONT FACE (CLOSED STATE) --- */}
                    <div 
                      className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] bg-transparent shadow-sm transition-shadow duration-700 group-hover:shadow-[0_20px_40px_rgba(67,82,255,0.3)]"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      {/* Full Background Image - natively contains text and plus button */}
                      <img 
                        src={feature.bgImage} 
                        alt={feature.title} 
                        className="absolute inset-0 h-full w-full object-cover" 
                      />
                    </div>

                    {/* --- BACK FACE (OPEN/EXPANDED STATE) --- */}
                    <div 
                      className="absolute inset-0 flex flex-col overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_4px_24px_rgb(0,0,0,0.06)] scale-[1.01]"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)' // Flipped inherently so it faces backward
                      }}
                    >
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-6 inline-flex items-center justify-center text-[#4352ff]">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <h3 className="mb-4 pr-2 text-[22px] font-semibold leading-[1.3] tracking-tight text-[#111]">
                          {feature.title}
                        </h3>
                        <p className="text-[15px] font-medium leading-relaxed text-[#333]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          </div>
        </div>
    </section>
  )
}