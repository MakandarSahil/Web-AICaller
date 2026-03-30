'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ScrollArea,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import { SidebarGlobal } from './sidebar-global'
import { navigationGroups, isNavItemActive } from './dashboard-nav'

import { WorkspaceSwitcher } from './workspace-switcher'
import { UserNav } from './user-nav'

interface DashboardShellProps {
  children: ReactNode
  contextualSidebar?: ReactNode
}

/**
 * Main Dashboard Shell (High Fidelity)
 * 
 * Implements a "stepped" dark mode with different shades for 
 * sidebar, middle panels, and main content to match the Retell aesthetic.
 */
export function DashboardShell({ children, contextualSidebar }: DashboardShellProps) {
  const [mainCollapsed, setMainCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div 
      className="flex h-screen w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
    >
      {/* 1. Desktop Global Sidebar (Darkest Step) */}
      <div className="hidden md:block shrink-0 h-full border-r border-border">
        <SidebarGlobal collapsed={mainCollapsed} setCollapsed={setMainCollapsed} />
      </div>

      {/* 2. Main Content Area + Optional Contextual Sidebar */}
      <div className="flex flex-1 min-w-0 h-full relative overflow-hidden">
        
        {/* Slot for Contextual Sidebar (Middle Step) */}
        {contextualSidebar && (
          <div 
            className="flex shrink-0 h-full border-r border-border/60 transition-colors relative"
            style={{ backgroundColor: 'hsla(var(--background) / 0.5)' }} 
          >
            {contextualSidebar}
          </div>
        )}

        <div className="flex flex-1 flex-col min-w-0 h-full relative overflow-hidden">
          {/* Mobile Header */}
          <header className="flex md:hidden h-[var(--header-height)] items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur-md shrink-0 z-40">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-lg transition-transform group-hover:scale-105 shadow-sm">C</div>
              <span className="text-[18px] font-bold tracking-tight text-foreground">
                call<span className="font-extrabold text-brand-500">Mind</span>
              </span>
            </Link>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-xl">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col w-[300px] border-r-0 bg-sidebar shadow-2xl">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {/* Mobile Drawer Header */}
                <SheetHeader className="px-6 py-5 border-b border-border text-left shrink-0" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
                  <div className="flex items-center gap-2">
                     <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-base">C</div>
                     <span className="text-[17px] font-bold tracking-tight text-foreground">
                      call<span className="font-extrabold text-brand-500">Mind</span>
                    </span>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
                  <div className="flex flex-col h-full">
                    
                    <div className="p-4 border-b border-border bg-sidebar-active-bg dark:bg-sidebar-active-bg">
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2 opacity-60">Current Workspace</div>
                       <WorkspaceSwitcher />
                    </div>

                    <nav className="px-4 py-8 flex flex-col gap-8">
                       {navigationGroups.map((group) => (
                        <div key={group.label} className="flex flex-col gap-1.5">
                          <div className="sidebar-group-label px-3 mb-1">{group.label}</div>
                          {group.items.map((item) => {
                            const Icon = item.icon
                            const active = isNavItemActive(item, pathname)
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  'flex items-center gap-4 rounded-xl px-4 py-3 text-[14px] font-medium transition-all duration-200',
                                  active ? 'bg-sidebar-active-bg dark:bg-sidebar-active-bg text-brand-500 shadow-sm border border-brand-500/10' : 'text-muted-foreground hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg hover:text-foreground'
                                )}
                              >
                                <Icon className={cn('h-5 w-5', active ? 'text-brand-500' : 'text-muted-foreground')} />
                                <span className={cn(active && 'font-bold tracking-tight text-foreground')}>{item.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </nav>

                  </div>
                </ScrollArea>
                
                {/* Mobile Drawer Footer */}
                <div className="p-4 border-t border-border mt-auto" style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}>
                  <UserNav />
                </div>
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex flex-1 overflow-auto min-w-0 bg-background transition-colors">
            {children}
          </main>
        </div>

      </div>
    </div>
  )
}
