import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'
import { Footer as UIFooter } from '@/components/ui/footer'
import { Github } from 'lucide-react'

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.callmind.ai'

export function Footer() {
  return (
    <>
      <section className="relative bg-[#3655E8] py-20 px-4 sm:px-6 lg:px-8">
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
      </section>

      <UIFooter
        logo={
          <div className="flex items-center gap-1 group">
            <span className="text-xl font-bold tracking-tight text-[#1e1e1e]">
              call<span className="font-extrabold">Mind</span>
            </span>
            <span className="text-[10px] font-bold text-brand bg-brand-50 px-1.5 py-0.5 rounded-md ml-0.5 uppercase tracking-wider">
              AI
            </span>
          </div>
        }
        socialLinks={[
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/callmind",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/about", label: "About Us" },
          { href: "#features", label: "Features" },
          { href: "#pricing", label: "Pricing" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]}
        copyright={{
          text: "© 2025 CallMind AI",
          license: "All rights reserved.",
        }}
      />
    </>
  )
}