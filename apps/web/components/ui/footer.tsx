import { Button } from "@aicaller/ui"
import React from "react"

interface FooterProps {
  logo?: React.ReactNode
  brandName?: React.ReactNode
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-6 pt-8 lg:pb-8 lg:pt-12 bg-white">
      <div className="px-4 lg:px-8 mx-auto max-w-screen-xl">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2 text-primary hover:opacity-90 transition-opacity"
            aria-label="Home"
          >
            {logo}
            {brandName && <span className="font-bold text-xl text-neutral-900">{brandName}</span>}
          </a>
          <ul className="flex list-none mt-4 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-secondary/50 text-neutral-600 hover:text-neutral-900 hover:bg-secondary"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500 whitespace-nowrap">
            <span>{copyright.text}</span>
            {copyright.license && <span>{copyright.license}</span>}
          </div>
          
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 list-none">
            {mainLinks.map((link, i) => (
              <li key={`main-${i}`}>
                <a
                  href={link.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {legalLinks.map((link, i) => (
              <li key={`legal-${i}`}>
                <a
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-neutral-800 hover:underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
