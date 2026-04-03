'use client'

import React from 'react'
import { 
  Label, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Badge
} from '@aicaller/ui'
import { 
  Info
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface ModelTabProps {
  agent: Agent
  onUpdate?: (payload: Partial<Agent>) => void
}

/**
 * Model Tab — Core LLM Configuration (Minimal Professional)
 */
export function ModelTab({ agent }: ModelTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* System Prompt Block */}
      <div className="flex flex-col gap-6 p-8 rounded-[32px] bg-muted/20 dark:bg-black/20 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
             <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">System Prompt</h3>
             <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
               Defines the core personality and instructions for the agent.
             </p>
          </div>
          <Badge variant="outline" className="h-6 bg-background rounded-md text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest border-border/50">
             742 Tokens
          </Badge>
        </div>

        <Textarea 
          defaultValue={agent.system_prompt || ''} 
          placeholder="You are a helpful AI assistant..."
          className="min-h-[400px] bg-background border-border/50 rounded-2xl resize-none text-[14px] leading-relaxed p-6 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/20"
        />
      </div>

      {/* Model Selection Block */}
      <div className="flex flex-col gap-8 p-8 rounded-[32px] bg-muted/20 dark:bg-black/20 border border-border/50">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Intelligence & Creativity</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Configure the underlying LLM behavior.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Provider & Model */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider</Label>
              <Select defaultValue={agent.llm_provider || 'openai'}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="openai" className="font-bold">OpenAI</SelectItem>
                  <SelectItem value="anthropic" className="font-bold">Anthropic</SelectItem>
                  <SelectItem value="groq" className="font-bold">Groq (Llama-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Selected Model</Label>
              <Select defaultValue={agent.llm_model || 'gpt-4o'}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all text-foreground px-5 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="gpt-4o" className="font-bold">GPT-4o (Vision)</SelectItem>
                  <SelectItem value="claude-3-5-sonnet" className="font-bold">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="llama-3.3-70b-versatile" className="font-bold">Llama 3.3 70B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Temperature & Max Tokens */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Temperature</Label>
                <Badge variant="outline" className="h-6 px-3 border-border bg-background font-mono text-[11px] text-foreground">0.7</Badge>
              </div>
              <div className="pt-2">
                <div className="h-1 bg-muted rounded-full relative group">
                  <div className="absolute h-full w-[70%] bg-primary/40 rounded-full" />
                  <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-background border border-border shadow-md transition-transform group-hover:scale-110" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/30 font-medium">Controls the randomness: 0 is deterministic, 1 is creative.</p>
            </div>

            <div className="space-y-5">
               <div className="flex items-center justify-between">
                 <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Max Tokens</Label>
                 <Badge variant="outline" className="h-6 px-3 border-border bg-background font-mono text-[11px] text-foreground">1,024</Badge>
               </div>
               <div className="pt-2">
                <div className="h-1 bg-muted rounded-full relative group">
                  <div className="absolute h-full w-[40%] bg-muted-foreground/30 rounded-full" />
                  <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-background border border-border shadow-md transition-transform group-hover:scale-110" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/30 font-medium">Maximum length of the assistant response.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ModelTab
