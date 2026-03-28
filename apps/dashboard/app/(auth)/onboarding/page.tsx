'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@aicaller/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [size, setSize] = useState('sm')
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

      // TODO: Uncomment after database types are generated
      // const { error: updateError } = await supabase
      //   .from('workspaces')
      //   .update({
      //     business_name: businessName,
      //     industry,
      //     size,
      //   })
      //   .eq('owner_id', data.user.id)
      // if (updateError) throw updateError

      // For now, just redirect on success
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Onboarding failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Welcome to CallMind</h2>
          <p className="mt-2 text-center text-sm text-slate-400">Tell us about your business</p>
        </div>

        <form onSubmit={handleOnboarding} className="space-y-6">
          {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-200">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Acme Corp"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g., Technology, Retail, Healthcare"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Company Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="xs">1-10 employees</option>
              <option value="sm">11-50 employees</option>
              <option value="md">51-200 employees</option>
              <option value="lg">201-500 employees</option>
              <option value="xl">500+ employees</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  )
}
