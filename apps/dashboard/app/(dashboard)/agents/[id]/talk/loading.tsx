'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

export default function AgentTalkLoading() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 w-full">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-lg rounded-md" />
            </div>
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <Skeleton className="h-3 w-24 rounded-md" />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Skeleton className="h-10 w-full max-w-xl rounded-md" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="rounded-xl border border-border p-4 space-y-3">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-40 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </section>
      </div>
    </div>
  )
}
