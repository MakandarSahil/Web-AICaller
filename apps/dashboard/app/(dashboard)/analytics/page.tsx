'use client'

import React from 'react'
import { BarChart3, Clock3, MessageSquareText, Sparkles } from 'lucide-react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aicaller/ui'
import { useWorkspaceConversationAnalytics } from '@/hooks/use-analytics'
import { MetricCard } from '@/components/ui/metric-card'
import { PageHeader } from '@/components/ui/page-header'

export default function AnalyticsPage() {
  const { data = [] } = useWorkspaceConversationAnalytics(30)

  const totalCalls = data.length
  const resolvedCalls = data.filter((row) => row.outcome === 'resolved').length
  const bookedCalls = data.filter((row) => row.outcome === 'booked').length
  const toolCalls = data.filter((row) => Boolean(row.conversations?.had_tool_call)).length
  const resolutionRate = totalCalls > 0 ? Math.round((resolvedCalls / totalCalls) * 100) : 0

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <PageHeader
        title="Analytics"
        description="Conversation outcomes across the last 30 days"
        eyebrow="30 days"
        actions={
          <Badge variant="outline" className="hidden border-border/70 bg-muted/40 text-muted-foreground sm:inline-flex">
            Reporting v2
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Calls"
              value={totalCalls}
              icon={BarChart3}
              description="Tracked conversations"
              tone="info"
            />
            <MetricCard
              label="Resolved"
              value={resolvedCalls}
              icon={Sparkles}
              description="Successful outcomes"
              trend={`${resolutionRate}%`}
              tone="success"
            />
            <MetricCard
              label="Booked"
              value={bookedCalls}
              icon={Clock3}
              description="Meetings or callbacks"
              tone="warning"
            />
            <MetricCard
              label="Tool calls"
              value={toolCalls}
              icon={MessageSquareText}
              description="Automation used"
            />
          </section>

          <Card className="rounded-xl border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b border-border/70 p-5 sm:p-6">
              <CardTitle className="text-base font-semibold">Conversation performance</CardTitle>
              <CardDescription>
                The query path is connected. Add chart series here when turn-level analytics are ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <Insight label="Resolution rate" value={`${resolutionRate}%`} />
              <Insight label="Booking rate" value={totalCalls > 0 ? `${Math.round((bookedCalls / totalCalls) * 100)}%` : '0%'} />
              <Insight label="Automation rate" value={totalCalls > 0 ? `${Math.round((toolCalls / totalCalls) * 100)}%` : '0%'} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  )
}
