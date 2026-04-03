'use client'

import React, { useState } from 'react'
import { 
  Badge, 
  Button, 
  ScrollArea, 
  Card,
  Input,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@aicaller/ui'
import { 
  ArrowLeft, 
  Phone, 
  Clock, 
  MessageSquare, 
  User, 
  Bot, 
  Database, 
  Calendar,
  Share2,
  MoreVertical,
  Activity,
  CheckCircle2,
  FileText,
  Edit3
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'

// Mock Data for UI development
const mockTranscript = [
  { role: 'assistant', content: 'Hello! Thank you for calling CallMind Front Desk. How can I assist you today?', time: '10:02 AM' },
  { role: 'user', content: 'Hi, I would like to know about your office hours for the upcoming holiday.', time: '10:02 AM' },
  { role: 'assistant', content: 'Of course. Our office will be closed on Friday for the holiday, but we will be open during regular hours on Thursday and the following Monday.', time: '10:03 AM' },
  { role: 'user', content: 'Great, thank you. One more thing: do I need an appointment for a quick consultation?', time: '10:03 AM' },
  { role: 'assistant', content: 'For a quick consultation, no appointment is necessary. You can drop by between 9 AM and 11 AM any weekday.', time: '10:04 AM' },
]

export default function ConversationDetailClient({ id }: { id: string }) {
  const [isEditingSummary, setIsEditingSummary] = useState(false)
  const [summary, setSummary] = useState("The caller inquired about holiday office hours and appointment requirements for consultations. The agent provided specific closure dates and confirmed that no appointment is needed for drop-ins between 9-11 AM.")
  const [status] = useState<'active' | 'completed'>('completed')

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen font-sans overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. Header (Strategic Metadata) */}
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground mr-1" asChild>
               <Link href="/conversations">
                  <ArrowLeft className="h-4 w-4" />
               </Link>
            </Button>
            <div className="flex flex-col">
               <div className="flex items-center gap-3">
                  <span className="text-[14px] font-bold text-foreground tracking-tight">Call Detail: {id.slice(0, 8)}</span>
                  <Badge variant="outline" className={cn(
                    "h-5 px-2 text-[9px] font-bold uppercase tracking-widest",
                    status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted border-border text-muted-foreground/40"
                  )}>
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
         
         {/* 2. Main Area (Transcript & Summary) */}
         <main className="flex-1 overflow-y-auto scrollbar-none px-10 py-12 pb-40 border-r border-border/40">
            <div className="max-w-4xl mx-auto space-y-12">
               
               {/* Summary Block */}
               <section className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">AI Summary</h3>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-8 px-3 rounded-lg text-[11px] font-bold uppercase tracking-widest gap-2 text-muted-foreground hover:bg-muted"
                       onClick={() => setIsEditingSummary(!isEditingSummary)}
                     >
                        <Edit3 className="h-3 w-3" />
                        {isEditingSummary ? 'Cancel' : 'Edit'}
                     </Button>
                  </div>

                  <div className={cn(
                    "p-8 rounded-[32px] transition-all duration-500 border",
                    isEditingSummary ? "bg-background border-primary/20 shadow-xl" : "bg-muted/10 border-border/40"
                  )}>
                     {isEditingSummary ? (
                        <div className="space-y-4">
                           <Textarea 
                             value={summary}
                             onChange={(e) => setSummary(e.target.value)}
                             className="min-h-[120px] bg-background border-none focus:ring-0 text-[15px] font-medium leading-relaxed p-0 resize-none"
                           />
                           <div className="flex justify-end">
                              <Button 
                                className="h-10 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                onClick={() => setIsEditingSummary(false)}
                              >
                                 Save Summary
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">
                           {summary}
                        </p>
                     )}
                  </div>
               </section>

               {/* Transcript Block */}
               <section className="space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/60">
                        <Activity className="h-4 w-4" />
                     </div>
                     <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Conversation Transcript</h3>
                  </div>

                  <div className="space-y-8">
                    {mockTranscript.map((msg, i) => (
                       <div 
                         key={i} 
                         className={cn(
                           "flex gap-6 animate-in slide-in-from-bottom-2 duration-400",
                           msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                         )}
                       >
                          <div className={cn(
                             "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border shadow-sm transition-all",
                             msg.role === 'assistant' 
                              ? "bg-muted/40 border-border/50 text-muted-foreground/60" 
                              : "bg-primary border-primary/20 text-primary-foreground shadow-lg shadow-primary/10"
                          )}>
                             {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                          </div>

                          <div className={cn(
                             "flex flex-col gap-2 max-w-[80%] pt-1",
                             msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                          )}>
                             <div className={cn(
                                "px-6 py-4 rounded-[28px] text-[15px] leading-relaxed tracking-tight break-words font-medium",
                                msg.role === 'assistant' 
                                  ? "bg-muted/10 border border-border/30 text-foreground rounded-tl-none" 
                                  : "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/5"
                             )}>
                                {msg.content}
                             </div>
                             <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest px-2">{msg.time}</span>
                          </div>
                       </div>
                    ))}
                  </div>
               </section>
            </div>
         </main>

         {/* 3. Right Sidebar (Caller & Metadata) */}
         <aside className="w-80 overflow-y-auto scrollbar-none flex flex-col shrink-0 bg-muted/5">
            <div className="p-8 space-y-10">
               
               {/* Profile Section */}
               <section className="space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Caller Profile</h4>
                  <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-background border border-border/40 shadow-sm">
                     <div className="h-20 w-20 rounded-[28px] bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-inner">
                        <Phone className="h-8 w-8" />
                     </div>
                     <span className="text-[18px] font-bold text-foreground tracking-tight">+1 (555) 123-4567</span>
                     <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest mt-1">San Francisco, CA</span>
                     
                     <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-border/50">
                        <div className="flex flex-col gap-1">
                           <span className="text-[13px] font-bold text-foreground">12</span>
                           <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Calls</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[13px] font-bold text-foreground">Mar 24</span>
                           <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">First Seen</span>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Meta Details */}
               <section className="space-y-6 pt-4 border-t border-border/50">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Metadata</h4>
                  <div className="space-y-4">
                     {[
                        { label: 'Date', value: 'Apr 03, 2024', icon: Calendar },
                        { label: 'Duration', value: '3m 42s', icon: Clock },
                        { label: 'Messages', value: '14 Total', icon: MessageSquare },
                        { label: 'Agent', value: 'Front Desk Assistant', icon: Bot },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <item.icon className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                              <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">{item.label}</span>
                           </div>
                           <span className="text-[12px] font-bold text-foreground/80">{item.value}</span>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Knowledge Snapshot */}
               <section className="space-y-6 pt-4 border-t border-border/50">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Knowledge used</h4>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 group hover:border-primary/20 transition-all shadow-sm">
                        <Database className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                        <span className="text-[12px] font-bold text-foreground/60 truncate">Company Benefits 2024</span>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 group hover:border-primary/20 transition-all shadow-sm opacity-60">
                        <Database className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[12px] font-bold text-foreground/60 truncate italic">Global Commons</span>
                     </div>
                  </div>
               </section>

            </div>
         </aside>

      </div>

    </div>
  )
}
