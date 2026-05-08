'use client'

import React, { useMemo, useState } from 'react'
import { 
  Button, 
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@aicaller/ui'
import { 
  Database, 
  Plus,
  X,
} from 'lucide-react'
import type { getAgent } from '@aicaller/supabase/queries'
import type { getKnowledgeBases } from '@aicaller/supabase/queries'
import { useSetAgentKnowledgeBases } from '@/hooks/use-agents'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>
type KnowledgeBasesList = NonNullable<Awaited<ReturnType<typeof getKnowledgeBases>>>

interface KnowledgeBasesTabProps {
  agent: Agent
  knowledgeBases: KnowledgeBasesList
}

export default function KnowledgeBasesTab({ agent, knowledgeBases }: KnowledgeBasesTabProps) {
  const linkedKBs = agent.agent_knowledge_bases || []
  const linkedKbIds = useMemo(() => new Set(linkedKBs.map((l) => l.kb_id)), [linkedKBs])
  const kbById = useMemo(() => new Map(knowledgeBases.map((kb) => [kb.id, kb])), [knowledgeBases])

  const [kbToAttach, setKbToAttach] = useState<string>('')
  const { mutate: setAgentKBs, isPending: settingKb } = useSetAgentKnowledgeBases()

  const availableKBs = knowledgeBases.filter((kb) => !linkedKbIds.has(kb.id))

  const handleAttach = () => {
    if (!kbToAttach) return
    const nextIds = Array.from(linkedKbIds)
    nextIds.push(kbToAttach)
    setAgentKBs({ agentId: agent.id, kbIds: nextIds })
    setKbToAttach('')
  }

  const handleDetach = (kbId: string) => {
    const nextIds = Array.from(linkedKbIds).filter((id) => id !== kbId)
    setAgentKBs({ agentId: agent.id, kbIds: nextIds })
  }

  return (
    <div className="space-y-10">
      
      {/* 1. Attachment Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Connected Intelligence</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Link knowledge bases to give your agent context for the conversation.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex-1">
              <Select value={kbToAttach} onValueChange={setKbToAttach}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a Knowledge Base to attach..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {availableKBs.length === 0 ? (
                    <SelectItem
                      value="__no_kbs__"
                      disabled
                      className="text-[11px] font-bold uppercase tracking-widest opacity-30 italic"
                    >
                      No available KBs
                    </SelectItem>
                  ) : (
                    availableKBs.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id} className="font-bold">
                        {kb.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
           </div>
           <Button
             className="h-12 px-6 rounded-xl font-bold text-[12px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-sm shadow-primary/10 transition-all active:scale-95 shrink-0 disabled:opacity-50"
             disabled={settingKb || !kbToAttach}
             onClick={handleAttach}
           >
              <Plus className="h-3.5 w-3.5" />
              Attach
           </Button>
        </div>
      </section>

      {/* 2. Management Section */}
      <section className="space-y-6 pt-4">
         <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Active Knowledge Bases</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             KBs currently utilized by this agent during live calls.
           </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {linkedKBs.length > 0 ? (
            linkedKBs.map((link) => {
              const kb = kbById.get(link.kb_id)
              const name = kb?.name ?? link.knowledge_bases?.name ?? 'Untitled Source'
              const docCount = kb?.document_count ?? 0

              return (
              <div
                key={link.kb_id}
                className="flex items-center justify-between p-5 rounded-xl bg-muted/10 border border-border/40 group/kb hover:bg-muted/20 transition-all"
              >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-primary/60 transition-all">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-foreground tracking-tight">{name}</span>
                      <div className="flex items-center gap-2 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          <Badge variant="outline" className="h-4 px-1.5 text-[8px] border-border bg-background uppercase font-bold text-muted-foreground/30">
                            {docCount} Documents
                          </Badge>
                      </div>
                    </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-0 group-hover/kb:opacity-100 rounded-lg hover:bg-destructive/10 text-destructive/60 transition-all disabled:opacity-50"
                  disabled={settingKb}
                  onClick={() => handleDetach(link.kb_id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              )
            })
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/5 rounded-xl border border-dashed border-border/50">
                <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-6 opacity-40">
                   <Database className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-[14px] font-bold text-foreground/60 tracking-tight uppercase">No KBs attached</h3>
                <p className="text-[11px] text-muted-foreground/30 mt-1 max-w-[320px] font-medium leading-relaxed uppercase tracking-widest">
                  Attach a Knowledge Base to give your agent the context it needs to answer complex questions.
                </p>
             </div>
          )}
        </div>
      </section>

    </div>
  )
}
