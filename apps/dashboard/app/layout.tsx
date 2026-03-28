import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'CallMind Dashboard',
    template: '%s | CallMind',
  },
  description: 'Manage your AI voice agents, knowledge bases, and conversations.',
  robots: { index: false, follow: false }, // dashboard is private
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans ${geist.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}