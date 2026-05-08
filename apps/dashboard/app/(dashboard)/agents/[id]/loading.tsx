'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

export default function AgentDetailLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
      <header className="px-4 md:px-10 border-b border-border bg-background sticky top-0 z-50 shrink-0">
        <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-3 w-40 rounded-md opacity-50" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
        <div className="flex items-center gap-6 h-12 px-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 px-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full opacity-50" />
              <Skeleton className="h-3 w-16 rounded-md opacity-30" />
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-10 space-y-8">
          <Skeleton className="h-4 w-40 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border/40 p-6 space-y-4 bg-muted/5">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-3 w-4/5 rounded-md opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
