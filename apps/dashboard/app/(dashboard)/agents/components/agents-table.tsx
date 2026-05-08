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
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import type { getAgents } from '@aicaller/supabase/queries'

interface AgentsTableProps {
  initialData?: Awaited<ReturnType<typeof getAgents>>
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
    <div className="flex flex-1 flex-col min-w-0 bg-background overflow-hidden animate-in fade-in duration-300">
      <PageHeader
        title="Agents"
        description={`${filteredAgents.length} configured assistants`}
        leading={<ContextualSidebarToggleButton />}
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden h-8 gap-2 sm:inline-flex">
              <Download className="h-3.5 w-3.5" />
              Import
            </Button>
            <Button size="sm" className="h-8 gap-2" asChild>
              <Link href="/agents/new">
                <Plus className="h-3.5 w-3.5" />
                Create
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-border/70 px-5 py-3 sm:px-6 lg:px-8">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search agents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full pl-9 text-sm bg-background border-border/70 rounded-lg"
            />
          </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-6 lg:px-8 scrollbar-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="h-12 w-[350px] text-xs font-medium text-muted-foreground">Agent</TableHead>
              <TableHead className="h-12 text-xs font-medium text-muted-foreground">Model</TableHead>
              <TableHead className="h-12 text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="h-12 text-xs font-medium text-muted-foreground">Phone number</TableHead>
              <TableHead className="h-12 text-right text-xs font-medium text-muted-foreground">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow 
                key={agent.id} 
                className="group border-border/20 hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <TableCell className="py-4">
                  <Link href={`/agents/${agent.id}`} className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground tracking-tight">{agent.name}</span>
                    <span className="text-xs text-muted-foreground truncate font-mono max-w-[280px]">
                      {agent.id}
                    </span>
                    {agent.agent_knowledge_bases?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {agent.agent_knowledge_bases.slice(0, 2).map((link) => (
                          <Badge
                            key={link.kb_id}
                            variant="secondary"
                            className="h-5 px-2 bg-muted/40 border-border/40 text-xs font-medium text-foreground/70"
                          >
                            {link.knowledge_bases?.name ?? link.kb_id}
                          </Badge>
                        ))}
                        {agent.agent_knowledge_bases.length > 2 ? (
                          <Badge
                            variant="secondary"
                            className="h-5 px-2 text-xs font-medium bg-muted/40 border-border/40 text-foreground/50"
                          >
                            +{agent.agent_knowledge_bases.length - 2}
                          </Badge>
                        ) : null}
                      </div>
                    ) : null}
                  </Link>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="h-6 bg-muted/20 border-border text-xs font-mono text-muted-foreground rounded-md">
                    {agent.llm_model}
                  </Badge>
                </TableCell>

                <TableCell>
                  <StatusBadge tone={agent.status === 'active' ? 'success' : 'default'}>
                    {agent.status}
                  </StatusBadge>
                </TableCell>

                <TableCell>
                  <span className="text-muted-foreground text-xs font-mono font-medium">
                    {agent.phone_numbers?.[0]?.number || '-'}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
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
                <TableCell colSpan={5} className="py-8">
                  <EmptyState
                    icon={Search}
                    title="No agents found"
                    description="Try another search term or create a new assistant for this workspace."
                    className="min-h-[220px]"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
