'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

export default function AgentChatLoading() {
  return (
    <div className="h-dvh bg-background">
      <div className="mx-auto flex h-full max-w-7xl">
        <main className="relative flex min-w-0 flex-1 flex-col border-x border-border/60 bg-background">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 px-3 py-2 backdrop-blur sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md opacity-60" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-3 pb-36 pt-4 sm:px-5 sm:pt-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex w-full ${i % 2 ? 'justify-start' : 'justify-end'}`}>
                  <Skeleton className={`h-16 rounded-2xl ${i % 2 ? 'w-72' : 'w-64'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur sm:px-5">
            <div className="mx-auto w-full max-w-3xl space-y-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-3 w-48 rounded-md opacity-60" />
            </div>
          </div>
        </main>

        <aside className="hidden lg:block w-80 border-l border-border bg-background p-4">
          <Skeleton className="h-4 w-36 rounded-md mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border/70 p-3 space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md opacity-60" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
