import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'
import { Demo } from '@/components/sections/Demo'

export const metadata = {
  title: 'Live Demo - CallMind',
  description: 'Try our AI agent demo. Call to experience CallMind in action.',
}

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Global background orbs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="orb orb-emerald absolute -left-64 -top-64 h-[600px] w-[600px] opacity-30" />
          <div className="orb orb-green-dim absolute -right-64 top-1/3 h-[500px] w-[500px] opacity-20" />
          <div className="orb orb-emerald absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 opacity-10" />
        </div>

        <div className="relative z-10">
          {/* Page intro */}
          <section className="section pt-32 pb-8 lg:pt-40">
            <div className="container-tight text-center">
              <h1 className="text-4xl font-bold tracking-tight text-content sm:text-5xl">
                Try CallMind Now
              </h1>
              <p className="mt-4 text-lg text-content-secondary">
                Experience our AI agent firsthand. No signup required.
              </p>
            </div>
          </section>

          {/* Demo section */}
          <Demo />
        </div>
      </main>
      <Footer />
    </>
  )
}
