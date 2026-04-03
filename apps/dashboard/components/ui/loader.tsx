'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: number | string
}

/**
 * Modern, smooth loading spinner using Lucide's Loader2.
 * Consistent with the dashboard's primary brand color.
 */
export function LoadingSpinner({ className, size = 20 }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 
        size={size} 
        className="animate-spin text-primary opacity-60" 
      />
    </div>
  )
}

/**
 * Full-screen center loader for larger sections.
 */
export function LoadingCenter({ className }: { className?: string }) {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4", className)}>
      <LoadingSpinner size={32} />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 ml-2">
        Synchronizing...
      </p>
    </div>
  )
}
