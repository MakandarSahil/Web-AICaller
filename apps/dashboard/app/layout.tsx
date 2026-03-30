import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'
import { Geist } from 'next/font/google'

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}