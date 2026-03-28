'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@aicaller/supabase/client'
import type { Database } from '@aicaller/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
import { Phone, Bot, Book, MessageSquare, Key, Settings, LogOut, Menu, X, BarChart3 } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/knowledge-bases', label: 'Knowledge Bases', icon: Book },
  { href: '/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/phone-numbers', label: 'Phone Numbers', icon: Phone },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function HeaderUserName() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false
    void (async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error || !user || cancelled) return
      const { data: profileRaw } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (cancelled) return
      const profile = profileRaw as ProfileRow | null
      const display =
        profile?.full_name?.trim() ||
        (user.user_metadata?.full_name as string | undefined)?.trim() ||
        user.email?.split('@')[0] ||
        'Account'
      setName(display)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!name) {
    return <span className="text-sm text-slate-500">…</span>
  }

  return (
    <span className="truncate text-sm font-medium text-slate-200" title={name}>
      {name}
    </span>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8f9fb] text-gray-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-900"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 text-sm font-medium text-gray-700">
            <HeaderUserName />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform md:relative md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center gap-1.5" onClick={onClose}>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              call<span className="font-extrabold">Mind</span>
            </span>
            <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600">
              AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-brand-600' : 'text-gray-400'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              handleLogout()
              onClose()
            }}
            className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut size={18} className="text-gray-400" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
