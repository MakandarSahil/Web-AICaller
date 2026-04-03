'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Bot, Plus, Activity } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { Badge, Button } from '@aicaller/ui'
import { useAgents } from '@/hooks/use-agents'
import { SubSidebarShell } from '@/components/layout/subsidebar-shell'

interface SidebarAgentListProps {
  initialData?: any[]
}

/**
 * Agents contextual sidebar.
 * UI mirrors Knowledge Bases sidebar, while keeping Agents UX (routes + toggle behavior)
 * handled elsewhere in the main content area.
 */
export function SidebarAgentList({ initialData }: SidebarAgentListProps) {
  const pathname = usePathname()
  const params = useParams()
  const currentId = params?.id as string | undefined

  const { data: agents = [], isLoading } = useAgents(initialData)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = agents.filter((agent) => {
    const name = String(agent?.name ?? '')
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <SubSidebarShell
      headerTitle="Agents"
      headerSubtitle={
        <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">
          {agents.length} Active Agents
        </span>
      }
      // extraTop={
      //   <div className="px-4 pt-4 pb-2 space-y-1 shrink-0">
      //     <Button
      //       asChild
      //       variant="ghost"
      //       className={cn(
      //         'w-full justify-start h-9 px-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all',
      //         pathname === '/agents'
      //           ? 'bg-muted dark:bg-white/5 text-foreground border-border/50 shadow-sm'
      //           : 'text-muted-foreground/60 hover:text-foreground'
      //       )}
      //     >
      //       {/* <Link href="/agents">
      //         <Activity className="h-3.5 w-3.5 mr-2 opacity-50" />
      //         General Overview
      //       </Link> */}
      //     </Button>
      //   </div>
      // }
      createButton={
        <Button
          asChild
          className="w-full h-10 gap-2.5 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] group"
        >
          <Link href="/agents/new">
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
            Create Agent
          </Link>
        </Button>
      }
      searchPlaceholder="Filter agents..."
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      headerRight={null}
    >
      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-muted/30 border border-border/40 animate-pulse"
            />
          ))}
        </>
      ) : filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-20 group/empty">
          <Bot className="h-8 w-8 text-muted-foreground group-hover/empty:scale-110 transition-transform" />
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase">No Match</p>
          <p className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest">
            "{searchQuery}"
          </p>
        </div>
      ) : (
        filteredAgents.map((agent) => {
          const isActive = !!currentId && currentId === agent.id
          return (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className={cn(
                'group relative flex flex-col gap-1.5 p-4 rounded-2xl transition-all duration-300 ease-in-out border border-transparent',
                isActive
                  ? 'bg-muted/40 dark:bg-muted/10 border-border/40 shadow-sm'
                  : 'hover:bg-muted/20 hover:border-border/20'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-muted-foreground/40 group-hover:bg-background group-hover:text-primary transition-colors'
                    )}
                  >
                    <Bot className="h-4 w-4" />
                  </div>

                  <span
                    className={cn(
                      'text-[13px] font-bold tracking-tight transition-colors truncate max-w-[140px]',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {agent.name}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 border-border/50 rounded-md text-[9px] font-bold uppercase tracking-widest transition-opacity',
                    isActive
                      ? 'opacity-100 bg-background text-primary'
                      : 'opacity-30 group-hover:opacity-100'
                  )}
                >
                  {agent.status}
                </Badge>
              </div>

              {agent.llm_model ? (
                <p className="text-[10px] text-muted-foreground/30 font-medium line-clamp-1">
                  {agent.llm_model}
                </p>
              ) : null}

              {isActive && (
                <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(var(--primary),0.3)] animate-in slide-in-from-left-full duration-300" />
              )}
            </Link>
          )
        })
      )}
    </SubSidebarShell>
  )
}
