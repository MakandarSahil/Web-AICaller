'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronUp, Mic } from 'lucide-react'
import { Button, Input, Label, DottedNumber } from '@aicaller/ui'
import { motion, AnimatePresence, type Transition } from 'framer-motion'

const CALL_TYPES = [
  'Receptionist',
  'Appointment Setter',
  'Lead Qualification',
  'Survey',
  'Customer Service',
  'Debt Collection',
]

const fadeTransition: Transition = {
  duration: 0.12,
  ease: 'easeInOut',
}

export function Demo() {
  const [selectedType, setSelectedType] = useState('Appointment Setter')
  const [step, setStep] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="demo" className="relative w-full bg-[#0a1128] py-12 lg:py-20 overflow-hidden">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-normal leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Try Our<br />Live Demo
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-md pb-1 text-xs font-light leading-relaxed text-slate-300 md:text-sm"
          >
            Receive a live call from our agent and discover how our AI caller transforms
            customer conversations.
          </motion.div>
        </div>

        {/* Cards */}
        <div className="relative z-10 mx-auto mt-8 flex w-full flex-col gap-3 lg:mt-12 lg:h-[400px] lg:flex-row lg:gap-4">

          {/* ── Card 1 ── */}
          <div
            onClick={() => step === 2 && setStep(1)}
            role={step === 2 && !isMobile ? 'button' : undefined}
            tabIndex={step === 2 && !isMobile ? 0 : undefined}
            onKeyDown={step === 2 && !isMobile ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStep(1) } } : undefined}
            className={`group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white
              [transition:flex_300ms_ease-in-out,box-shadow_300ms]
              hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)]
              ${isMobile
                ? step === 1
                  ? 'cursor-default'
                  : 'cursor-pointer'
                : step === 1
                  ? 'lg:flex-[2.5] lg:h-full'
                  : 'lg:flex-[0.4] lg:h-full cursor-pointer'
              }`}
          >
            <div className="relative z-20 flex h-full flex-col px-5 py-4 lg:px-8 lg:py-6">

              {/* ── Mobile: collapsed row (step 2) ── */}
              {isMobile && step === 2 ? (
                <div className="flex items-center gap-3">
                  <DottedNumber num="1" />
                  <p className="flex-1 text-[14px] font-bold leading-[1.2] tracking-tight text-[#0a1128]">
                    Select the type of call you want to receive
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStep(1) }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1128] text-white"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Desktop: collapsed label ── */}
                  {!isMobile && step === 2 ? (
                    <>
                      <div className="flex items-start">
                        <DottedNumber num="1" />
                      </div>
                      <div className="mt-auto">
                        <p className="max-w-[140px] text-[15px] font-bold leading-[1.2] tracking-tight text-[#0a1128]">
                          Select the type of call you want to receive
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <DottedNumber num="1" />
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="step1-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={fadeTransition}
                          className="flex flex-1 flex-col"
                        >
                          <div className="flex flex-1 flex-col">
                            <div className="mt-4 lg:mt-auto flex w-full flex-col">
                              <h3 className="mb-4 text-[17px] font-bold leading-tight tracking-tight text-[#0a1128] sm:text-[20px] lg:max-w-[320px] lg:text-[22px]">
                                Select the type of call you want to receive
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {CALL_TYPES.map((type) => (
                                  <button
                                    type="button"
                                    key={type}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedType(type)
                                    }}
                                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all focus:outline-none ${
                                      selectedType === type
                                        ? 'border-[#0a1128] bg-[#0a1128] text-white shadow-md'
                                        : 'border-slate-200 bg-white text-blue-600 hover:border-slate-300 hover:text-blue-700'
                                    }`}
                                  >
                                    {selectedType === type && <Mic className="h-3 w-3" />}
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="mt-6 flex justify-end lg:mt-auto lg:pt-4">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setStep(2)
                                }}
                                className="h-[44px] w-full rounded-xl bg-[#0a1128] px-6 text-[13px] font-bold text-white transition-all hover:bg-[#142042] active:scale-95 shadow-sm lg:h-[32px] lg:w-auto lg:rounded-md lg:text-[11px]"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Glow orb */}
            <div className={`pointer-events-none absolute right-[-5%] top-1/2 h-[280px] w-[280px] -translate-y-1/2 transition-opacity duration-300 lg:h-[400px] lg:w-[400px] ${step === 2 ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1]/60 via-[#a855f7]/70 to-[#ec4899]/60 blur-[60px]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-full bg-gradient-to-t from-white/60 to-transparent blur-3xl" />
            </div>
          </div>

          {/* ── Card 2 ── */}
          <div
            onClick={() => !isMobile && step === 1 && setStep(2)}
            role={step === 1 && !isMobile ? 'button' : undefined}
            tabIndex={step === 1 && !isMobile ? 0 : undefined}
            onKeyDown={step === 1 && !isMobile ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStep(2) } } : undefined}
            className={`group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white
              [transition:flex_300ms_ease-in-out,box-shadow_300ms]
              hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)]
              ${isMobile
                ? 'cursor-default'
                : step === 2
                  ? 'lg:flex-[2.5] lg:h-full'
                  : 'lg:flex-[0.4] lg:h-full cursor-pointer'
              }`}
          >
            <div className="relative z-20 flex h-full flex-col px-5 py-4 lg:px-8 lg:py-6">

              {/* ── Mobile: collapsed row (step 1) ── */}
              {isMobile && step === 1 ? (
                <div className="flex items-center gap-3">
                  <DottedNumber num="2" />
                  <p className="flex-1 text-[14px] font-bold leading-[1.2] tracking-tight text-[#0a1128]">
                    Enter your information
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStep(2) }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1128] text-white"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <DottedNumber num="2" />
                    {/* Desktop back */}
                    {!isMobile && step === 2 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setStep(1) }}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-[#0a1128] transition-colors"
                      >
                        <ChevronUp className="h-3 w-3" />
                        Back
                      </button>
                    )}
                  </div>

                  {/* Desktop collapsed label */}
                  {!isMobile && step === 1 && (
                    <div className="mt-auto">
                      <p className="max-w-[140px] text-[15px] font-bold leading-[1.2] tracking-tight text-[#0a1128]">
                        Enter your information
                      </p>
                    </div>
                  )}

                  {/* Expanded content (mobile step 2 + desktop step 2) */}
                  {step === 2 && (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key="step2-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={fadeTransition}
                        className="flex flex-1 flex-col"
                      >
                        <div className="flex flex-1 flex-col">

                          {/* Desktop two-col layout */}
                          <div className="hidden lg:flex w-full flex-col justify-center gap-4 pb-1 xl:flex-row xl:items-start xl:gap-14">
                            <div className="w-full xl:w-[35%]">
                              <h3 className="text-[18px] font-bold leading-tight tracking-tight text-[#0a1128] sm:text-[22px]">
                                Enter your<br />information
                              </h3>
                            </div>
                            <div className="w-full xl:w-[65%]">
                              <form className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                {[
                                  { label: 'Industry', content: <div className="flex items-center justify-between border-b border-slate-100 py-0.5 text-[12px] font-medium text-slate-900"><span>{selectedType}</span><ChevronDown className="h-2.5 w-2.5 text-slate-300" /></div> },
                                  { label: 'Name', content: <Input type="text" placeholder="Your Name" className="h-auto w-full rounded-none border-0 border-b border-slate-100 bg-transparent px-0 py-0.5 text-[12px] font-medium text-slate-900 shadow-none placeholder:text-slate-200 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" /> },
                                  { label: 'Phone', content: <Input type="tel" placeholder="+15551234567" className="h-auto w-full rounded-none border-0 border-b border-slate-100 bg-transparent px-0 py-0.5 text-[12px] font-medium text-slate-900 shadow-none placeholder:text-slate-200 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" /> },
                                  { label: 'Email', content: <Input type="email" placeholder="john@company.com" className="h-auto w-full rounded-none border-0 border-b border-slate-100 bg-transparent px-0 py-0.5 text-[12px] font-medium text-slate-900 shadow-none placeholder:text-slate-200 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" /> },
                                ].map(({ label, content }) => (
                                  <div key={label} className="space-y-0.5">
                                    <Label className="text-[8px] font-bold uppercase tracking-wider text-slate-300">{label}</Label>
                                    {content}
                                  </div>
                                ))}
                              </form>
                            </div>
                          </div>

                          {/* Mobile form */}
                          <div className="lg:hidden flex flex-col gap-5 mt-3">
                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Industry</Label>
                              <div className="flex items-center justify-between border-b border-slate-200 py-2.5 text-[14px] font-medium text-slate-900">
                                <span>{selectedType}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Name</Label>
                              <Input type="text" placeholder="Your Name" className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[14px] font-medium text-slate-900 shadow-none placeholder:text-slate-300 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Phone Number</Label>
                              <Input type="tel" placeholder="+15551234567" className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[14px] font-medium text-slate-900 shadow-none placeholder:text-slate-300 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email</Label>
                              <Input type="email" placeholder="john@company.com" className="h-auto w-full rounded-none border-0 border-b border-slate-200 bg-transparent px-0 py-2.5 text-[14px] font-medium text-slate-900 shadow-none placeholder:text-slate-300 outline-none transition-all focus-visible:border-[#0a1128] focus-visible:ring-0" />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 flex flex-col-reverse gap-2 lg:mt-auto lg:flex-row lg:items-center lg:justify-between lg:py-4 lg:gap-0">
                            <Button
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); setStep(1) }}
                              className="flex h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 text-[13px] font-bold text-[#0a1128] hover:bg-slate-50 lg:h-[28px] lg:w-auto lg:rounded-none lg:border-0 lg:text-[11px] lg:hover:bg-transparent lg:p-0"
                            >
                              <ChevronLeft className="h-3 w-3" />
                              Back to Agent
                            </Button>
                            <Button className="h-[44px] w-full rounded-xl bg-[#0a1128] px-6 text-[13px] font-bold text-white transition-all hover:bg-[#142042] active:scale-95 shadow-sm lg:h-[32px] lg:w-auto lg:rounded-md lg:text-[11px]">
                              Get a call
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}