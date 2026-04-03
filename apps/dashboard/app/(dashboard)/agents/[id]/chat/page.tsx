'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Send, 
  User, 
  ArrowLeft, 
  RefreshCw,
  Database,
  Activity,
  ChevronLeft
} from 'lucide-react'
import { 
  Button, 
  ScrollArea,
  Textarea,
  Badge
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'
import { useAgent } from '@/hooks/use-agents'
import { queryAgent } from '@/lib/fastapi'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data: agent } = useAgent(id)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [streaming, setStreaming] = useState(false)
  const [inputText, setInputText] = useState('')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streaming])

  const handleSend = async () => {
    if (!inputText.trim() || streaming) return

    const text = inputText.trim()
    setInputText('')
    
    // 1. Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setStreaming(true)
    
    // 2. Prepare assistant message placeholder
    let assistantResponse = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      await queryAgent(
        id,
        text,
        conversationId,
        (delta) => {
          assistantResponse += delta
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content: assistantResponse }
            return next
          })
        },
        (newId) => setConversationId(newId)
      )
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const resetChat = () => {
    setMessages([])
    setConversationId(undefined)
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* 1. Sidebar (Metadata) */}
      <aside className="w-80 border-r border-border bg-muted/5 flex flex-col shrink-0">
        <header className="h-16 px-6 border-b border-border flex items-center gap-3">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
              <Link href={`/agents/${id}`}>
                 <ChevronLeft className="h-4 w-4" />
              </Link>
           </Button>
           <span className="text-[14px] font-bold tracking-tight">Agent Sandbox</span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {/* Agent Profile info */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Bot className="h-5 w-5" />
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold truncate leading-none">{agent?.name || 'Loading...'}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{agent?.status || 'Active'}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Attached KBs */}
           <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">Attached Knowledge</h4>
              <div className="space-y-2">
                 {agent?.agent_knowledge_bases?.length ? (
                    agent.agent_knowledge_bases.map((link) => (
                       <div key={link.kb_id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 group">
                          <Database className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                          <span className="text-[12px] font-bold text-muted-foreground/80 truncate">
                            {link.knowledge_bases?.name ?? 'Untitled Source'}
                          </span>
                       </div>
                    ))
                 ) : (
                    <div className="py-6 px-4 rounded-xl border border-dashed border-border/60 text-center space-y-2">
                       <p className="text-[11px] font-medium text-muted-foreground/30 uppercase tracking-widest">No KBs attached.</p>
                       <Link href={`/agents/${id}?tab=knowledge`} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline decoration-primary/20">Manage KBs</Link>
                    </div>
                 )}
              </div>
           </div>

           {/* Sandbox Status */}
           <div className="pt-6 border-t border-border/50 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
                 <span>Latency (ms)</span>
                 <span className="text-foreground/60">~420ms</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
                 <span>Tokens/s</span>
                 <span className="text-foreground/60">~74.0</span>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-border">
           <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-background border-border/60 hover:bg-muted transition-all active:scale-95"
            onClick={resetChat}
           >
              <RefreshCw className="h-3.5 w-3.5 opacity-40" />
              New Conversation
           </Button>
        </div>
      </aside>

      {/* 2. Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
         
         <div className="flex-1 overflow-y-auto scrollbar-none px-6 md:px-20 pb-40" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-12 py-20 pt-16">
              
              {messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-[24px] bg-primary/5 flex items-center justify-center mb-8 border border-primary/5">
                       <Bot className="h-8 w-8 text-primary shadow-2xl" />
                    </div>
                    <h2 className="text-[18px] font-bold tracking-tight text-foreground/80">Test Your Agent</h2>
                    <p className="text-[12px] text-muted-foreground/40 mt-2 font-medium tracking-wide uppercase leading-relaxed max-w-sm">
                       Send a message below to start a conversation. You can monitor streaming responses and latency in real-time.
                    </p>
                 </div>
              )}

              {messages.map((msg, i) => (
                 <div 
                   key={i} 
                   className={cn(
                     "flex gap-6",
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
                          {msg.content || (streaming && i === messages.length - 1 ? "..." : "")}
                       </div>
                    </div>
                 </div>
              ))}

              {streaming && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex gap-6">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground/60">
                       <Bot className="h-5 w-5" />
                    </div>
                    <div className="px-6 py-4 rounded-[28px] bg-muted/10 border border-border/30 flex gap-1.5 items-center rounded-tl-none mt-1">
                       <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                       <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                       <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
              )}
            </div>
         </div>

         {/* Input Box Overlay */}
         <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
            <div className="max-w-3xl mx-auto w-full pointer-events-auto">
               <div className="relative group bg-background rounded-[32px] shadow-2xl shadow-black/40 border border-border p-2">
                  <Textarea 
                    placeholder="Type to chat..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={streaming}
                    className="h-16 max-h-48 min-h-16 pl-6 pr-20 bg-transparent border-none focus:ring-0 text-[15px] font-medium placeholder:text-muted-foreground/20 leading-relaxed py-5 resize-none scrollbar-none"
                  />
                  <div className="absolute right-3 bottom-3">
                     <Button 
                       size="icon" 
                       className="h-11 w-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/10 transition-all active:scale-95 disabled:opacity-20"
                       onClick={handleSend}
                       disabled={!inputText.trim() || streaming}
                     >
                        <Send className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
               <p className="text-center mt-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <Activity className="h-3 w-3 opacity-40" />
                  Streaming Sandbox Mode Active
               </p>
            </div>
         </div>

      </main>

    </div>
  )
}
