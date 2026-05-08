'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

export default function ConversationsLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen font-sans overflow-hidden">
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="h-4 w-px bg-border/40" />
          <Skeleton className="h-3 w-28 rounded-md" />
        </div>

        <Skeleton className="h-10 w-64 rounded-xl" />
      </header>

      <div className="px-10 py-4 border-b border-border/10 bg-muted/5 flex items-center gap-4">
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="flex-1 overflow-hidden px-10 py-10 pb-40 space-y-10">
        <div className="rounded-xl border border-border/40 overflow-hidden bg-muted/5 shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[960px]">
              <div className="grid grid-cols-6 gap-4 border-b border-border/40 bg-muted/10 px-8 py-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="h-3 w-full max-w-28 rounded-md opacity-50" />
                ))}
              </div>
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="grid grid-cols-6 gap-4 px-8 py-6 border-b border-border/20">
                  {[1, 2, 3, 4, 5, 6].map((cell) => (
                    <Skeleton key={cell} className="h-6 w-full rounded-md" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Skeleton className="h-10 w-56 rounded-xl opacity-60" />
        </div>
      </div>
    </div>
  )
}