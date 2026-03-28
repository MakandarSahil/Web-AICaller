import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Feature'
import { Demo } from '@/components/sections/Demo'
import { Pricing } from '@/components/sections/Pricing'
import { About } from '@/components/sections/About'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Global background orbs — sit behind all sections */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="orb orb-emerald absolute -left-64 -top-64 h-[600px] w-[600px] opacity-30" />
          <div className="orb orb-green-dim absolute -right-64 top-1/3 h-[500px] w-[500px] opacity-20" />
          <div className="orb orb-emerald absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 opacity-10" />
        </div>

        <div className="relative z-10">
          <Hero />
          <HowItWorks />
          <Features />
          <Demo />
          <Pricing />
          <About />
        </div>
      </main>
      <Footer />
    </>
  )
}