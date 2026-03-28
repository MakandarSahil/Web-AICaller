'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import { Button, Input, Label } from '@aicaller/ui'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const CALL_TYPES = [
  'Receptionist',
  'Appointment Setter',
  'Lead Qualification',
  'Customer Service',
  'Debt Collection',
  'Survey',
]

// Pure solid dotted text effect without stroke outline
const DottedNumber = ({ num }: { num: string | number }) => (
  <div
    className={`${playfair.className} mb-2 text-[80px] font-black leading-none tracking-tighter sm:text-[100px]`}
    style={{
      color: 'transparent',
      backgroundImage: 'radial-gradient(circle, #0a1128 3.5px, transparent 4px)',
      backgroundSize: '12px 12px',
      backgroundPosition: 'left top',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text'
    }}
  >
    {num}
  </div>
)

export function Demo() {
  const [selectedType, setSelectedType] = useState('Appointment Setter')
  const [step, setStep] = useState(1)

  return (
    // Make section full width and seamless
    <section id="demo" className="relative w-full bg-[#0a1128] py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Header area */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <h2 className={`${playfair.className} text-6xl font-normal leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl`}>
            Try Our<br />Live Demo
          </h2>
          <div className="max-w-md pb-4 text-base font-light leading-relaxed text-slate-300 md:text-lg">
            Receive a live call from our agent and discover how our AI caller transforms
            customer conversations.
          </div>
        </div>

        {/* Flex layout for Cards */}
        <div className="relative z-10 mx-auto mt-16 flex min-h-[580px] w-full max-w-7xl flex-col gap-6 lg:flex-row">

          {/* Card 1: Selection Map */}
          <div
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.08)] md:p-12 lg:p-14"
            style={{ flex: step === 1 ? '1.4' : '1' }}
          >
            <div className="relative z-20">
              <DottedNumber num="1" />
            </div>

            {/* Step Animations Wrapper */}
            <div className="relative z-10 flex flex-1 flex-col">

              {/* Step 1 Content */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${step === 1 ? 'z-10 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Blank space to push content down mirroring the reference */}
                <div className="mt-auto flex w-full flex-col font-light">
                  <h3 className="mb-8 max-w-[320px] text-[28px] leading-[1.2] tracking-tight text-[#0a1128] sm:text-[34px]">
                    Select the type of call you want to receive
                  </h3>

                  <div className="flex flex-wrap gap-2.5 sm:gap-3 lg:max-w-[85%]">
                    {CALL_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-[14px] ${selectedType === type
                            ? 'border-[#0a1128] bg-[#0a1128] text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-900'
                          }`}
                      >
                        {selectedType === type && <span className="mr-2 inline-block h-[5px] w-[5px] rounded-full bg-white opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specifically anchored Next button */}
                <div className="absolute bottom-0 right-0">
                  <Button
                    onClick={() => setStep(2)}
                    className="h-auto rounded-lg bg-[#0a1128] px-8 py-3 text-[14px] font-semibold text-white transition-all duration-700 ease-in-out hover:bg-[#142042] active:scale-95"
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Step 2 Content */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-[900ms] delay-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${step === 2 ? 'z-10 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="mt-auto">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Selected agent</p>
                  <h3 className="text-[26px] font-bold leading-[1.15] tracking-tight text-[#0a1128]">
                    {selectedType}
                  </h3>
                  <Button
                    variant="link"
                    onClick={() => setStep(1)}
                    className="mt-4 h-auto p-0 text-[12px] font-medium text-slate-400 underline-offset-2 hover:text-[#0a1128] hover:underline"
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>

            {/* Glowing animated orb - Contained on the right to avoid blocking text completely */}
            <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[350px] w-[350px] -translate-y-1/2 lg:h-[450px] lg:w-[450px]">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-brand/60 via-[#a855f7]/60 to-[#06b6d4]/60 blur-[60px] transition-opacity duration-1000 group-hover:opacity-80 md:blur-[80px]" />
              <div className="absolute inset-10 animate-float rounded-full bg-gradient-to-br from-[#0ea5e9]/50 to-[#c084fc]/50 blur-[60px]" />
            </div>
          </div>

          {/* Card 2: Form Display */}
          <div
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.08)] md:p-12 lg:p-14"
            style={{ flex: step === 1 ? '1' : '2' }}
          >
            <div className="relative z-20">
              <DottedNumber num="2" />
            </div>

            <div className="relative z-10 mt-6 flex-1">
              {/* Step 1 Content */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${step === 1 ? 'z-10 translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="mt-auto">
                  <h3 className="text-[28px] font-light leading-tight tracking-tight text-[#0a1128] sm:text-[34px]">
                    Enter your<br />information
                  </h3>
                </div>
              </div>

              {/* Step 2 Content */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-[900ms] delay-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${step === 2 ? 'z-10 translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-1 flex-col justify-center gap-10 md:flex-row lg:items-center lg:gap-16">
                  <div className="flex-[0.9]">
                    <h3 className="text-[28px] font-light leading-tight tracking-tight text-[#0a1128] sm:text-[34px]">
                      Enter your<br />information
                    </h3>
                  </div>

                  <div className="flex-[1.1]">
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Industry</Label>
                        <div className="flex cursor-not-allowed items-center justify-between border-b border-slate-200 py-2.5 text-[15px] font-medium text-slate-900" aria-disabled="true">
                          <span>{selectedType}</span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Name</Label>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[15px] font-medium text-slate-900 shadow-none placeholder:text-slate-400 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="+15551234567"
                          className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[15px] font-medium text-slate-900 shadow-none placeholder:text-slate-400 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</Label>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[15px] font-medium text-slate-900 shadow-none placeholder:text-slate-400 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0"
                        />
                      </div>
                    </form>
                  </div>
                </div>

                {/* Specifically anchored Bottom Control bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="group flex h-auto items-center gap-1 p-0 text-[13px] font-bold text-[#0a1128] transition-all duration-700 ease-in-out hover:bg-transparent hover:text-[#4352ff]"
                  >
                    <ChevronLeft className="h-4 w-4 transition-transform duration-700 ease-in-out group-hover:-translate-x-1" strokeWidth={3} />
                    Back to Agent
                  </Button>
                  <Button
                    className="h-auto rounded-lg bg-[#0a1128] px-8 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#142042] active:scale-95"
                  >
                    Get a call
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}