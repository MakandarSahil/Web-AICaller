'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Import, Bot, ChevronLeft } from 'lucide-react'

import { 
  Button, 
  ScrollArea, 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
} from '@aicaller/ui'

import { cn } from '@aicaller/ui/lib/utils'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { SidebarContextual } from '@/components/layout/sidebar-contextual'
import { useAgents, useDeleteAgent } from '@/hooks/use-agents'
import type { getAgents } from '@aicaller/supabase/queries'

interface AgentsListProps {
  initialData: Awaited<ReturnType<typeof getAgents>>
}

/**
 * Agents List Component (Professional / Retell AI Density)
 * 
 * 1. Normalized font weights: font-black -> font-bold/semibold.
 * 2. Softened borders for a more integrated look.
 */
export function AgentsList({ initialData }: AgentsListProps) {
  const { data: agents } = useAgents(initialData)
  const { mutate: deleteAgent } = useDeleteAgent()
  const [subCollapsed, setSubCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  const filteredAgents = agents?.filter(agent => 
    agent.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <DashboardShell
      contextualSidebar={
        <SidebarContextual 
          title="Agent Groups" 
          collapsed={subCollapsed} 
          setCollapsed={setSubCollapsed}
        >
          <div className="flex flex-col gap-1.5 px-2">
            <Button variant="ghost" className="justify-start px-3 h-10 text-[12px] font-semibold text-brand-500 bg-brand-500/5 border border-brand-500/10 rounded-xl transition-all">
              All Agents
            </Button>
            <Button variant="ghost" className="justify-start px-3 h-10 text-[12px] text-muted-foreground font-medium hover:bg-white/5 rounded-xl transition-all">
              Healthcare
            </Button>
            <Button variant="ghost" className="justify-start px-3 h-10 text-[12px] text-muted-foreground font-medium hover:bg-white/5 rounded-xl transition-all">
              Sales
            </Button>
          </div>
        </SidebarContextual>
      }
    >
      <div className="flex flex-1 flex-col min-w-0 bg-background h-full font-sans transition-colors duration-300">
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSubCollapsed(!subCollapsed)}
              className={cn(
                "h-8 w-8 shrink-0 flex items-center justify-center rounded-full border border-border/60 bg-card shadow-sm transition-all hover:scale-105 hover:bg-sidebar-active-bg",
                subCollapsed ? "rotate-180" : ""
              )}
              title={subCollapsed ? "Open sub sidebar" : "Close sub sidebar"}
            >
              <ChevronLeft size={16} className="text-foreground" />
            </button>
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground pl-1">Agents</h1>
            <div className="relative max-w-[280px] w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-brand-500 opacity-60" />
              <input 
                type="text"
                placeholder="Search agents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 bg-white/2 border border-border/40 h-9 text-[12px] rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-background focus:border-border/60 transition-all font-medium text-foreground tracking-tight"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 gap-2 text-[12px] px-3 border-border/40 bg-white/2 hover:bg-white/5 font-bold tracking-tight text-muted-foreground rounded-xl transition-all active:scale-95">
              <Import className="h-4 w-4 opacity-40 text-foreground" />
              Import
            </Button>
            <Button className="h-9 gap-2 px-4 bg-brand-500 hover:bg-brand-600 text-white border-0 text-[12px] font-bold shadow-lg shadow-brand-500/10 transition-all active:scale-95 rounded-xl">
              <Plus className="h-4 w-4" />
              <span>Create Agent</span>
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/40">
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 h-11 pl-6">Agent Details</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 h-11">Model</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 h-11">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 h-11">Phone Numbers</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 text-right pr-10 h-11">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="group border-b border-border/20 hover:bg-white/5 transition-all duration-300 h-16">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="h-9 w-9 rounded-xl bg-white/2 flex items-center justify-center border border-border/40 text-brand-500 group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                             <Bot className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col overflow-hidden text-left">
                             <span className="text-[14px] font-semibold text-foreground truncate max-w-[280px] tracking-tight">{agent.name}</span>
                             <span className="text-[12px] font-medium text-muted-foreground truncate max-w-[280px] mt-0.5 opacity-50">
                               {agent.persona || (agent.is_default ? 'System default agent.' : 'Custom AI agent persona.')}
                             </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="bg-white/2 text-muted-foreground border border-border/40 font-bold shadow-none text-[9px] uppercase px-2 py-0.5 tracking-tighter opacity-60">
                            {agent.llm_model}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "shadow-none capitalize font-bold text-[9px] px-3 py-1 border rounded-full tracking-widest",
                          agent.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-white/2 text-muted-foreground border-border/40"
                        )}>
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11.5px] text-muted-foreground font-mono tracking-tighter font-medium opacity-50">
                        {agent.phone_numbers?.[0]?.number || '-'}
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground text-right pr-10 font-bold uppercase tracking-tighter opacity-50">
                        {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(agent.created_at))}
                      </TableCell>
                      <TableCell>
                         <div className="flex justify-end pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:bg-card hover:shadow-2xl border border-transparent hover:border-border/40 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px] bg-card border border-border/40 shadow-3xl p-1.5 rounded-2xl animate-in zoom-in-95 duration-200">
                              <DropdownMenuItem className="text-[13px] py-2.5 px-3.5 rounded-xl focus:bg-white/5 cursor-pointer font-bold text-foreground">Edit Agent</DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px] py-2.5 px-3.5 rounded-xl focus:bg-white/5 cursor-pointer font-bold text-foreground">Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border/20 my-1.5" />
                              <DropdownMenuItem 
                                onSelect={() => deleteAgent(agent.id)}
                                className="text-[13px] py-2.5 px-3.5 rounded-xl focus:bg-rose-500/10 text-rose-500 cursor-pointer font-bold uppercase tracking-tight"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                     <TableCell colSpan={6} className="h-80 border-0">
                        <div className="flex flex-col items-center justify-center text-center py-20">
                           <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-2xl border border-border/40">
                              <Bot className="h-8 w-8 text-muted-foreground/30" />
                           </div>
                           <h3 className="text-[18px] font-bold text-foreground tracking-tight">Zero agents deployed</h3>
                           <p className="text-[13px] text-muted-foreground mt-3 max-w-[280px] font-medium leading-relaxed opacity-40">
                             Scale your operations by deploying your first AI voice agent today.
                           </p>
                           <Button className="mt-10 h-10 px-8 bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/10 font-bold border-0 transition-all active:scale-95 rounded-xl text-[12px] uppercase tracking-widest">
                              Create Agent
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </DashboardShell>
  )
}
