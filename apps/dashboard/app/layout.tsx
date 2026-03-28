import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CallMind Dashboard',
    template: '%s | CallMind',
  },
  description: 'Manage your AI voice agents, knowledge bases, and conversations.',
  robots: { index: false, follow: false }, // dashboard is private
}

export const viewport: Viewport = {
  themeColor: '#080f09',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#080f09] font-sans text-[#f0fdf4] antialiased">
        {children}
      </body>
    </html>
  )
}