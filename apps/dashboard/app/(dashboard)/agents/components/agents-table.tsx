'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  Download
} from 'lucide-react'
import { 
  Button, 
  Input, 
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import { useAgents } from '@/hooks/use-agents'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'

interface AgentsTableProps {
  initialData: any
}

/**
 * Agents Table (Minimal Professional UI)
 * 
 * Reverted to simple table rows, removed Bot icons and blurs.
 * Added toggle button for contextual sidebar.
 */
export function AgentsTable({ initialData }: AgentsTableProps) {
  const { data: agents } = useAgents(initialData)
  const [search, setSearch] = useState('')

  const filteredAgents = agents?.filter(agent => 
    agent.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden animate-in fade-in duration-300">
      
      {/* Table Header */}
      <div className="h-16 px-10 border-b border-border flex items-center justify-between bg-background sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <ContextualSidebarToggleButton className="mr-1" />
          <h1 className="text-[16px] font-bold text-foreground tracking-tight">Agents</h1>
          
          <div className="relative group ml-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search agents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 pl-9 text-[12px] bg-muted/20 dark:bg-black/20 border-border rounded-lg focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-9 gap-2 text-muted-foreground hover:bg-muted rounded-lg font-bold text-[11px] uppercase tracking-widest px-3">
            <Download className="h-3.5 w-3.5" />
            Import
          </Button>
          <Button className="h-9 gap-2 font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all px-4" asChild>
            <Link href="/agents/new">
              <Plus className="h-3.5 w-3.5" />
              Create Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="uppercase text-[10px] font-bold tracking-[0.1em] text-muted-foreground/60 h-14 w-[350px]">Agent Details</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-[0.1em] text-muted-foreground/60 h-14">Model</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-[0.1em] text-muted-foreground/60 h-14">Status</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-[0.1em] text-muted-foreground/60 h-14">Phone Numbers</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-[0.1em] text-muted-foreground/60 h-14 text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow 
                key={agent.id} 
                className="group border-border/20 hover:bg-muted/30 dark:hover:bg-white/2 transition-colors cursor-pointer"
              >
                <TableCell className="py-4">
                  <Link href={`/agents/${agent.id}`} className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-foreground tracking-tight">{agent.name}</span>
                    <span className="text-[11px] text-muted-foreground/40 truncate font-medium max-w-[280px]">
                      {agent.id}
                    </span>
                  </Link>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="h-6 bg-muted/20 border-border text-[10px] font-mono text-muted-foreground/60 rounded-md">
                    {agent.llm_model}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className={cn(
                    "h-6 text-[10px] font-bold uppercase rounded-md px-2",
                    agent.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" : "bg-muted text-muted-foreground"
                  )} variant="outline">
                    {agent.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-muted-foreground/40 text-[12px] font-mono font-medium">
                    {agent.phone_numbers?.[0]?.number || '-'}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-[12px] font-bold text-muted-foreground/30 tabular-nums">
                    {agent.created_at ? new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }).format(new Date(agent.created_at)) : '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}

            {filteredAgents.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <p className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground/20">No agents found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
