import Link from 'next/link'
import { Phone, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react'

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
    <footer className="relative">
      {/* CTA Section — Blue background */}
      <div className="bg-[#3655E8] py-20 px-4 sm:px-6 lg:px-8">
        <div className="container-tight text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to never miss
            <br />
            a call again?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Start free. Set up in under 10 minutes. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`${DASHBOARD_URL}/signup`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#3655E8] transition-all hover:bg-gray-100 hover:shadow-lg"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              Try a live call
            </a>
          </div>
        </div>
      </div>

      {/* Footer links — Floating white container on blue */}
      <div className="bg-[#3655E8] px-4 sm:px-6 lg:px-8 pb-8">
        <div className="container-wide">
          <div className="rounded-3xl bg-white px-8 py-12 sm:px-12 shadow-lg">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-16">
              {/* Brand column */}
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-1">
                  <span className="text-xl font-bold tracking-tight text-[#1e1e1e]">
                    call<span className="font-extrabold">Mind</span>
                  </span>
                  <span className="text-[10px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded-md ml-0.5 uppercase tracking-wider">
                    AI
                  </span>
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-brand/30 hover:bg-brand-50 hover:text-brand"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links columns */}
              {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                <div key={group}>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {group}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-500 transition-colors hover:text-[#1e1e1e]"
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
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} CallMind. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>Built with</span>
                <span className="text-red-500">♥</span>
                <span>for businesses everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}