import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'
import { Pricing } from '@/components/sections/Pricing'

export const metadata = {
  title: 'Pricing - CallMind',
  description: 'Simple, transparent pricing. Scale with your business.',
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
    </>
  )
}

