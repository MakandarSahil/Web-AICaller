'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button, Badge } from '@aicaller/ui'
import { Phone, Copy, CheckCircle2, ChevronLeft, ExternalLink } from 'lucide-react'
import { useAgent } from '@/hooks/use-agents'
import { getFastApiBaseUrl, getVoiceWebhookUrl } from '@aicaller/api-client'

export default function AgentTalkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data: agent } = useAgent(id)
  const [copied, setCopied] = useState(false)

  const webhookUrl = useMemo(() => getVoiceWebhookUrl(id), [id])
  const apiBaseUrl = useMemo(() => getFastApiBaseUrl(), [])

  const copyWebhook = async () => {
    await navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" asChild className="gap-2">
            <Link href={`/agents/${id}`}>
              <ChevronLeft className="h-4 w-4" />
              Back to Agent
            </Link>
          </Button>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
            Twilio Voice Setup
          </Badge>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Talk With {agent?.name ?? 'Agent'}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Inbound phone calls are handled by Twilio, then routed to backend voice streaming at
                <span className="ml-1 font-medium text-foreground">{apiBaseUrl}</span>.
              </p>
            </div>
            <Phone className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Webhook URL</p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <code className="block overflow-x-auto rounded-md bg-background px-3 py-2 text-xs">{webhookUrl}</code>
              <Button onClick={copyWebhook} variant="outline" className="gap-2">
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <h2 className="text-sm font-semibold">1. Configure Twilio Number</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Set your Twilio Voice webhook to the URL above with method POST.
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <h2 className="text-sm font-semibold">2. Assign Number to Agent</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                In dashboard phone numbers, attach your number to this agent so calls route correctly.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/phone-numbers?agentId=${id}`}>
                Open Phone Numbers
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href={`${apiBaseUrl}/docs`} target="_blank" rel="noreferrer">
                Open Backend Docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/agents/${id}/chat`}>Test via Chat First</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
