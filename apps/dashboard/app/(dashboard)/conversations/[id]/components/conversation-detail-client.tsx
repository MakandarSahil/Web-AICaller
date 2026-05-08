'use client'

import React, { useMemo } from 'react'
import { Badge, Button } from '@aicaller/ui'
import { ArrowLeft, Activity, Bot, Calendar, Clock, Database, FileText, MessageSquare, MoreVertical, Phone, Share2, User } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'
import type { Tables } from '@aicaller/supabase'
import { useConversationMessages } from '@/hooks/use-conversations'

type Conversation = Tables<'conversations'> & {
   agents?: { name: string | null } | null
   callers?: { phone_number: string | null } | null
}

type Message = Tables<'messages'>

function formatTimeLabel(createdAt: string): string {
   return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(dateValue: string): string {
   return new Date(dateValue).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })
}

function estimateDuration(startedAt: string, endedAt: string | null): string {
   const start = new Date(startedAt)
   const end = endedAt ? new Date(endedAt) : new Date()
   const totalSeconds = Math.max(Math.floor((end.getTime() - start.getTime()) / 1000), 0)
   const minutes = Math.floor(totalSeconds / 60)
   const seconds = totalSeconds % 60
   return `${minutes}m ${seconds}s`
}

export default function ConversationDetailClient({
   id,
   conversation,
   messages,
}: {
   id: string
   conversation: Conversation
   messages: Message[]
}) {
   const summary = conversation.summary || ''
   const status = conversation.status
   const { data: queriedMessages = [] } = useConversationMessages(id, messages)
   const effectiveMessages = queriedMessages.length ? queriedMessages : messages

   const transcript = useMemo(
      () =>
         effectiveMessages.map((message) => ({
            role: message.role,
            content: message.content,
            time: formatTimeLabel(message.created_at),
         })),
      [effectiveMessages]
   )

   const historyBackHref = conversation.channel === 'twilio' ? '/call-history' : '/chat-history'

   return (
      <div className="flex-1 flex flex-col min-w-0 bg-background h-screen font-sans overflow-hidden animate-in fade-in duration-500">
         <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground mr-1" asChild>
                  <Link href={historyBackHref}>
                     <ArrowLeft className="h-4 w-4" />
                  </Link>
               </Button>
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <span className="text-[14px] font-bold text-foreground tracking-tight">Call Detail: {id.slice(0, 8)}</span>
                     <Badge
                        variant="outline"
                        className={cn(
                           'h-5 px-2 text-[9px] font-bold uppercase tracking-widest',
                           status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-muted border-border text-muted-foreground/40'
                        )}
                     >
                        {status}
                     </Badge>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95">
                  <Share2 className="h-4 w-4" />
               </Button>
               <div className="h-6 w-[1px] bg-border/40 mx-2" />
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95">
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </div>
         </header>

         <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto scrollbar-none px-10 py-12 pb-40 border-r border-border/40">
               <div className="max-w-4xl mx-auto space-y-12">
                  <section className="space-y-6">
                     <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">AI Summary</h3>
                     </div>

                     <div className="p-8 rounded-xl transition-all duration-500 border bg-muted/10 border-border/40">
                        {summary ? (
                           <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">{summary}</p>
                        ) : (
                           <p className="text-[15px] font-medium text-muted-foreground/50 leading-relaxed italic">
                              No summary captured for this conversation yet.
                           </p>
                        )}
                     </div>
                  </section>

                  <section className="space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60">
                           <Activity className="h-4 w-4" />
                        </div>
                        <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Conversation Transcript</h3>
                     </div>

                     <div className="space-y-8">
                        {transcript.length ? (
                           transcript.map((msg, index) => (
                              <div
                                 key={index}
                                 className={cn('flex gap-6 animate-in slide-in-from-bottom-2 duration-400', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                              >
                                 <div
                                    className={cn(
                                       'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border shadow-sm transition-all',
                                       msg.role === 'assistant'
                                          ? 'bg-muted/40 border-border/50 text-muted-foreground/60'
                                          : 'bg-primary border-primary/20 text-primary-foreground shadow-sm shadow-primary/10'
                                    )}
                                 >
                                    {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                 </div>

                                 <div className={cn('flex flex-col gap-2 max-w-[80%] pt-1', msg.role === 'user' ? 'items-end text-right' : 'items-start text-left')}>
                                    <div
                                       className={cn(
                                          'px-6 py-4 rounded-xl text-[15px] leading-relaxed tracking-tight break-words font-medium',
                                          msg.role === 'assistant'
                                             ? 'bg-muted/10 border border-border/30 text-foreground rounded-tl-none'
                                             : 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/5'
                                       )}
                                    >
                                       {msg.content}
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest px-2">{msg.time}</span>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="rounded-xl border border-dashed border-border/40 bg-muted/10 p-8 text-center">
                              <p className="text-sm font-medium text-muted-foreground/60">
                                 No transcript messages are available for this conversation yet.
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground/50">
                                 Stored messages: {conversation.message_count}
                              </p>
                           </div>
                        )}
                     </div>
                  </section>
               </div>
            </main>

            <aside className="w-80 overflow-y-auto scrollbar-none flex flex-col shrink-0 bg-muted/5">
               <div className="p-8 space-y-10">
                  <section className="space-y-6">
                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Caller Profile</h4>
                     <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background border border-border/40 shadow-sm">
                        <div className="h-20 w-20 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-inner">
                           <Phone className="h-8 w-8" />
                        </div>
                        <span className="text-[18px] font-bold text-foreground tracking-tight">
                           {conversation.callers?.phone_number ?? conversation.caller_id ?? 'Unknown caller'}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest mt-1">
                           {conversation.channel} • {conversation.agents?.name ?? 'Unknown agent'}
                        </span>

                        <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-border/50">
                           <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-foreground">{conversation.message_count}</span>
                              <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Messages</span>
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-foreground">{formatDateLabel(conversation.started_at)}</span>
                              <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Started</span>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="space-y-6 pt-4 border-t border-border/50">
                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Metadata</h4>
                     <div className="space-y-4">
                        {[
                           { label: 'Date', value: formatDateLabel(conversation.started_at), icon: Calendar },
                           { label: 'Duration', value: estimateDuration(conversation.started_at, conversation.ended_at), icon: Clock },
                           { label: 'Messages', value: `${conversation.message_count} Total`, icon: MessageSquare },
                           { label: 'Agent', value: conversation.agents?.name ?? 'Unknown Agent', icon: Bot },
                        ].map((item, index) => (
                           <div key={index} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                 <item.icon className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                                 <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">{item.label}</span>
                              </div>
                              <span className="text-[12px] font-bold text-foreground/80">{item.value}</span>
                           </div>
                        ))}
                     </div>
                  </section>

                  <section className="space-y-6 pt-4 border-t border-border/50">
                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Knowledge used</h4>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 group hover:border-primary/20 transition-all shadow-sm">
                           <Database className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                           <span className="text-[12px] font-bold text-foreground/60 truncate">Live conversation records</span>
                        </div>
                     </div>
                  </section>
               </div>
            </aside>
         </div>
      </div>
   )
}
