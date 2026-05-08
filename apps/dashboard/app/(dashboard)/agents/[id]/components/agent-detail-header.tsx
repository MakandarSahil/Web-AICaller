'use client'

import React from 'react'
import { 
  Bot, 
  MessageSquare, 
  Phone, 
  Copy, 
  Trash2, 
  Share2, 
  Play, 
  ChevronRight,
  MonitorCheck,
  CheckCircle2,
  Clock,
  Terminal,
  MoreHorizontal
} from 'lucide-react'
import { 
  Button, 
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Skeleton
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import type { Tables } from '@aicaller/supabase'
import Link from 'next/link'

import { MobileNavBack } from '@/components/layout/mobile-nav-back'

type Agent = Tables<'agents'>

interface AgentDetailHeaderProps {
  agent: Agent
  onUpdate?: (payload: any) => void
  isUpdating?: boolean
}

/**
 * Agent Detail Header (Professional / Density Optimized)
 * 
 * Matches Image 2 design:
 * - ID with Copy action below name
 * - Action Bar: [Code] [Play] [Talk] [Published State]
 */
export function AgentDetailHeader({ agent, onUpdate, isUpdating }: AgentDetailHeaderProps) {
  const copyId = () => {
    navigator.clipboard.writeText(agent.id)
  }

  return (
    <header className="page-header shrink-0 h-auto md:h-24 px-4 md:px-10 py-4 md:py-0 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Left Area: Name & ID Block */}
      <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
        <MobileNavBack href="/agents" label="Agents" />
        
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-brand-500/5 flex items-center justify-center border-2 border-brand-500/20 shadow-sm shadow-brand-500/5 group transition-all shrink-0">
           <Bot className="h-6 w-6 md:h-7 md:w-7 text-brand-500" />
        </div>
        
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center gap-3">
             <h1 className="text-[20px] font-bold text-foreground truncate tracking-tight uppercase">{agent.name}</h1>
             <Badge className={cn(
               "h-5 text-[9px] font-semibold uppercase px-2 py-0 border-0 tracking-widest",
               agent.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-muted/30 text-muted-foreground"
             )}>
               <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", agent.status === 'active' ? "bg-emerald-400" : "bg-muted-foreground")} />
               {agent.status === 'active' ? 'Published' : 'Inactive'}
             </Badge>
          </div>
          
          <div className="flex items-center gap-2 group cursor-pointer" onClick={copyId}>
             <span className="text-[11px] font-bold text-muted-foreground opacity-30 group-hover:opacity-100 transition-all uppercase tracking-widest">
               Assistant ID: <span className="font-mono text-brand-500/60 ml-1">{agent.id}</span>
             </span>
             <Copy className="h-3 w-3 text-brand-500 opacity-0 group-hover:opacity-60 transition-all" />
          </div>
        </div>
      </div>

      {/* Right Area: High-Fidelity Action Bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="outline" size="icon" className="h-10 w-10 border-border/40 bg-muted/20 hover:bg-muted/30 rounded-xl opacity-60 hover:opacity-100 transition-all">
                    <Terminal className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Code View</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="outline" size="icon" className="h-10 w-10 border-border/40 bg-muted/20 hover:bg-muted/30 rounded-xl opacity-60 hover:opacity-100 transition-all">
                    <Play className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Interactive Play</TooltipContent>
             </Tooltip>

             <div className="w-px h-6 bg-border/20 mx-2" />

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button className="h-10 px-5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 font-bold text-[12px] rounded-xl border border-brand-500/20 transition-all active:scale-95 gap-2 group">
                    <Phone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    Talk to Assistant
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Voice Call</TooltipContent>
             </Tooltip>
           </TooltipProvider>
        </div>

        <Button 
          className={cn(
            "h-10 px-6 font-bold text-[13px] rounded-xl transition-all shadow-sm active:scale-95 gap-2",
            isUpdating 
              ? "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20" 
              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none hover:bg-emerald-500/20"
          )}
          onClick={() => onUpdate?.({})}
        >
          {isUpdating ? (
            <>
              <CheckCircle2 className="h-4 w-4 animate-pulse" />
              Saving Changes...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Published
            </>
          )}
        </Button>

        <Button variant="ghost" size="icon" className="h-10 w-10 opacity-40 hover:opacity-100 rounded-xl hover:bg-muted/30 transition-all">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
