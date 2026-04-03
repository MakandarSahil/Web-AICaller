'use client'

import React from 'react'
import { 
  Label, 
  Input,
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Card
} from '@aicaller/ui'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface GeneralTabProps {
  agent: Agent
}

export default function GeneralTab({ agent }: GeneralTabProps) {
  return (
    <div className="space-y-10">
      
      {/* 1. Identity Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Agent Identity</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Basic identification for your AI assistant.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Agent Name</Label>
              <Input 
                defaultValue={agent.name} 
                placeholder="e.g. Front Desk Assistant"
                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]"
              />
           </div>

           <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Persona (Optional)</Label>
              <Input 
                defaultValue={agent.persona || ''} 
                placeholder="e.g. A friendly and professional receptionist"
                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]"
              />
           </div>
        </div>
      </section>

      {/* 2. Intelligence Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">System Instructions</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             This is the core logic that governs how your agent behaves and responds.
           </p>
        </div>

        <div className="p-1 rounded-[26px] bg-gradient-to-b from-border/50 to-transparent">
          <Textarea 
            defaultValue={agent.system_prompt || ''} 
            placeholder="Introduce yourself and explain your purpose..."
            className="min-h-[450px] bg-background border-none rounded-[24px] resize-none text-[15px] leading-relaxed p-8 focus:ring-0 transition-all placeholder:text-muted-foreground/20 font-medium"
          />
        </div>
      </section>

    </div>
  )
}
