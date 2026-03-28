'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

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
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-wide flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl font-bold tracking-tight text-[#1e1e1e]">
            call<span className="font-extrabold">Mind</span>
          </span>
          <span className="text-[10px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded-md ml-0.5 uppercase tracking-wider">
            AI
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#1e1e1e]"
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
            className="text-sm font-medium text-gray-600 transition-colors hover:text-[#1e1e1e]"
          >
            Sign in
          </Link>
          <Link
            href={`${DASHBOARD_URL}/signup`}
            className="btn-blue px-5 py-2.5 text-sm"
          >
            Book a Meeting
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:text-[#1e1e1e] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="bg-white border-t border-gray-100 px-4 py-4 md:hidden shadow-lg">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#1e1e1e]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <Link
              href={`${DASHBOARD_URL}/login`}
              className="block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#1e1e1e]"
            >
              Sign in
            </Link>
            <Link
              href={`${DASHBOARD_URL}/signup`}
              className="block btn-blue px-3 py-2.5 text-center text-sm"
            >
              Book a Meeting
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}