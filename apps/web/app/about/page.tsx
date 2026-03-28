import { Navbar } from '@/components/layouts/Navbar'
import { Footer } from '@/components/layouts/Footer'
import { About } from '@/components/sections/About'

export const metadata = {
  title: 'About - CallMind',
  description: 'Learn more about CallMind and how we revolutionize AI voice agents.',
}

export default function AboutPage() {
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
                About CallMind
              </h1>
              <p className="mt-4 text-lg text-content-secondary">
                Revolutionizing how businesses engage with customers through AI.
              </p>
            </div>
          </section>

          {/* About section */}
          <About />
        </div>
      </main>
      <Footer />
    </>
  )
}
