'use client'

import React from 'react'
import { 
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@aicaller/ui'
import { 
  Activity, 
  Clock, 
  CreditCard, 
  MessageSquare
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface StatsTabProps {
  agent: Agent
}

/**
 * Stats Tab — Usage & Cost Metrics
 * 
 * Professional, minimal layout for monitoring agent performance.
 */
export function StatsTab({ agent }: StatsTabProps) {
  // ... existing code ...
  const stats = [
    { label: 'Total Calls', value: '1,248', icon: Activity, trend: '+12%', color: 'text-emerald-500' },
    { label: 'Avg. Duration', value: '4m 32s', icon: Clock, trend: '-5%', color: 'text-amber-500' },
    { label: 'Total Messages', value: '14.2k', icon: MessageSquare, trend: '+18%', color: 'text-primary' },
    { label: 'Total Cost', value: '$842.10', icon: CreditCard, trend: '+4%', color: 'text-rose-500' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50 space-y-4">
             <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground/60 shadow-sm">
                   <stat.icon className="h-4 w-4" />
                </div>
                <Badge variant="outline" className={cn("h-6 border-transparent bg-muted font-mono text-[10px] font-bold", stat.color)}>
                  {stat.trend}
                </Badge>
             </div>
             <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">{stat.label}</span>
                <span className="text-[20px] font-bold text-foreground tabular-nums">{stat.value}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Latency Table */}
      <div className="p-8 rounded-xl bg-muted/20 dark:bg-muted/20 border border-border/50 space-y-6">
         <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase px-1">Latency Breakdown</h3>
         <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50 bg-muted/30">
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Component</TableHead>
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Average Delay</TableHead>
                     <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">Status</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {[
                    { name: 'STT (Deepgram)', value: '180ms', status: 'Optimal' },
                    { name: 'LLM Reasoning (Gemma)', value: '650ms', status: 'Optimal' },
                    { name: 'TTS Generation', value: '210ms', status: 'Optimal' },
                    { name: 'Total RTT', value: '1.04s', status: 'Normal' }
                  ].map((row, i) => (
                    <TableRow key={i} className="border-border/30 hover:bg-muted/30 transition-colors">
                       <TableCell className="text-[13px] font-medium text-foreground">{row.name}</TableCell>
                       <TableCell className="text-[13px] font-mono text-muted-foreground/60 tabular-nums">{row.value}</TableCell>
                       <TableCell className="text-right">
                          <Badge variant="outline" className="h-5 bg-emerald-500/5 text-emerald-500 border-emerald-500/10 text-[10px] font-bold rounded-md">
                             {row.status}
                          </Badge>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>

    </div>
  )
}

export default StatsTab
