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
        <h1 className="text-3xl font-bold text-white">Test Agent Chat</h1>
        <p className="text-slate-400">Test conversation with agent {params.id}</p>
      </div>

      <Card className="flex flex-col h-96 bg-slate-800">
        <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4 pt-6">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </CardContent>

        <CardContent className="pt-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="bg-slate-700 border-slate-600"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
