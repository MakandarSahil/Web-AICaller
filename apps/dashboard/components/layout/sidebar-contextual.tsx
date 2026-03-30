'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { ScrollArea, Separator } from '@aicaller/ui'

interface SidebarContextualProps {
  title: string
  children: React.ReactNode
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

/**
 * Contextual Sidebar (Professional / Midnight Optimized)
 * 
 * Target Background: #12151D (Middle Step)
 * Target Border: border-border/40
 */
export function SidebarContextual({ title, children, collapsed, setCollapsed }: SidebarContextualProps) {
  return (
    <>
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

      {/* Collapse Toggle Handle - At contextual sidebar right edge */}
      {/* Small screens: position on the right, avoiding collision */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed top-3.5 z-50 h-8 w-8 flex items-center justify-center rounded-full border border-border/60 bg-card shadow-md transition-all hover:scale-110 hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg",
          "flex sm:flex md:hidden lg:hidden",
          collapsed ? "rotate-180" : ""
        )}
        style={{
          right: '1.5rem'
        }}
        title={collapsed ? "Open sidebar" : "Close sidebar"}
      >
        <ChevronLeft size={16} className="text-foreground dark:text-white" />
      </button>

      {/* Medium screens: position after main sidebar, avoiding collision with main toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed top-3.5 z-50 h-8 w-8 flex items-center justify-center rounded-full border border-border/60 bg-card shadow-md transition-all hover:scale-110 hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg hidden md:flex lg:hidden",
          collapsed ? "rotate-180" : ""
        )}
        style={{
          left: collapsed ? 'calc(var(--sidebar-main-width) + 12px)' : 'calc(var(--sidebar-main-width) + var(--sidebar-sub-width) - 16px)'
        }}
        title={collapsed ? "Open sidebar" : "Close sidebar"}
      >
        <ChevronLeft size={16} className="text-foreground dark:text-white" />
      </button>

      {/* Desktop Toggle Button - Large screens with proper positioning */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed top-3.5 z-50 h-8 w-8 flex items-center justify-center rounded-full border border-border/60 bg-card shadow-md transition-all hover:scale-110 hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg hidden lg:flex",
          collapsed ? "rotate-180" : ""
        )}
        style={{
          left: collapsed ? 'calc(var(--sidebar-main-width) + 8px)' : 'calc(var(--sidebar-main-width) + var(--sidebar-sub-width) - 16px)'
        }}
        title={collapsed ? "Open sidebar" : "Close sidebar"}
      >
        <ChevronLeft size={16} className="text-foreground dark:text-white" />
      </button>
    </>
  )
}
