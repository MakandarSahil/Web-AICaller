'use client'

import React from 'react'
import { 
  Label, 
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
  X,
  Plus
} from 'lucide-react'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface KnowledgeBasesTabProps {
  agent: Agent
}

export default function KnowledgeBasesTab({ agent }: KnowledgeBasesTabProps) {
  const linkedKBs = agent.agent_knowledge_bases || []

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
              <Select>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue placeholder="Select a Knowledge Base to attach..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                   <SelectItem value="none" disabled className="text-[11px] font-bold uppercase tracking-widest opacity-30 italic">No available KBs</SelectItem>
                   <SelectItem value="kb1" className="font-bold">Company Perks & Benefits</SelectItem>
                   <SelectItem value="kb2" className="font-bold">Cancellation Policy 2024</SelectItem>
                </SelectContent>
              </Select>
           </div>
           <Button className="h-12 px-6 rounded-xl font-bold text-[12px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95 shrink-0">
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
            linkedKBs.map((kb: any) => (
              <div key={kb.id} className="flex items-center justify-between p-5 rounded-xl bg-muted/10 border border-border/40 group/kb hover:bg-muted/20 transition-all">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-primary/60 transition-all">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-foreground tracking-tight">{kb.knowledge_base?.name || 'Untitled Source'}</span>
                      <div className="flex items-center gap-2 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          <Badge variant="outline" className="h-4 px-1.5 text-[8px] border-border bg-background uppercase font-bold text-muted-foreground/30">
                            {kb.knowledge_base?.document_count || 0} Documents
                          </Badge>
                      </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover/kb:opacity-100 rounded-lg hover:bg-destructive/10 text-destructive/60 transition-all">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/5 rounded-[32px] border border-dashed border-border/50">
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
