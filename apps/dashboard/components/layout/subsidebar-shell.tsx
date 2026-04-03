'use client'

import React from 'react'
import { ScrollArea, Input } from '@aicaller/ui'
import { Search } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'

interface SubSidebarShellProps {
  headerTitle: React.ReactNode
  headerSubtitle?: React.ReactNode
  headerRight?: React.ReactNode
  /**
   * Optional block rendered between header and the standard controls area.
   */
  extraTop?: React.ReactNode
  createButton?: React.ReactNode
  searchPlaceholder: string
  searchQuery: string
  onSearchQueryChange: (next: string) => void
  children: React.ReactNode
  className?: string
  hideHeader?: boolean
}

export function SubSidebarShell({
  headerTitle,
  headerSubtitle,
  headerRight,
  extraTop,
  createButton,
  searchPlaceholder,
  searchQuery,
  onSearchQueryChange,
  children,
  className,
  hideHeader = false,
}: SubSidebarShellProps) {
  return (
    <div className={cn('flex flex-col h-full bg-sidebar-contextual-bg dark:bg-sidebar-contextual-bg', className)}>
      {!hideHeader && (
        <div className="h-16 px-6 flex items-center justify-between shrink-0 border-b border-border/50 bg-background/30 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-tight text-foreground">{headerTitle}</span>
            {headerSubtitle && (
              <div className="flex items-center gap-1.5 pt-0.5 opacity-40">{headerSubtitle}</div>
            )}
          </div>
          {headerRight}
        </div>
      )}

      {extraTop}

      <div className="p-4 space-y-4 shrink-0">
        {createButton}

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30 transition-colors group-focus-within:text-primary" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="h-9 pl-9 bg-background/50 border-border/50 text-[12px] font-medium rounded-xl transition-all focus:ring-1 focus:ring-primary/20 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px] placeholder:opacity-20"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-1 py-1">{children}</div>
      </ScrollArea>
    </div>
  )
}
