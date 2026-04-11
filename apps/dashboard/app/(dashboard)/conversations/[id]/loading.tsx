'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

export default function ConversationDetailLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen font-sans overflow-hidden">
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md opacity-50" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-10 py-12 pb-40 border-r border-border/40 space-y-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="p-8 rounded-[32px] border border-border/40 bg-muted/10 space-y-4">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>

            <Skeleton className="h-4 w-48 rounded-md" />
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={`flex gap-6 ${item % 2 ? '' : 'flex-row-reverse'}`}>
                  <Skeleton className="h-10 w-10 rounded-2xl" />
                  <Skeleton className="h-16 w-full max-w-[70%] rounded-[28px]" />
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="w-80 overflow-hidden flex flex-col shrink-0 bg-muted/5 p-8 space-y-8">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-44 w-full rounded-[32px]" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-6 w-full rounded-md" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}