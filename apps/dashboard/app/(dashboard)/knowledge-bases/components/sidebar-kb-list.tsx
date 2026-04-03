'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Plus, Database, BookOpen, Filter } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { Badge, Button } from '@aicaller/ui'
import { useKnowledgeBases } from '@/hooks/use-knowledge-bases'
import { SubSidebarShell } from '@/components/layout/subsidebar-shell'

interface SidebarKBListProps {
  initialData?: any[]
}

export function SidebarKBList({ initialData }: SidebarKBListProps) {
  const { id: selectedId } = useParams()
  const { data: kbs = initialData || [] } = useKnowledgeBases()
  const [search, setSearch] = useState('')

  const filteredKBs = kbs.filter((kb) => {
    const name = String(kb?.name ?? '')
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <SubSidebarShell
      headerTitle="Knowledge Base"
      headerSubtitle={
        <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">
          {kbs.length} Sources Linked
        </span>
      }
      headerRight={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-all active:scale-95"
        >
          <Filter className="h-3.5 w-3.5" />
        </Button>
      }
      createButton={
        <Button className="w-full h-10 gap-2.5 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] group">
          <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
          Create Knowledge Base
        </Button>
      }
      searchPlaceholder="Filter sources..."
      searchQuery={search}
      onSearchQueryChange={setSearch}
    >
      {filteredKBs.map((kb) => {
        const isActive = selectedId === kb.id
        return (
          <Link
            key={kb.id}
            href={`/knowledge-bases/${kb.id}`}
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
                  <Database className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'text-[13px] font-bold tracking-tight transition-colors truncate max-w-[140px]',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {kb.name}
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
                {kb.document_count || 0} Docs
              </Badge>
            </div>

            {kb.description && (
              <p className="text-[10px] text-muted-foreground/30 font-medium line-clamp-1 pl-11 group-hover:text-muted-foreground/50 transition-colors">
                {kb.description}
              </p>
            )}

            {isActive && (
              <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(var(--primary),0.3)] animate-in slide-in-from-left-full duration-300" />
            )}
          </Link>
        )
      })}

      {filteredKBs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-20 group/empty">
          <BookOpen className="h-8 w-8 text-muted-foreground group-hover/empty:scale-110 transition-transform" />
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase">No Match</p>
        </div>
      )}
    </SubSidebarShell>
  )
}
