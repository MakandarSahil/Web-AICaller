'use client'

import { useState } from 'react'
import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function AgentChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')

    // Dummy response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'This is a placeholder response from the agent.' },
      ])
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Test Agent Chat</h1>
        <p className="text-muted-foreground">Test conversation with agent {params.id}</p>
      </div>

      <Card className="flex flex-col h-96 bg-card border border-border/40">
        <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4 pt-6">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground/70">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary/80 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </CardContent>

        <CardContent className="pt-4 border-t border-border/40">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="bg-muted/30 border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <Button onClick={handleSend} className="bg-brand-500 hover:bg-brand-600 text-white">Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
