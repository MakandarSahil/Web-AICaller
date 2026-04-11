'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { 
  Button, 
  Card,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@aicaller/ui'
import { AlertTriangle, Trash2, ShieldCheck, Activity } from 'lucide-react'
import type { getAgent } from '@aicaller/supabase/queries'
import { useUpdateAgent } from '@/hooks/use-agents'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface AdvancedTabProps {
  agent: Agent
}

export default function AdvancedTab({ agent }: AdvancedTabProps) {
  // Mock check for "last agent" - in real wiring we'd check agents.length
  const isLastAgent = false 
  const isDefault = agent.is_default
  const { mutate: updateAgent, isPending: saving } = useUpdateAgent()
  const [status, setStatus] = useState(agent.status || 'active')

  useEffect(() => {
    setStatus(agent.status || 'active')
  }, [agent])

  const isDirty = useMemo(() => status !== (agent.status || 'active'), [agent.status, status])

  const deleteDisabled = isDefault || isLastAgent

  return (
    <div className="space-y-10 max-w-2xl">
      
      {/* 1. Agent Status (Moved from General) */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 border-b border-border/10 pb-6">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase flex items-center gap-2">
             <Activity className="h-4 w-4 text-primary" />
             Agent Availability
           </h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
             Control whether this agent is currently active and accepting calls.
           </p>
        </div>

        <Card className="p-8 border-border/40 bg-muted/5 rounded-none flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <Label className="text-[13px] font-bold text-foreground">Operational Status</Label>
              <p className="text-[11px] text-muted-foreground/60 font-medium italic">Disable this to prevent the agent from making or receiving calls.</p>
           </div>
            <Select value={status} onValueChange={(value) => setStatus(value as 'active' | 'inactive' | 'suspended')}>
              <SelectTrigger className="w-40 h-11 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="active" className="font-bold">Active</SelectItem>
                <SelectItem value="inactive" className="font-bold">Inactive</SelectItem>
              </SelectContent>
           </Select>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              updateAgent({
                id: agent.id,
                payload: {
                  status,
                },
              })
            }}
            disabled={saving || !isDirty}
            className="h-11 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-lg shadow-primary/10 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Status'}
          </Button>
        </div>
      </section>

      {/* 2. Danger Zone Header */}
      <div className="flex flex-col gap-1 border-b border-border/10 pb-6 pt-4">
         <h3 className="text-[14px] font-bold text-destructive tracking-tight uppercase flex items-center gap-2">
           <ShieldCheck className="h-4 w-4" />
           Critical Management
         </h3>
         <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
           Irreversible management actions for this agent.
         </p>
      </div>

      {/* 3. Delete Agent Card */}
      <Card className="p-10 border-destructive/20 bg-destructive/5 rounded-none space-y-8">
         <div className="flex flex-col gap-2">
            <h4 className="text-[16px] font-bold text-foreground">Delete Agent</h4>
            <p className="text-[12px] text-muted-foreground/60 leading-relaxed font-medium">
              This action is permanent and cannot be undone. All call history, statistics, and configurations associated with <strong>{agent.name}</strong> will be permanently removed.
            </p>
         </div>

         <div className="flex items-center gap-6">
            <TooltipProvider>
               <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button 
                      variant="outline" 
                      className="h-12 px-8 rounded-xl border-destructive/20 text-destructive font-bold text-[12px] uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95 gap-3"
                      disabled={deleteDisabled}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete {agent.name}
                    </Button>
                  </div>
                </TooltipTrigger>
                {deleteDisabled && (
                  <TooltipContent className="bg-black text-white border-0 font-bold p-3 text-[11px] rounded-lg shadow-xl max-w-60 text-center mb-2">
                    {isDefault 
                      ? "Cannot delete the default agent. Assign another agent as default first." 
                      : "Cannot delete the only agent in your workspace."}
                  </TooltipContent>
                )}
               </Tooltip>
            </TooltipProvider>

            {deleteDisabled && (
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
                 Protected by system guard
               </span>
            )}
         </div>
      </Card>

    </div>
  )
}
