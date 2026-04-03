'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
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
import { SidebarProvider, useSidebar } from './sidebar-context'

interface DashboardShellProps {
  children: ReactNode
  contextualSidebar?: ReactNode
}

function ShellContent({ children }: { children: ReactNode }) {
  const { 
    contextualCollapsed, 
    mobileContextualOpen,
    setMobileContextualOpen,
    contextualSidebar 
  } = useSidebar()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mainCollapsed, setMainCollapsed] = useState(false)

  return (
    <div 
      className="flex h-screen w-full overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
    >
      {/* 1. Desktop Global Sidebar */}
      <div className="hidden md:block shrink-0 h-full border-r border-border">
        <SidebarGlobal collapsed={mainCollapsed} setCollapsed={setMainCollapsed} />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 min-w-0 h-full relative overflow-hidden">
        
        {/* Contextual Sidebar (Desktop) */}
        {contextualSidebar && (
          <div 
            className={cn(
              "hidden md:flex shrink-0 h-full border-r border-border/60 transition-all duration-300 ease-in-out relative overflow-hidden",
              contextualCollapsed ? "w-0 border-r-0 opacity-0" : "w-[280px]"
            )}
            style={{ backgroundColor: 'hsla(var(--background) / 0.5)' }} 
          >
            <div className="w-[280px] h-full shrink-0">
              {contextualSidebar}
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col min-w-0 h-full relative overflow-hidden">
          
          {/* Mobile Header - Always show for global navigation accessibility */}
          <header className="flex md:hidden h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur-md shrink-0 z-40">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">C</div>
              <span className="text-[18px] font-bold tracking-tight text-foreground">
                call<span className="font-extrabold text-primary">Mind</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-xl">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 flex flex-col w-65 border-l border-border bg-sidebar shadow-2xl">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetHeader className="px-3 py-3.5 border-b border-border text-left shrink-0">
                    <div className="flex items-center gap-2">
                       <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base">C</div>
                       <span className="text-[17px] font-bold tracking-tight text-foreground">
                        call<span className="font-extrabold text-primary">Mind</span>
                      </span>
                    </div>
                  </SheetHeader>
                  
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col h-full">
                        <div className="p-2 border-b border-border">
                          <WorkspaceSwitcher inMobileDrawer />
                        </div>
                        <nav className="px-2 py-3 flex flex-col gap-4">
                         {navigationGroups.map((group) => (
                          <div key={group.label} className="flex flex-col gap-1">
                            <div className="sidebar-group-label px-1 mb-0.5">{group.label}</div>
                            {group.items.map((item) => {
                              const Icon = item.icon
                              const active = isNavItemActive(item, pathname)
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    'flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-[12px] font-medium transition-all duration-200',
                                    active ? 'bg-sidebar-active-bg text-primary' : 'text-muted-foreground hover:bg-sidebar-active-bg hover:text-foreground'
                                  )}
                                >
                                  <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
                                  <span className={cn(active && 'font-bold tracking-tight text-foreground')}>{item.label}</span>
                                </Link>
                              )
                            })}
                          </div>
                        ))}
                      </nav>
                    </div>
                  </ScrollArea>
                  
                  <div className="p-2.5 border-t border-border mt-auto">
                    <UserNav />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* Contextual Sidebar Drawer for Mobile - Triggered by page-level toggle button */}
          {contextualSidebar && (
             <Sheet open={mobileContextualOpen} onOpenChange={setMobileContextualOpen}>
               <SheetContent side="right" className="p-0 border-l border-border bg-background shadow-2xl flex flex-col w-[300px]">
                  <SheetTitle className="sr-only">Contextual Navigation</SheetTitle>
                  <div className="flex-1 overflow-hidden" onClick={() => setMobileContextualOpen(false)}>
                     {contextualSidebar}
                  </div>
               </SheetContent>
             </Sheet>
          )}

          <main className="flex flex-1 overflow-auto min-w-0 bg-background transition-colors scrollbar-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellContent>
         {children}
      </ShellContent>
    </SidebarProvider>
  )
}
