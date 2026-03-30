'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Button,
} from '@aicaller/ui'
import { useUser } from '@/providers/user-provider'
import { cn } from '@aicaller/ui/lib/utils'

interface WorkspaceSwitcherProps {
  collapsed?: boolean
  inMobileDrawer?: boolean
}

/**
 * Workspace Switcher (Midnight Theme Optimized)
 * 
 * Background: #0e121b (Sidebar)
 * Dropdown: #242630 (Card)
 */
export function WorkspaceSwitcher({ collapsed = false, inMobileDrawer = false }: WorkspaceSwitcherProps) {
  const { workspace } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between h-11 px-3.5 transition-all duration-200 border-border/30 bg-muted hover:bg-sidebar-active-bg hover:border-border/50 shadow-sm rounded-xl dark:border-border/20 dark:bg-muted dark:hover:bg-sidebar-active-bg dark:hover:border-border/40",
            collapsed && "justify-center px-0 h-11"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-[11px] shrink-0 shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
              {workspace?.name?.[0]?.toUpperCase() || 'W'}
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="truncate text-[13.5px] font-bold text-foreground tracking-tight leading-none mb-0.5 opacity-90">
                  {workspace?.name || 'My Workspace'}
                </span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 scale-90 origin-left">Workspace</span>
              </div>
            )}
          </div>
          {!collapsed && <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1 shrink-0 opacity-40" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-1.5 shadow-3xl border border-border bg-card rounded-2xl animate-in zoom-in-95 duration-200"
        align={collapsed ? 'center' : 'start'}
        side={inMobileDrawer ? 'bottom' : 'right'}
        sideOffset={inMobileDrawer ? 8 : 12}
      >
        <DropdownMenuLabel className="px-3.5 py-3 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">
          Change Workspace
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 py-3 px-3.5 rounded-xl focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg cursor-pointer transition-colors group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 font-bold text-[11px] transition-colors group-focus:bg-brand-500 group-focus:text-white">
            {workspace?.name?.[0]?.toUpperCase() || 'W'}
          </div>
          <span className="text-[13.5px] font-bold text-foreground group-focus:text-brand-500">{workspace?.name || 'My Workspace'}</span>
          <DropdownMenuShortcut className="text-[10px] opacity-20 ml-auto font-bold tracking-widest">⌘1</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/30 mx-1.5 my-1.5" />
        <DropdownMenuItem className="gap-3 py-3 px-3.5 rounded-xl focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg cursor-pointer text-muted-foreground hover:text-foreground transition-all font-bold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted border border-border/40 shadow-xs dark:bg-muted dark:border-border/30">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-[13.5px]">Create workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
