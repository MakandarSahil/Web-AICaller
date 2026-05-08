'use client'

import React from 'react'
import { 
  Label, 
  Button, 
  Badge
} from '@aicaller/ui'
import { 
  Plus, 
  Database, 
  X,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface KnowledgeTabProps {
  agent: Agent
  onUpdate?: (payload: Partial<Agent>) => void
}

/**
 * Knowledge Tab — RAG Configuration (Minimal Professional)
 */
export function KnowledgeTab({ agent }: KnowledgeTabProps) {
  const linkedKBs = agent.agent_knowledge_bases || []

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Knowledge Base Block */}
      <div className="flex flex-col gap-8 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col gap-1">
               <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Knowledge Bases</h3>
               <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                 Connect custom data sources for context-aware responses.
               </p>
            </div>
            
            <Button variant="outline" className="h-9 gap-2 border-border/50 bg-background hover:bg-muted text-foreground font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95 px-4">
              <Plus className="h-3.5 w-3.5" />
              Link Source
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {linkedKBs.length > 0 ? (
              linkedKBs.map((kb: any) => (
                <div key={kb.id} className="flex items-center justify-between p-5 rounded-xl bg-background/50 border border-border/40 group/kb hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground/60 transition-all">
                        <Database className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-foreground tracking-tight">{kb.knowledge_base?.name || 'Untitled Knowledge Base'}</span>
                        <div className="flex items-center gap-2 text-muted-foreground/30 text-[10px] font-bold uppercase tracking-widest">
                           <span>{kb.knowledge_base?.document_count || 0} Docs</span>
                           <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                           <span>RAG-v2 Cluster</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover/kb:opacity-100 rounded-lg hover:bg-muted transition-all">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover/kb:opacity-100 rounded-lg hover:bg-destructive/10 text-destructive/60 transition-all">
                        <X className="h-3.5 w-3.5" />
                     </Button>
                  </div>
                </div>
              ))
            ) : (
               <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/10 dark:bg-black/5 rounded-xl border border-dashed border-border/50 group/empty">
                  <h3 className="text-[13px] font-bold text-foreground/60 tracking-tight uppercase">No Data Linked</h3>
                  <p className="text-[11px] text-muted-foreground/30 mt-1 max-w-[280px] font-medium leading-relaxed uppercase tracking-widest">
                    Link documentation to enhance agent intelligence.
                  </p>
                  <Button className="mt-8 h-10 px-8 bg-muted text-foreground border border-border/50 hover:bg-muted/80 font-bold transition-all active:scale-95 rounded-xl text-[11px] uppercase tracking-widest gap-2 shadow-sm">
                     <Plus className="h-3.5 w-3.5" />
                     Link Your First Source
                  </Button>
               </div>
            )}
          </div>
      </div>

      {/* Retrieval Settings Block */}
      <div className="flex flex-col gap-10 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
        <div className="flex flex-col gap-1 px-1">
           <h2 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Retrieval Strategy</h2>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Manage how the agent fetches and uses linked information.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-background/50 border border-border/40 space-y-3">
             <div className="flex items-center justify-between">
                <Label className="text-[13px] font-bold text-foreground">Top K Documents</Label>
                <Badge variant="outline" className="h-6 px-3 border-border bg-muted font-mono text-muted-foreground text-[10px] tabular-nums rounded-md">3</Badge>
             </div>
             <p className="text-[11px] text-muted-foreground/30 font-medium leading-relaxed uppercase tracking-widest">
               Context window limit per query.
             </p>
          </div>

          <div className="p-6 rounded-xl bg-background/50 border border-border/40 space-y-3">
             <div className="flex items-center justify-between">
                <Label className="text-[13px] font-bold text-foreground">Recency Bias</Label>
                <Badge variant="outline" className="h-6 px-3 border-emerald-500/10 bg-emerald-500/5 text-emerald-500 font-mono text-[10px] rounded-md">Enabled</Badge>
             </div>
             <p className="text-[11px] text-muted-foreground/30 font-medium leading-relaxed uppercase tracking-widest">
               Prioritize newer documentation.
             </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default KnowledgeTab
