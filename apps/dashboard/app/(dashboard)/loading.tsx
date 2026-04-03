'use client'

import React from 'react'
import { Skeleton } from '@aicaller/ui'

/**
 * Dashboard-wide Loading Skeleton.
 * Provides a high-fidelity shimmer effect that mirrors the two-row header 
 * pattern used in Agents and Knowledge Base detail pages.
 */
export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
      
      {/* 1. Detail Header Skeleton (Two-Row) */}
      <header className="px-4 md:px-10 border-b border-border bg-background sticky top-0 z-50 h-auto md:h-28 shrink-0">
        
        {/* Top Row: Info & Actions */}
        <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            {/* Back button skeleton */}
            <Skeleton className="h-8 w-24 rounded-lg md:hidden" />
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32 md:w-48 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-md hidden md:block" />
               </div>
               <Skeleton className="h-3 w-32 rounded-md opacity-50" />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
             <Skeleton className="h-10 w-24 rounded-xl" />
             <div className="h-6 w-[1px] bg-border/50 mx-1 hidden md:block" />
             <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Bottom Row: Tab Navigation Skeleton */}
        <div className="flex items-center gap-6 h-12 px-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 px-2">
                <Skeleton className="h-3.5 w-3.5 rounded-full opacity-50" />
                <Skeleton className="h-3 w-16 rounded-md opacity-30" />
              </div>
            ))}
        </div>
      </header>

      {/* 2. Content Area Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-12 space-y-12">
            
            {/* Section 1: Overview */}
            <div className="space-y-6">
                <Skeleton className="h-4 w-32 rounded-lg opacity-40" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-[24px] border border-border/50 bg-muted/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-4 w-24 rounded-md" />
                            </div>
                            <Skeleton className="h-20 w-full rounded-2xl opacity-30" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Details */}
            <div className="space-y-6">
                <Skeleton className="h-4 w-40 rounded-lg opacity-40 ml-1" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-8 rounded-[32px] border border-border/40 bg-muted/5 space-y-6">
                            <div className="flex flex-col gap-3">
                                <Skeleton className="h-5 w-1/4 rounded-lg" />
                                <Skeleton className="h-3 w-3/4 rounded-md opacity-50" />
                            </div>
                            <Skeleton className="h-40 w-full rounded-[24px] opacity-20" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}
