'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Database, BookOpen, Filter, Trash2 } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription as UIDialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@aicaller/ui'
import { useKnowledgeBases } from '@/hooks/use-knowledge-bases'
import { SubSidebarShell } from '@/components/layout/subsidebar-shell'
import { useUser } from '@/providers/user-provider'
import { useCreateKnowledgeBase, useDeleteKnowledgeBase } from '@/hooks/use-knowledge-bases'
import type { getKnowledgeBases } from '@aicaller/supabase/queries'

type KnowledgeBaseListItem = NonNullable<Awaited<ReturnType<typeof getKnowledgeBases>>>[number]

interface SidebarKBListProps {
  initialData?: KnowledgeBaseListItem[]
}

export function SidebarKBList({ initialData }: SidebarKBListProps) {
  const { id: selectedId } = useParams()
  const { workspace } = useUser()
  const router = useRouter()
  const { data: kbs = initialData || [] } = useKnowledgeBases(initialData)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeBaseListItem | null>(null)

  const { mutate: createKb, isPending: createPending } = useCreateKnowledgeBase()
  const { mutate: deleteKb, isPending: deletePending } = useDeleteKnowledgeBase()

  const [kbName, setKbName] = useState('')
  const [kbDescription, setKbDescription] = useState('')

  const filteredKBs = kbs.filter((kb) => {
    const name = String(kb?.name ?? '')
    return name.toLowerCase().includes(search.toLowerCase())
  })

  const deleteWarningText = useMemo(() => {
    if (!deleteTarget) return null
    const agents = deleteTarget.agents_using_it ?? []
    const agentNames = agents.map((a) => a.name).filter(Boolean)
    return agentNames
  }, [deleteTarget])

  return (
    <>
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
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <Button
              className="w-full h-10 gap-2.5 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] group"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
              Create Knowledge Base
            </Button>
            <DialogContent className="max-w-2xl bg-card border-border/50 rounded-[32px] p-0 overflow-hidden shadow-2xl">
              <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
                <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">Create Knowledge Base</DialogTitle>
                <UIDialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                  Name and description are used for navigation and agent context.
                </UIDialogDescription>
              </DialogHeader>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Name</Label>
                  <Input
                    value={kbName}
                    onChange={(e) => setKbName(e.target.value)}
                    placeholder="e.g., Company Policies"
                    className="h-12 bg-muted/10 border-border/50 rounded-xl px-5 font-bold text-[14px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Description (Optional)</Label>
                  <Textarea
                    value={kbDescription}
                    onChange={(e) => setKbDescription(e.target.value)}
                    placeholder="Short details about what this source covers..."
                    className="min-h-[120px] bg-muted/10 border-border/50 rounded-xl px-5 py-4 font-medium text-[14px] resize-none"
                  />
                </div>

                <div className="space-y-4">
                  {!workspace && (
                    <Alert>
                      <AlertTitle className="text-[12px] font-bold uppercase tracking-widest">No Workspace</AlertTitle>
                      <AlertDescription className="text-[11px] font-medium leading-relaxed opacity-70">
                        You must be logged in and have a workspace to create a Knowledge Base.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    disabled={!workspace || createPending || !kbName.trim()}
                    className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95"
                    onClick={() => {
                      if (!workspace) return
                      createKb(
                        { workspaceId: workspace.id, name: kbName.trim(), description: kbDescription.trim() || null },
                        {
                          onSuccess: (created) => {
                            setCreateOpen(false)
                            setKbName('')
                            setKbDescription('')
                            router.push(`/knowledge-bases/${created.id}`)
                          },
                        }
                      )
                    }}
                  >
                    Create Knowledge Base
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-muted/5 border-border/40 hover:bg-muted/10 transition-all"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
        searchPlaceholder="Filter sources..."
        searchQuery={search}
        onSearchQueryChange={setSearch}
      >
        {filteredKBs.map((kb) => {
          const isActive = selectedId === kb.id

          return (
            <div
              key={kb.id}
              className={cn(
                'group relative flex flex-col gap-1.5 p-4 rounded-2xl transition-all duration-300 ease-in-out border border-transparent',
                isActive
                  ? 'bg-muted/40 dark:bg-muted/10 border-border/40 shadow-sm'
                  : 'hover:bg-muted/20 hover:border-border/20'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/knowledge-bases/${kb.id}`}
                  className="flex-1 min-w-0 flex items-center gap-3"
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center transition-all shrink-0',
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
                </Link>

                <div className="flex items-center gap-2 shrink-0">
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

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/50 transition-all active:scale-95"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDeleteTarget(kb)
                      setDeleteOpen(true)
                    }}
                    aria-label={`Delete ${kb.name}`}
                    title={`Delete ${kb.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {kb.description && (
                <p className="text-[10px] text-muted-foreground/30 font-medium line-clamp-1 pl-11 group-hover:text-muted-foreground/50 transition-colors">
                  {kb.description}
                </p>
              )}

              {kb.agents_using_it?.length ? (
                <div className="flex flex-wrap gap-1.5 pl-11 pt-1">
                  {kb.agents_using_it.slice(0, 3).map((agent) => (
                    <Badge
                      key={agent.id}
                      variant="secondary"
                      className="h-5 px-2 bg-background border-border/40 text-[9px] font-bold uppercase tracking-widest text-foreground/70"
                    >
                      {agent.name}
                    </Badge>
                  ))}
                  {kb.agents_using_it.length > 3 && (
                    <Badge variant="secondary" className="h-5 px-2 text-[9px] font-bold bg-background border-border/40 text-foreground/50">
                      +{kb.agents_using_it.length - 3}
                    </Badge>
                  )}
                </div>
              ) : null}

              {isActive && (
                <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(var(--primary),0.3)]" />
              )}
            </div>
          )
        })}

        {filteredKBs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-20 group/empty">
            <BookOpen className="h-8 w-8 text-muted-foreground group-hover/empty:scale-110 transition-transform" />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase">No Match</p>
          </div>
        )}
      </SubSidebarShell>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50 rounded-[32px] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
            <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">Delete Knowledge Base</DialogTitle>
            <UIDialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
              This will also remove its documents and detach it from agents.
            </UIDialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            {deleteTarget ? (
              <>
                <Alert className="bg-destructive/5 border-destructive/20 text-destructive rounded-2xl p-5">
                  <AlertTitle className="text-[12px] font-bold uppercase tracking-widest mb-1 ml-1">
                    KB is attached to agents
                  </AlertTitle>
                  <AlertDescription className="text-[11px] font-medium leading-relaxed opacity-70 ml-1">
                    {deleteWarningText && deleteWarningText.length > 0
                      ? `Attached agents: ${deleteWarningText.join(', ')}`
                      : 'This KB is attached to at least one agent.'}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                    KB to delete
                  </p>
                  <p className="text-[14px] font-bold text-foreground">{deleteTarget.name}</p>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-muted-foreground/60">Select a KB to delete.</p>
            )}

            <DialogFooter className="pt-2">
              <Button
                variant="secondary"
                className="h-12 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-muted/5 border-border/40 hover:bg-muted/10 transition-all"
                onClick={() => setDeleteOpen(false)}
                disabled={deletePending}
              >
                Cancel
              </Button>
              <Button
                className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/10 transition-all active:scale-95"
                onClick={() => {
                  if (!deleteTarget) return
                  deleteKb(deleteTarget.id, {
                    onSuccess: () => {
                      setDeleteOpen(false)
                      setDeleteTarget(null)
                      router.push('/knowledge-bases')
                    },
                  })
                }}
                disabled={!deleteTarget || deletePending}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
