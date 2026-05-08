'use client'

import React from 'react'
import { 
  Label, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Badge,
  Switch
} from '@aicaller/ui'
import { 
  Ear, 
  Mic, 
  Globe
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface TranscriberTabProps {
  agent: Agent
  onUpdate?: (payload: Partial<Agent>) => void
}

/**
 * Transcriber Tab — Speech-to-Text Configuration (Minimal Professional)
 */
export function TranscriberTab({ agent }: TranscriberTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Transcriber Block */}
      <div className="flex flex-col gap-8 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
          <div className="flex flex-col gap-1">
             <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Assistant Transcriber</h3>
             <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
               Speech-to-text configuration for real-time processing.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">STT Provider</Label>
              <Select defaultValue={agent.stt_provider || 'deepgram'}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="deepgram" className="font-bold">Deepgram (Nova-2)</SelectItem>
                  <SelectItem value="azure" className="font-bold">Azure Speech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Language</Label>
              <Select defaultValue="en-IN">
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="en-IN" className="font-bold">English (India)</SelectItem>
                  <SelectItem value="en-US" className="font-bold">English (US)</SelectItem>
                  <SelectItem value="hi-IN" className="font-bold">Hindi (India)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
      </div>

      {/* Listening Sensitivity Block */}
      <div className="flex flex-col gap-8 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
        <div className="flex flex-col gap-1">
           <h2 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Listening Settings</h2>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Fine-tune assistant interruption and silence detection.
           </p>
        </div>

        <div className="space-y-3">
          {[
            { 
              label: 'End of Perceived Speech', 
              desc: 'Silence duration before responding.', 
              value: '500ms', 
              type: 'badge' 
            },
            { 
              label: 'Interrupt Sensitivity', 
              desc: 'Allow users to speak over the assistant.', 
              type: 'switch' 
            },
            { 
              label: 'Background Noise Filter', 
              desc: 'Suppress call environment noise.', 
              type: 'switch' 
            }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-border/40 bg-background/50">
              <div className="flex flex-col gap-0.5">
                <Label className="text-[14px] font-bold text-foreground">{item.label}</Label>
                <span className="text-[11px] text-muted-foreground/40 font-medium">{item.desc}</span>
              </div>
              {item.type === 'badge' ? (
                <Badge variant="outline" className="h-8 px-4 border-border bg-muted font-mono text-muted-foreground text-[11px] font-bold rounded-lg tabular-nums">
                  {item.value}
                </Badge>
              ) : (
                <Switch defaultChecked />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 opacity-30 pt-2 px-1">
           <Globe className="h-3 w-3" />
           <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
             Active Point of Presence: Mumbai-1
           </p>
        </div>
      </div>

    </div>
  )
}

export default TranscriberTab
