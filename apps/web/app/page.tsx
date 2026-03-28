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
      <main>
        <Hero />
        <HowItWorks />
        <Demo />
        <Features />
        <Pricing />
        <About />
      </main>
      <Footer />
    </>
  )
}