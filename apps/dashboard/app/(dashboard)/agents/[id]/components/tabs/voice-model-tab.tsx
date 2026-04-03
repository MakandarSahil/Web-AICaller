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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Card
} from '@aicaller/ui'
import { Info, Cpu, Volume2, Mic } from 'lucide-react'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface VoiceModelTabProps {
  agent: Agent
}

export default function VoiceModelTab({ agent }: VoiceModelTabProps) {
  return (
    <div className="space-y-12">
      
      {/* 1. Model Configuration */}
      <section className="space-y-8">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Language Model intelligence</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Choose the brain of your AI assistant.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-primary opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Selected Model</Label>
              </div>
              <Select defaultValue={agent.llm_model || 'llama-3.3-70b-versatile'}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="llama-3.3-70b-versatile" className="font-bold">Llama 3.3 70B (Recommended)</SelectItem>
                  <SelectItem value="llama-3.1-8b-instant" className="font-bold">Llama 3.1 8B (Fastest)</SelectItem>
                  <SelectItem value="mixtral-8x7b-32768" className="font-bold">Mixtral 8x7B (Large Context)</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider Badge</Label>
              <div className="h-12 flex items-center px-5 rounded-xl border border-border/50 bg-muted/20 font-bold text-[14px] gap-3">
                 <Badge variant="outline" className="h-6 bg-background rounded-md text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest border-border/40">Groq</Badge>
                 <span className="text-muted-foreground/40 text-[12px] font-medium uppercase tracking-widest opacity-60 decoration-dotted underline underline-offset-4">Accelerated Intelligence</span>
              </div>
           </div>
        </div>
      </section>

      {/* 2. Voice (TTS) Configuration */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Voice Personality (TTS)</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Decide how your agent sounds on a call.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="h-4 w-4 text-emerald-500 opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">TTS Voice</Label>
              </div>
              <Select defaultValue={agent.tts_voice || 'en-IN-PrabhatNeural'}>
                <SelectTrigger className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="en-IN-PrabhatNeural" className="font-bold">Prabhat (Indian Male)</SelectItem>
                  <SelectItem value="en-US-JennyNeural" className="font-bold">Jenny (US Female)</SelectItem>
                  <SelectItem value="en-US-AriaNeural" className="font-bold">Aria (US Female)</SelectItem>
                  <SelectItem value="en-US-GuyNeural" className="font-bold">Guy (US Male)</SelectItem>
                  <SelectItem value="en-GB-SoniaNeural" className="font-bold">Sonia (UK Female)</SelectItem>
                  <SelectItem value="hi-IN-SwaraNeural" className="font-bold">Swara (Hindi Female)</SelectItem>
                  <SelectItem value="en-AU-NatashaNeural" className="font-bold">Natasha (AU Female)</SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Voice Infrastructure</Label>
              <div className="h-12 flex items-center px-5 rounded-xl border border-border/50 bg-muted/20 font-bold text-[14px] gap-3">
                 <Badge variant="outline" className="h-6 bg-background rounded-md text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest border-border/40">Azure Neural</Badge>
                 <span className="text-muted-foreground/40 text-[12px] font-medium uppercase tracking-widest opacity-60">High-fidelity Stream</span>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Transcription (STT) Infrastructure */}
      <section className="space-y-8 pt-4 pb-10 border-b border-border/20">
         <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Speech-to-Text (STT)</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Real-time transcription and parsing layer.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="h-4 w-4 text-primary opacity-60" />
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider</Label>
              </div>
              <div className="h-12 flex items-center px-5 rounded-xl border border-border/50 bg-muted/20 font-bold text-[14px] gap-3">
                 <Badge variant="outline" className="h-6 bg-background rounded-md text-[10px] font-bold text-primary uppercase tracking-widest border-primary/20">Azure Speech</Badge>
                 <span className="text-muted-foreground/30 text-[12px] font-medium uppercase tracking-widest">Whisper-optimized</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  )
}
