'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { ScrollArea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Button } from '@aicaller/ui'
import { navigationGroups, isNavItemActive } from './dashboard-nav'
import { WorkspaceSwitcher } from './workspace-switcher'
import { UserNav } from './user-nav'

interface SidebarGlobalProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

/**
 * Global Sidebar (Professional / Retell AI Density)
 * 
 * 1. Normalized font weights: font-semibold -> font-bold/semibold.
 * 2. Background: #0e121b
 * 3. Softened group labels and active states.
 */
export function SidebarGlobal({ collapsed, setCollapsed }: SidebarGlobalProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border transition-all duration-300 ease-in-out z-30",
        collapsed ? "w-[var(--sidebar-main-collapsed-width)]" : "w-[var(--sidebar-main-width)]"
      )}
      style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
    >
      {/* 1. Header: Logo (Professional Weight) */}
      <div className={cn("flex h-[var(--header-height)] items-center px-6 shrink-0 transition-all", collapsed && "justify-center px-0")}>
        <Link href="/" className="flex items-center gap-3 group" aria-label="CallMind home">
          <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-[16px] transition-transform group-hover:scale-105 shadow-md shadow-brand-500/10 shrink-0">C</div>
          {!collapsed && (
            <span className="text-[18px] font-bold tracking-tight text-foreground group-hover:text-brand-500 transition-colors">
              call<span className="font-bold text-brand-500">Mind</span>
            </span>
          )}
        </Link>
      </div>
      
      {/* 2. Workspace Switcher */}
      <div className={cn("px-4 pb-4 shrink-0 transition-all", collapsed && "px-2")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* 3. Navigation Scroll Area */}
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-5 py-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              {!collapsed && (
                <div className="sidebar-group-label mb-1.5 uppercase tracking-[0.2em] text-muted-foreground font-bold text-[9px] px-3 opacity-40">{group.label}</div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isNavItemActive(item, pathname)
                
                if (collapsed) {
                   return (
                    <TooltipProvider key={item.href} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "sidebar-item-collapsed border border-transparent transition-all",
                              active && "active bg-sidebar-active-bg dark:bg-sidebar-active-bg"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-foreground text-background border-0 font-bold p-2 text-[11px] rounded-lg shadow-sm shadow-black/50">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "sidebar-item transition-all duration-300",
                      active && "active border-brand-500/10 bg-sidebar-active-bg dark:bg-sidebar-active-bg"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-colors", active ? "text-brand-500" : "text-muted-foreground opacity-60")} />
                    <span className={cn("truncate font-medium", active && "text-foreground font-semibold")}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* 4. Footer Section */}
      <div 
        className="flex flex-col gap-2 p-4 border-t border-border shrink-0 transition-colors"
        style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
      >
        <UserNav collapsed={collapsed} />

        <div className={cn("flex items-center mt-1 px-1", collapsed ? "justify-center" : "justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg transition-colors rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
