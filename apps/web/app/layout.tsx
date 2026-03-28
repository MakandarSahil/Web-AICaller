import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'CallMind — AI Voice Agents for Your Business',
    template: '%s | CallMind',
  },
  description:
    'Configure an AI agent with your knowledge base, get a phone number, and let it answer calls and queries intelligently — in minutes, not months.',
  keywords: [
    'AI voice agent',
    'AI phone calls',
    'voice AI',
    'call automation',
    'AI customer support',
    'knowledge base AI',
  ],
  authors: [{ name: 'CallMind' }],
  creator: 'CallMind',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://callmind.ai'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://callmind.ai',
    title: 'CallMind — AI Voice Agents for Your Business',
    description:
      'Configure an AI agent with your knowledge base, get a phone number, and let it answer calls intelligently.',
    siteName: 'CallMind',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallMind — AI Voice Agents for Your Business',
    description:
      'Configure an AI agent with your knowledge base, get a phone number, and let it answer calls intelligently.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans text-[#1e1e1e] antialiased">
        {children}
      </body>
    </html>
  )
}