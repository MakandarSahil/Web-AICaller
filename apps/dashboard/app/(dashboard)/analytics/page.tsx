'use client'

import React from 'react'
import { Card, CardContent } from '@aicaller/ui'
import { BarChart3, Clock3, MessageSquareText, Sparkles } from 'lucide-react'
import { useWorkspaceConversationAnalytics } from '@/hooks/use-analytics'

export default function AnalyticsPage() {
  const { data = [] } = useWorkspaceConversationAnalytics(30)

  const totalCalls = data.length
  const resolvedCalls = data.filter((row) => row.outcome === 'resolved').length
  const bookedCalls = data.filter((row) => row.outcome === 'booked').length
  const toolCalls = data.filter((row) => Boolean(row.conversations?.had_tool_call)).length

  const cards = [
    { label: 'Calls', value: totalCalls, icon: BarChart3 },
    { label: 'Resolved', value: resolvedCalls, icon: Sparkles },
    { label: 'Booked', value: bookedCalls, icon: Clock3 },
    { label: 'Tool Calls', value: toolCalls, icon: MessageSquareText },
  ]

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen overflow-hidden">
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">Analytics</h1>
          <div className="h-4 w-px bg-border/40" />
          <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">V2 kickoff</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-10 py-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label} className="rounded-2xl border-border/40 bg-background shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{card.label}</p>
                    <p className="text-2xl font-black tracking-tight text-foreground">{card.value}</p>
                  </div>
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="rounded-[28px] border-border/40 bg-background shadow-sm">
          <CardContent className="p-8 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">Next</h2>
            <p className="text-sm text-muted-foreground/80 max-w-2xl">
              This page is now wired to the new analytics query path. Next step is to replace these kickoff KPIs with chart data from conversation_analytics and turn_signals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
