'use client'

import React from 'react'
import { Badge } from '@aicaller/ui'
import { Users } from 'lucide-react'
import type { getKnowledgeBase } from '@aicaller/supabase/queries'
import Link from 'next/link'

type KnowledgeBaseDetail = NonNullable<Awaited<ReturnType<typeof getKnowledgeBase>>>

interface KBAgentsTabProps {
  knowledgeBase: KnowledgeBaseDetail
}

export default function KBAgentsTab({ knowledgeBase }: KBAgentsTabProps) {
  const agents = knowledgeBase.agents_using_it ?? []

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-muted/20 flex items-center justify-center border border-border/50 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">
              Attached Agents
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
              Agents currently using this knowledge base for context.
            </p>
          </div>
        </div>
      </section>

      <section>
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/5 rounded-xl border border-dashed border-border/50">
            <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-6 opacity-40">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-[14px] font-bold text-foreground/60 tracking-tight uppercase">
              No agents attached
            </h3>
            <p className="text-[11px] text-muted-foreground/30 mt-1 max-w-[320px] font-medium leading-relaxed uppercase tracking-widest">
              Attach this knowledge base to agents from the Agents section to let them use it as context.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="flex items-center justify-between p-5 rounded-xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-background border border-border/50 flex items-center justify-center text-primary/60 group-hover:text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-foreground tracking-tight">
                      {agent.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
                      Agent
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="h-6 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border-border/50"
                >
                  Attached
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

