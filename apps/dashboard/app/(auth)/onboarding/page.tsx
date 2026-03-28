'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@aicaller/supabase/client'
import { Loader2, Building2, Briefcase, Users, ArrowRight, Sparkles } from 'lucide-react'

import { Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, cn } from '@aicaller/ui'

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'E-commerce',
  'Finance',
  'Education',
  'Real Estate',
  'Hospitality',
  'Retail',
  'Other',
]

const SIZES = [
  { value: 'xs', label: '1–10', desc: 'Solo / Startup' },
  { value: 'sm', label: '11–50', desc: 'Small team' },
  { value: 'md', label: '51–200', desc: 'Growing' },
  { value: 'lg', label: '201–500', desc: 'Mid-market' },
  { value: 'xl', label: '500+', desc: 'Enterprise' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [size, setSize] = useState('sm')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user?.id) throw new Error('Not authenticated')

      const { error: updateError } = await supabase
        .from('workspaces')
        // @ts-expect-error — supabase-js v2 types narrow .update() to 'never' here
        .update({
          business_name: businessName,
          industry,
          size: size as 'xs' | 'sm' | 'md' | 'lg' | 'xl',
          website: website || null,
        })
        .eq('owner_id', data.user.id)

      if (updateError) throw updateError
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Setup failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-brand-50/30 px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
            <Sparkles className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome to CallMind
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell us about your business so we can customize your experience
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleOnboarding} className="space-y-5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <Label htmlFor="biz-name" className="text-gray-700">Business Name</Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                id="biz-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Corp"
                required
                className="pl-10"
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-1.5 ">
            <Label htmlFor="biz-industry" className="text-gray-700">Industry</Label>
            <div className="relative">
              <Select value={industry} onValueChange={setIndustry} required>
                <div className="relative w-full">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                  <SelectTrigger id="biz-industry" className="w-full pl-10" aria-label="Industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind.toLowerCase()}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company Size — chip selector */}
          <div className="space-y-1.5">
            <Label className="flex items-center text-gray-700">
              <Users className="mr-1 inline-block h-4 w-4 text-gray-400" />
              Company Size
            </Label>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border py-3 text-center transition-all",
                    size === s.value
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="text-sm font-semibold">{s.label}</span>
                  <span className="mt-0.5 text-[10px] text-gray-400">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Website (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="biz-website" className="text-gray-700">
              Website <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="biz-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !businessName.trim() || !industry}
            className="w-full h-12 rounded-xl text-sm font-semibold relative mt-4"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Skip */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mx-auto block text-xs font-medium text-gray-400 transition-colors hover:text-gray-500"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
