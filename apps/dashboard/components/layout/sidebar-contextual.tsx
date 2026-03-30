'use client'

import React from 'react'
import { cn } from '@aicaller/ui/lib/utils'
import { ScrollArea, Separator } from '@aicaller/ui'

interface SidebarContextualProps {
  title: string
  children: React.ReactNode
  collapsed: boolean
}

/**
 * Contextual Sidebar (Professional / Midnight Optimized)
 * 
 * Target Background: #12151D (Middle Step)
 * Target Border: border-border/40
 */
export function SidebarContextual({ title, children, collapsed }: SidebarContextualProps) {
  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border/40 transition-all duration-300 ease-in-out z-20 shadow-sm",
        collapsed ? "w-0 overflow-hidden" : "w-[var(--sidebar-sub-width)]"
      )}
      style={{ backgroundColor: 'hsla(var(--background) / 0.5)' }}
    >
      <div className={cn("flex h-[var(--header-height)] items-center px-6 shrink-0", collapsed && "hidden")}>
        <h2 className="text-[14px] font-bold text-foreground truncate tracking-tight opacity-90">{title}</h2>
      </div>

      <Separator className={cn("bg-border/20 mx-6 w-auto", collapsed && "hidden")} />

      <ScrollArea className={cn("flex-1", collapsed && "hidden")}>
        <div className="p-4 flex flex-col gap-5">
          {children}
        </div>
      </ScrollArea>
    </aside>
  )
}
