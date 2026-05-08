'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@aicaller/ui'
import { Activity, ShieldCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { getAgent } from '@aicaller/supabase/queries'
import { useAgents, useDeleteAgent, useUpdateAgent } from '@/hooks/use-agents'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface AdvancedTabProps {
  agent: Agent
}

export default function AdvancedTab({ agent }: AdvancedTabProps) {
  const router = useRouter()
  const { data: agents } = useAgents()
  const { mutate: updateAgent, isPending: saving } = useUpdateAgent()
  const { mutate: deleteAgent, isPending: deleting } = useDeleteAgent()
  const [status, setStatus] = useState(agent.status || 'active')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  useEffect(() => {
    setStatus(agent.status || 'active')
  }, [agent])

  useEffect(() => {
    if (!deleteOpen) setConfirmName('')
  }, [deleteOpen])

  const isDirty = useMemo(() => status !== (agent.status || 'active'), [agent.status, status])
  const isDefault = agent.is_default
  const isLastAgent = (agents?.length ?? 1) <= 1
  const deleteDisabled = isDefault || isLastAgent || deleting
  const confirmMatches = confirmName.trim() === agent.name

  const deleteHelpText = isDefault
    ? 'Cannot delete the default agent. Create or promote another agent first.'
    : isLastAgent
      ? 'Cannot delete the only agent in your workspace.'
      : 'This permanently removes the agent and its dependent records.'

  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Agent availability
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Control whether this agent can make and receive calls.
          </p>
        </div>

        <Card className="flex flex-col gap-4 rounded-lg border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium text-foreground">Operational status</Label>
            <p className="text-sm text-muted-foreground">Inactive agents remain configured but will not handle traffic.</p>
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value as 'active' | 'inactive' | 'suspended')}>
            <SelectTrigger className="h-10 w-full bg-background sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              updateAgent({
                id: agent.id,
                payload: { status },
              })
            }}
            disabled={saving || !isDirty}
            className="h-10 px-6"
          >
            {saving ? 'Saving...' : 'Save status'}
          </Button>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-destructive/20 bg-destructive/5 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-base font-semibold text-destructive">
            <ShieldCheck className="h-4 w-4" />
            Danger zone
          </h3>
          <p className="text-sm leading-relaxed text-destructive/75">
            Irreversible management actions for this agent.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-background p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Delete agent</h4>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Deleting <strong>{agent.name}</strong> removes its KB links, assigned phone numbers, conversation history,
                transcript messages, usage stats, and V2 tool or analytics rows through database cascades.
              </p>
              {deleteDisabled ? (
                <p className="mt-2 text-sm font-medium text-muted-foreground">{deleteHelpText}</p>
              ) : null}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="shrink-0">
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          disabled={deleteDisabled}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg rounded-xl border-border/70 bg-card">
                        <DialogHeader>
                          <DialogTitle>Delete {agent.name}?</DialogTitle>
                          <DialogDescription>
                            This cannot be undone. Type the agent name to confirm deletion.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3">
                          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive/80">
                            Related rows are removed by database cascade: knowledge-base links, phone numbers,
                            conversations, messages, usage, tools, tool executions, and analytics.
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-agent-name">Agent name</Label>
                            <Input
                              id="confirm-agent-name"
                              value={confirmName}
                              onChange={(event) => setConfirmName(event.target.value)}
                              placeholder={agent.name}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={!confirmMatches || deleting}
                            onClick={() => {
                              deleteAgent(agent.id, {
                                onSuccess: () => {
                                  toast.success('Agent deleted.')
                                  setDeleteOpen(false)
                                  router.push('/agents')
                                },
                                onError: (error) => {
                                  toast.error(error instanceof Error ? error.message : 'Failed to delete agent.')
                                },
                              })
                            }}
                          >
                            {deleting ? 'Deleting...' : 'Delete agent'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                {deleteDisabled ? (
                  <TooltipContent className="max-w-64 text-center">
                    {deleteHelpText}
                  </TooltipContent>
                ) : null}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>
    </div>
  )
}
