'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Mic } from 'lucide-react'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/[0.06] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-wide flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 ring-1 ring-brand-500/30 transition-all group-hover:bg-brand-500/30 group-hover:ring-brand-500/50">
            <Mic className="h-4 w-4 text-brand-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-content">
            Call<span className="text-brand-400">Mind</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-content-secondary transition-colors hover:text-content"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={`${DASHBOARD_URL}/login`}
            className="text-sm text-content-secondary transition-colors hover:text-content"
          >
            Sign in
          </Link>
          <Link
            href={`${DASHBOARD_URL}/signup`}
            className="btn-glow rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-glow-sm transition-all hover:bg-brand-600 hover:shadow-glow"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-content-secondary transition-colors hover:text-content md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="glass border-t border-white/[0.06] px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-content"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            <Link
              href={`${DASHBOARD_URL}/login`}
              className="block rounded-lg px-3 py-2.5 text-center text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-content"
            >
              Sign in
            </Link>
            <Link
              href={`${DASHBOARD_URL}/signup`}
              className="block rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}