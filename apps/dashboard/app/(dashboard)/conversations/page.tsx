'use client'

import React, { useState } from 'react'
import { 
  Badge, 
  Button, 
  ScrollArea, 
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@aicaller/ui'
import { 
  History, 
  Phone, 
  Search, 
  Filter, 
  Calendar,
  MessageSquare,
  Clock,
  ChevronRight,
  MoreVertical,
  Activity
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'
import { useQueryState, parseAsString } from 'nuqs'

// Mock Data for UI development
const mockConversations = [
  { id: '1', agent: 'Front Desk Assistant', channel: 'Voice', status: 'active', duration: '2:45', messages: 12, caller: '+1 (555) 123-4567', date: 'Just now' },
  { id: '2', agent: 'HR Support Bot', channel: 'Chat', status: 'completed', duration: '5:12', messages: 24, caller: 'User_882', date: '2 hours ago' },
  { id: '3', agent: 'Front Desk Assistant', channel: 'Voice', status: 'completed', duration: '1:30', messages: 8, caller: '+1 (555) 987-6543', date: 'Yesterday' },
]

export default function ConversationsPage() {
  const [agentFilter, setAgentFilter] = useQueryState('agent', parseAsString.withDefault('all'))
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault('all'))
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen font-sans overflow-hidden">
      
      {/* 1. Page Header */}
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">Conversations</h1>
            <div className="h-4 w-[1px] bg-border/40 mx-1" />
            <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">Activity Logs</span>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative group sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30 transition-colors group-focus-within:text-primary" />
               <Input 
                 placeholder="Search caller or agent..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="h-10 pl-9 bg-muted/10 border-border/40 rounded-xl text-[12px] font-medium focus:ring-1 focus:ring-primary/20"
               />
            </div>
         </div>
      </header>

      {/* 2. Filters Bar */}
      <div className="px-10 py-4 border-b border-border/10 bg-muted/5 flex items-center gap-4 transition-all">
         <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Filters</span>
         </div>
         
         <div className="flex items-center gap-3">
            <Select value={agentFilter} onValueChange={setAgentFilter}>
               <SelectTrigger className="h-9 min-w-[140px] bg-background border-border/40 rounded-lg text-[11px] font-bold uppercase tracking-widest px-3">
                  <SelectValue placeholder="All Agents" />
               </SelectTrigger>
               <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all" className="font-bold">All Agents</SelectItem>
                  <SelectItem value="agt1" className="font-bold">Front Desk Assistant</SelectItem>
                  <SelectItem value="agt2" className="font-bold">HR Support Bot</SelectItem>
               </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="h-9 min-w-[140px] bg-background border-border/40 rounded-lg text-[11px] font-bold uppercase tracking-widest px-3">
                  <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all" className="font-bold">All Status</SelectItem>
                  <SelectItem value="active" className="font-bold">Active</SelectItem>
                  <SelectItem value="completed" className="font-bold">Completed</SelectItem>
                  <SelectItem value="failed" className="font-bold">Failed</SelectItem>
               </SelectContent>
            </Select>

            <Button variant="outline" className="h-9 px-4 rounded-lg border-border/40 bg-background text-[11px] font-bold uppercase tracking-widest gap-2 text-muted-foreground">
               <Calendar size={14} />
               Last 7 Days
            </Button>
         </div>
      </div>

      <ScrollArea className="flex-1">
         <div className="max-w-6xl mx-auto px-10 py-10 pb-40 space-y-10">
            
            <div className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5 shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="border-b border-border/40 bg-muted/10">
                           <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Agent & Channel</th>
                           <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Caller / ID</th>
                           <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Stats</th>
                           <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Date</th>
                           <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Status</th>
                           <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                        {mockConversations.map((conv) => (
                           <tr key={conv.id} className="group hover:bg-muted/20 transition-colors cursor-pointer">
                              <td className="py-6 px-8">
                                 <Link href={`/conversations/${conv.id}`} className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-xl border border-border/40 bg-background flex items-center justify-center text-primary/40 group-hover:text-primary transition-all">
                                       {conv.channel === 'Voice' ? <Phone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[13px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{conv.agent}</span>
                                       <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest mt-0.5">{conv.channel}</span>
                                    </div>
                                 </Link>
                              </td>
                              <td className="py-6 px-8">
                                 <span className="text-[14px] font-mono font-bold text-foreground/80 tracking-tight">{conv.caller}</span>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-5">
                                    <div className="flex flex-col gap-0.5">
                                       <span className="text-[12px] font-bold text-foreground/60 leading-none">{conv.duration}</span>
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">Duration</span>
                                    </div>
                                    <div className="h-6 w-[1px] bg-border/20" />
                                    <div className="flex flex-col gap-0.5">
                                       <span className="text-[12px] font-bold text-foreground/60 leading-none">{conv.messages}</span>
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">Messages</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <span className="text-[12px] font-medium text-muted-foreground/60">{conv.date}</span>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-2">
                                    <div className={cn(
                                       "h-1.5 w-1.5 rounded-full",
                                       conv.status === 'active' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/30"
                                    )} />
                                    <span className={cn(
                                       "text-[10px] font-bold uppercase tracking-widest",
                                       conv.status === 'active' ? "text-emerald-500/80" : "text-muted-foreground/40"
                                    )}>
                                       {conv.status}
                                    </span>
                                 </div>
                              </td>
                              <td className="py-6 px-8 text-right">
                                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground transition-all active:scale-95" asChild>
                                    <Link href={`/conversations/${conv.id}`}>
                                       <ChevronRight className="h-4 w-4" />
                                    </Link>
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Pagination / Load More Placeholder */}
            <div className="flex justify-center pt-4">
               <Button variant="ghost" className="h-10 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all opacity-40">
                  Load Older Conversations
               </Button>
            </div>
         </div>
      </ScrollArea>

    </div>
  )
}
