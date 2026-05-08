'use client'

import React, { useMemo } from 'react'
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
import { useConversations } from '@/hooks/use-conversations'
import { useAgents } from '@/hooks/use-agents'

function formatDateLabel(startedAt: string): string {
   const started = new Date(startedAt)
   const now = new Date()
   const diffMs = now.getTime() - started.getTime()
   const diffMins = Math.floor(diffMs / 60000)
   const diffHours = Math.floor(diffMins / 60)

   if (diffMins < 1) return 'Just now'
   if (diffMins < 60) return `${diffMins} min ago`
   if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
   return started.toLocaleDateString()
}

function formatDuration(startedAt: string, endedAt: string | null): string {
   const end = endedAt ? new Date(endedAt) : new Date()
   const start = new Date(startedAt)
   const diffMs = Math.max(end.getTime() - start.getTime(), 0)
   const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0)
   const minutes = Math.floor(totalSeconds / 60)
   const seconds = totalSeconds % 60
   return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function ConversationsPage() {
  const [agentFilter, setAgentFilter] = useQueryState('agent', parseAsString.withDefault('all'))
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault('all'))
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))

   const { data: conversations = [] } = useConversations()
   const { data: agents = [] } = useAgents()

   const filteredConversations = useMemo(() => {
      const term = search.trim().toLowerCase()
      return conversations.filter((conversation) => {
         const agentName = conversation.agents?.name || 'Unknown Agent'
         const caller = conversation.callers?.phone_number || conversation.caller_id || 'Unknown Caller'
         const matchesSearch =
            !term ||
            agentName.toLowerCase().includes(term) ||
            caller.toLowerCase().includes(term) ||
            conversation.id.toLowerCase().includes(term)
         const matchesAgent = agentFilter === 'all' || conversation.agent_id === agentFilter
         const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter
         return matchesSearch && matchesAgent && matchesStatus
      })
   }, [agentFilter, conversations, search, statusFilter])

   const agentOptions = useMemo(
      () => agents.map((agent) => ({ id: agent.id, name: agent.name })),
      [agents]
   )

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
                  {agentOptions.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id} className="font-bold">
                      {agent.name}
                    </SelectItem>
                  ))}
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
            
            <div className="rounded-xl border border-border/40 overflow-hidden bg-muted/5 shadow-sm">
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
                        {filteredConversations.map((conv) => (
                           <tr key={conv.id} className="group hover:bg-muted/20 transition-colors cursor-pointer">
                              <td className="py-6 px-8">
                                 <Link href={`/conversations/${conv.id}`} className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-xl border border-border/40 bg-background flex items-center justify-center text-primary/40 group-hover:text-primary transition-all">
                                          {conv.channel === 'twilio' ? <Phone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                          <span className="text-[13px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                            {conv.agents?.name ?? 'Unknown Agent'}
                                          </span>
                                          <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest mt-0.5">
                                                                  {conv.channel === 'twilio' ? 'Call' : conv.channel === 'text_api' ? 'Text API' : 'Websocket'}
                                          </span>
                                    </div>
                                 </Link>
                              </td>
                              <td className="py-6 px-8">
                                    <span className="text-[14px] font-mono font-bold text-foreground/80 tracking-tight">
                                      {conv.callers?.phone_number ?? conv.caller_id ?? 'Unknown Caller'}
                                    </span>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-5">
                                    <div className="flex flex-col gap-0.5">
                                          <span className="text-[12px] font-bold text-foreground/60 leading-none">{formatDuration(conv.started_at, conv.ended_at)}</span>
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">Duration</span>
                                    </div>
                                    <div className="h-6 w-[1px] bg-border/20" />
                                    <div className="flex flex-col gap-0.5">
                                       <span className="text-[12px] font-bold text-foreground/60 leading-none">{conv.message_count}</span>
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">Messages</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <span className="text-[12px] font-medium text-muted-foreground/60">{formatDateLabel(conv.started_at)}</span>
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
               <Button variant="ghost" className="h-10 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all opacity-40" disabled>
                  Load Older Conversations
               </Button>
            </div>
         </div>
      </ScrollArea>

    </div>
  )
}
