'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'

interface MobileNavBackProps {
  href: string
  label: string
  className?: string
}

/**
 * A minimalist back button for mobile views to return to the list/index.
 */
export function MobileNavBack({ href, label, className }: MobileNavBackProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        "md:hidden -ml-2 mb-4 h-9 gap-1 text-muted-foreground hover:text-foreground transition-colors font-bold text-[11px] uppercase tracking-widest",
        className
      )}
    >
      <Link href={href}>
        <ChevronLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}
