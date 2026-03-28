import Link from 'next/link'
import { Mic, Github, Twitter, Linkedin } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#060e07]">
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="container-wide px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 ring-1 ring-brand-500/30">
                <Mic className="h-4 w-4 text-brand-400" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Call<span className="text-brand-400">Mind</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-content-secondary">
              AI voice agents that answer calls intelligently. Configure once,
              deploy in minutes.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-content-secondary transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-content-tertiary">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-content-secondary transition-colors hover:text-content"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-content-tertiary">
            © {new Date().getFullYear()} CallMind. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-content-tertiary">
            <span>Built with</span>
            <span className="text-brand-500">♥</span>
            <span>for businesses everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}