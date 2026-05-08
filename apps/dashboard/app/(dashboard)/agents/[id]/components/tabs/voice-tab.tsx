'use client'

import React from 'react'
import { 
  Label, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Button,
  Badge
} from '@aicaller/ui'
import { 
  Play
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface VoiceTabProps {
  agent: Agent
  onUpdate?: (payload: Partial<Agent>) => void
}

/**
 * Voice Tab — Text-to-Speech Configuration (Minimal Professional)
 */
export function VoiceTab({ agent }: VoiceTabProps) {
  const voices = [
    { id: 'en-IN-PrabhatNeural', name: 'Prabhat (Indian English)', gender: 'Male' },
    { id: 'en-US-JennyNeural', name: 'Jenny (US English)', gender: 'Female' },
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Hindi)', gender: 'Female' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Voice Selection Block */}
      <div className="flex flex-col gap-8 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
          <div className="flex flex-col gap-1">
             <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Assistant Voice</h3>
             <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
               Select the vocal representation of your brand.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider</Label>
              <Select defaultValue={agent.tts_provider || 'azure'}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="azure" className="font-bold">Azure Neural</SelectItem>
                  <SelectItem value="elevenlabs" className="font-bold">ElevenLabs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Neural Voice</Label>
              <Select defaultValue={agent.tts_voice || 'en-IN-PrabhatNeural'}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {voices.map(v => (
                    <SelectItem key={v.id} value={v.id} className="font-bold">{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button className="h-10 w-10 bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground rounded-full active:scale-95 transition-all">
                <Play className="h-3.5 w-3.5 ml-0.5" />
             </Button>
             <span className="text-[11px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">Preview Voice</span>
          </div>
      </div>

      {/* Audio Styling Block */}
      <div className="flex flex-col gap-10 p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50">
        <div className="flex flex-col gap-1">
           <h2 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Audio Styling</h2>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Adjust the speaking parameters for realistic delivery.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Pitch Control */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-[13px] font-bold text-foreground">Pitch Shift</Label>
              <Badge variant="outline" className="h-6 border-border bg-background font-mono text-[11px] text-foreground">1.0x</Badge>
            </div>
            <div className="h-1 bg-muted rounded-full relative group">
              <div className="absolute h-full w-1/2 bg-muted-foreground/30 rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-background border border-border shadow-md" />
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label className="text-[13px] font-bold text-foreground">Speaking Rate</Label>
              <Badge variant="outline" className="h-6 border-border bg-background font-mono text-[11px] text-foreground">1.1x</Badge>
            </div>
            <div className="h-1 bg-muted rounded-full relative group">
              <div className="absolute h-full w-[60%] bg-primary/40 rounded-full" />
              <div className="absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-background border border-border shadow-md" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default VoiceTab
