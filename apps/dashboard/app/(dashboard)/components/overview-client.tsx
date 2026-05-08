'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
} from '@aicaller/ui'
import { useUser } from '@/providers/user-provider'
import { MetricCard } from '@/components/ui/metric-card'
import { PageHeader } from '@/components/ui/page-header'

type BackendHealth = {
  service: string
  version: string
  environment: string
  uptime_seconds: number
  python: string
  platform: string
}

const quickActions = [
  {
    title: 'Create an agent',
    description: 'Build a voice assistant for calls, chat, or support workflows.',
    href: '/agents/new',
    icon: Bot,
  },
  {
    title: 'Add knowledge',
    description: 'Connect documents so agents can answer with workspace context.',
    href: '/knowledge-bases',
    icon: ShieldCheck,
  },
  {
    title: 'Review conversations',
    description: 'Audit recent call and chat history for quality signals.',
    href: '/call-history',
    icon: MessageSquare,
  },
]

export function OverviewClient() {
  const { profile, workspace, email } = useUser()
  const [mounted, setMounted] = useState(false)
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null)
  const [backendHealthError, setBackendHealthError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setBackendHealthError(null)

        const res = await fetch('https://api.iamspiderman.me/health/info', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error(`Health fetch failed: ${res.status}`)
        }

        const data = (await res.json()) as BackendHealth
        if (!cancelled) setBackendHealth(data)
      } catch (e) {
        if (cancelled) return
        setBackendHealth(null)
        setBackendHealthError(e instanceof Error ? e.message : 'Unknown error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const formatDate = (dateString?: string) => {
    if (!mounted || !dateString) return 'Pending'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateString))
    } catch {
      return 'Unavailable'
    }
  }

  const today = mounted
    ? new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(new Date())
    : 'Today'

  const formatUptime = (uptimeSeconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(uptimeSeconds))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const serviceStatus = backendHealth ? 'Online' : backendHealthError ? 'Offline' : 'Checking'

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background font-sans">
      <PageHeader
        title="Overview"
        description={workspace?.name ? `${workspace.name} workspace` : 'Workspace operations'}
        eyebrow={today}
        actions={
          <Button asChild size="sm" className="hidden h-8 gap-2 sm:inline-flex">
            <Link href="/agents/new">
              <Bot className="h-3.5 w-3.5" />
              New agent
            </Link>
          </Button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total calls"
              value="0"
              icon={PhoneCall}
              description="Last 7 days"
              trend={<span className="text-emerald-600 dark:text-emerald-400">0%</span>}
              tone="success"
            />
            <MetricCard
              label="Active chats"
              value="0"
              icon={MessageSquare}
              description="Live conversations"
            />
            <MetricCard
              label="Managed users"
              value="0"
              icon={Users}
              description="Workspace members"
              tone="warning"
            />
            <MetricCard
              label="Backend service"
              value={serviceStatus}
              icon={Activity}
              description={backendHealth ? `${backendHealth.service} v${backendHealth.version}` : backendHealthError ?? 'Fetching status'}
              trend={backendHealth ? `Up ${formatUptime(backendHealth.uptime_seconds)}` : undefined}
              tone={backendHealth ? 'success' : backendHealthError ? 'warning' : 'info'}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="rounded-xl border-border/70 bg-card shadow-sm">
              <CardHeader className="border-b border-border/70 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Workspace summary</CardTitle>
                    <CardDescription className="mt-1">
                      Account context, plan status, and service readiness.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="mr-1.5 h-3 w-3" />
                    Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
                  <InfoBlock label="Name" value={profile?.full_name || 'Loading'} />
                  <InfoBlock label="Email" value={email || 'Pending'} />
                  <InfoBlock label="Workspace" value={workspace?.name || 'Loading'} />
                </div>
                <div className="grid gap-4 border-t border-border/70 p-5 sm:grid-cols-3 sm:p-6">
                  <InfoPill label="Joined" value={formatDate(workspace?.created_at)} icon={Calendar} />
                  <InfoPill label="Plan" value="Free tier" icon={ShieldCheck} />
                  <InfoPill
                    label="Role"
                    value={profile?.is_admin ? 'Admin' : 'Member'}
                    icon={Users}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/70 bg-card shadow-sm">
              <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
                <CardTitle className="text-base font-semibold">Next actions</CardTitle>
                <CardDescription>Common setup steps for a production workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-3 sm:p-4">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">{action.title}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {action.description}
                        </span>
                      </span>
                      <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>
          </section>

          <Card className="rounded-xl border-border/70 bg-card shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Service details</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {backendHealth
                    ? `${backendHealth.environment} environment on ${backendHealth.platform} with Python ${backendHealth.python}`
                    : backendHealthError || 'Waiting for the health endpoint to respond.'}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full justify-center sm:w-auto">
                <a href="https://api.iamspiderman.me/health/info" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open status
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 p-5 sm:p-6">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function InfoPill({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border/70 bg-muted/20 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
