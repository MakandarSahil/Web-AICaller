'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, ChevronLeft, Database, RefreshCw, Send, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button, Textarea } from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'

import { useAgent } from '@/hooks/use-agents'
import { queryAgent } from '@/lib/fastapi'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

function createMessageId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export default function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data: agent } = useAgent(id)

  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [streaming, setStreaming] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const pendingAssistantRef = useRef('')
  const flushFrameRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const kbCount = agent?.agent_knowledge_bases?.length ?? 0

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!scrollRef.current) {
      return
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, streaming])

  useEffect(() => {
    return () => {
      if (flushFrameRef.current !== null) {
        cancelAnimationFrame(flushFrameRef.current)
      }
    }
  }, [])

  const isSendDisabled = useMemo(() => {
    return streaming || !inputText.trim()
  }, [inputText, streaming])

  const handleSend = async () => {
    if (isSendDisabled) {
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    pendingAssistantRef.current = ''
    if (flushFrameRef.current !== null) {
      cancelAnimationFrame(flushFrameRef.current)
      flushFrameRef.current = null
    }

    const text = inputText.trim()
    const userId = createMessageId('user')
    const assistantId = createMessageId('assistant')

    setInputText('')
    setStreaming(true)

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', content: text },
      { id: assistantId, role: 'assistant', content: '' },
    ])

    try {
      await queryAgent(
        id,
        text,
        conversationId,
        (delta) => {
          pendingAssistantRef.current += delta

          if (flushFrameRef.current !== null) {
            return
          }

          flushFrameRef.current = window.requestAnimationFrame(() => {
            flushFrameRef.current = null
            const chunk = pendingAssistantRef.current
            pendingAssistantRef.current = ''

            if (!chunk) {
              return
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
              )
            )
          })
        },
        (newId) => setConversationId(newId),
        { signal: abortRef.current.signal }
      )
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Chat error:', err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        
        // Update the assistant message to show the error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId 
              ? { ...msg, content: `Error: ${errorMessage}. Please check if the backend is running.`, error: true } 
              : msg
          )
        )
        
        toast.error('Failed to get a response from the agent.')
      }
    } finally {
      if (flushFrameRef.current !== null) {
        cancelAnimationFrame(flushFrameRef.current)
        flushFrameRef.current = null
      }

      if (pendingAssistantRef.current) {
        const chunk = pendingAssistantRef.current
        pendingAssistantRef.current = ''
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
          )
        )
      }

      setStreaming(false)
      abortRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const resetChat = () => {
    setMessages([])
    setConversationId(undefined)
    abortRef.current?.abort()
    setStreaming(false)
  }

  return (
    <div className="h-dvh bg-background">
      <div className="mx-auto flex h-full max-w-7xl">
        <main className="relative flex min-w-0 flex-1 flex-col border-x border-border/60 bg-background">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 px-3 py-2 backdrop-blur sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/agents/${id}`}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-none sm:text-base">
                    {agent?.name ?? 'Agent Chat'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {streaming ? 'Streaming response...' : 'Ready'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs sm:px-3"
                  onClick={() => setShowDetails((prev) => !prev)}
                >
                  <Database className="mr-1 h-3.5 w-3.5" />
                  KB ({kbCount})
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs sm:px-3" onClick={resetChat}>
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  New
                </Button>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-36 pt-4 sm:px-5 sm:pt-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
              {messages.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed border-border/80 p-6 text-center sm:mt-16">
                  <Bot className="mx-auto mb-3 h-8 w-8 text-primary/70" />
                  <p className="text-sm font-medium">Start a quick conversation</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lightweight chat mode. No sandbox panel, just real-time agent chat.
                  </p>
                </div>
              ) : null}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex w-full items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' ? (
                    <div className="mb-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 sm:flex">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      'max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed sm:max-w-[80%] sm:px-4 sm:py-2.5',
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : cn(
                            'rounded-bl-sm border border-border/70 bg-muted/30 text-foreground',
                            msg.error && 'border-destructive/50 bg-destructive/10 text-destructive'
                          )
                    )}
                  >
                    {msg.content || (streaming && msg.role === 'assistant' ? '...' : '')}
                  </div>

                  {msg.role === 'user' ? (
                    <div className="mb-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground sm:flex">
                      <User className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur sm:px-5">
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative">
                <Textarea
                  placeholder="Ask your agent..."
                  value={inputText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={streaming}
                  className="min-h-12 resize-none rounded-xl border-border/70 pr-12 text-sm"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8"
                  onClick={() => {
                    void handleSend()
                  }}
                  disabled={isSendDisabled}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 px-1 text-[11px] text-muted-foreground">Enter to send, Shift+Enter for newline.</p>
            </div>
          </div>
        </main>

        <aside
          className={cn(
            'fixed inset-y-0 right-0 z-30 w-[85vw] max-w-sm border-l border-border bg-background p-4 transition-transform duration-200 lg:static lg:z-auto lg:w-80 lg:translate-x-0',
            showDetails ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Attached Knowledge</h2>
            <Button variant="ghost" size="sm" className="h-8 px-2 lg:hidden" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1">
            {agent?.agent_knowledge_bases?.length ? (
              agent.agent_knowledge_bases.map((link) => (
                <div key={link.kb_id} className="rounded-xl border border-border/70 p-3">
                  <p className="truncate text-sm font-medium">{link.knowledge_bases?.name ?? 'Untitled Source'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">KB ID: {link.kb_id}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 p-4 text-center">
                <p className="text-xs text-muted-foreground">No KB attached yet.</p>
                <Link href={`/agents/${id}?tab=knowledge`} className="mt-2 inline-block text-xs font-medium text-primary">
                  Attach KB
                </Link>
              </div>
            )}
          </div>
        </aside>

        {showDetails ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/35 lg:hidden"
            onClick={() => setShowDetails(false)}
            aria-label="Close knowledge sidebar"
          />
        ) : null}
      </div>
    </div>
  )
}
