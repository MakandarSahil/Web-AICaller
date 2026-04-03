'use client'

import React, { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@aicaller/ui'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error Segment:', error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">Something went wrong</h1>
          <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium">
            An unexpected error occurred while loading this page. 
            {error.message && (
              <span className="block mt-2 font-mono text-[10px] opacity-50 bg-muted p-2 rounded-lg truncate max-w-sm mx-auto">
                {error.message}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold text-[12px] uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold text-[12px] uppercase tracking-widest gap-2 border-border/60 hover:bg-muted transition-all active:scale-95"
          >
            <Link href="/agents">
              <Home className="h-4 w-4" />
              Head Home
            </Link>
          </Button>
        </div>

        <div className="pt-8 opacity-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Error System v1.0 • CallMind</p>
        </div>
      </div>
    </div>
  )
}
