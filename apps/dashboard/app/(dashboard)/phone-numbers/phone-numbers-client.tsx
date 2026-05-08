'use client'

import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import { Check, Copy, Globe, MoreVertical, Phone, Plus, Server, ShieldCheck } from 'lucide-react'
import { useUser } from '@/providers/user-provider'
import { useCreatePhoneNumber, usePhoneNumbers, useUpdatePhoneNumber } from '@/hooks/use-phone-numbers'
import type { getAgents, getPhoneNumbers } from '@aicaller/supabase/queries'
import { getVoiceWebhookUrl } from '@aicaller/api-client'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricCard } from '@/components/ui/metric-card'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgents>>>[number]
type PhoneNumberRow = NonNullable<Awaited<ReturnType<typeof getPhoneNumbers>>>[number]

type PhoneNumbersClientProps = {
  initialPhoneNumbers: PhoneNumberRow[]
  initialAgents: Agent[]
}

function defaultWebhookUrl(agentId: string) {
  return getVoiceWebhookUrl(agentId)
}

export default function PhoneNumbersClient({
  initialPhoneNumbers,
  initialAgents,
}: PhoneNumbersClientProps) {
  const { workspace } = useUser()
  const { data: phoneNumbers = initialPhoneNumbers } = usePhoneNumbers(initialPhoneNumbers)
  const { mutate: createPhoneNumber, isPending: creating } = useCreatePhoneNumber()
  const { mutate: updatePhoneNumber, isPending: updating } = useUpdatePhoneNumber()

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'request' | 'own'>('own')
  const [number, setNumber] = useState('')
  const [agentId, setAgentId] = useState<string>('')
  const [providerSid, setProviderSid] = useState('')

  const webhookPreview = useMemo(() => {
    if (!agentId) return 'Select an agent to generate webhook URL.'
    return defaultWebhookUrl(agentId)
  }, [agentId])

  const stats = useMemo(() => {
    const active = phoneNumbers.filter((p) => p.is_active).length
    const platform = phoneNumbers.filter((p) => p.number_type === 'platform').length
    const own = phoneNumbers.filter((p) => p.number_type === 'own').length
    return { active, platform, own }
  }, [phoneNumbers])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreate = () => {
    if (!workspace || !agentId || !number.trim()) return

    createPhoneNumber(
      {
        workspaceId: workspace.id,
        agentId,
        number: number.trim(),
        providerSid: providerSid.trim() ? providerSid.trim() : null,
      },
      {
        onSuccess: () => {
          setNumber('')
          setProviderSid('')
          setAgentId('')
        },
      }
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-background font-sans">
      <PageHeader
        title="Phone numbers"
        description="Manage voice routing and provider webhooks"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-2">
                <Plus className="h-3.5 w-3.5" />
                Add number
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-hidden rounded-xl border-border/70 bg-card p-0">
              <DialogHeader className="border-b border-border/70 bg-muted/20 p-6 text-left">
                <DialogTitle className="text-base font-semibold">Add phone number</DialogTitle>
                <DialogDescription>
                  Connect a dedicated line to route calls into a CallMind agent.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'request' | 'own')} className="w-full">
                  <TabsList className="mb-6 grid h-10 w-full grid-cols-2 rounded-lg border border-border/70 bg-muted/30 p-1">
                    <TabsTrigger value="request" className="rounded-md text-sm">
                      <Globe className="h-3.5 w-3.5" />
                      Platform
                    </TabsTrigger>
                    <TabsTrigger value="own" className="rounded-md text-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Bring your own
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="request">
                    <EmptyState
                      icon={Globe}
                      title="Platform numbers are coming soon"
                      description="For now, connect your own Twilio number and point the voice webhook to CallMind."
                      className="min-h-[220px]"
                    />
                  </TabsContent>

                  <TabsContent value="own" className="space-y-5">
                    <div className="space-y-2">
                      <Label>Phone number</Label>
                      <Input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="+15551234567"
                        className="h-10 font-mono"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Assign agent</Label>
                        <Select value={agentId} onValueChange={setAgentId}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {initialAgents.length === 0 ? (
                              <SelectItem value="__none__" disabled>
                                No agents available
                              </SelectItem>
                            ) : (
                              initialAgents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Provider SID</Label>
                        <Input
                          value={providerSid}
                          onChange={(e) => setProviderSid(e.target.value)}
                          placeholder="ACxxxxxxxx..."
                          className="h-10 font-mono"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Server className="h-4 w-4 text-primary" />
                        Webhook URL
                      </div>
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                          {webhookPreview}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            if (!agentId) return
                            handleCopy(defaultWebhookUrl(agentId), `webhook-${agentId}`)
                          }}
                          disabled={!agentId}
                        >
                          {copiedId === `webhook-${agentId}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreate}
                      disabled={creating || !workspace || !agentId || !number.trim()}
                      className="h-10 w-full"
                    >
                      {creating ? 'Saving...' : 'Save number'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active numbers" value={stats.active} icon={Phone} description="Ready to receive calls" />
            <MetricCard label="Platform owned" value={stats.platform} icon={Globe} description="Assigned by CallMind" tone="success" />
            <MetricCard label="BYO numbers" value={stats.own} icon={ShieldCheck} description="Connected provider lines" tone="warning" />
            <MetricCard label="Requests" value="0" icon={Plus} description="Pending provisioning" tone="info" />
          </section>

          <section className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">Assigned infrastructure</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Active lines and routing configuration for workspace agents.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/20">
                    {['Phone number', 'Type', 'Assigned agent', 'Webhook URL', 'Status', 'Actions'].map((heading) => (
                      <th
                        key={heading}
                        className={cn(
                          'px-5 py-3 text-left text-xs font-medium text-muted-foreground',
                          heading === 'Actions' && 'text-right'
                        )}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {phoneNumbers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6">
                        <EmptyState
                          icon={Phone}
                          title="No phone numbers yet"
                          description="Add a phone number to start routing live calls to an agent."
                          className="min-h-[240px]"
                        />
                      </td>
                    </tr>
                  ) : (
                    phoneNumbers.map((line) => (
                      <tr key={line.id} className="group transition-colors hover:bg-muted/20">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-semibold text-foreground">{line.number}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge tone={line.number_type === 'platform' ? 'success' : 'warning'}>
                            {line.number_type === 'platform' ? 'Platform' : 'BYO'}
                          </StatusBadge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Server className="h-4 w-4" />
                            </div>
                            <span className="truncate text-sm font-medium text-foreground">
                              {line.agents?.name ?? '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              const url = line.webhook_url ?? defaultWebhookUrl(line.agent_id)
                              handleCopy(url, line.id)
                            }}
                            className="flex max-w-[220px] items-center gap-2 overflow-hidden rounded-lg border border-border/70 bg-background px-3 py-1.5 transition-colors hover:border-primary/30"
                          >
                            <span className="truncate font-mono text-xs text-muted-foreground">
                              {line.webhook_url ?? defaultWebhookUrl(line.agent_id)}
                            </span>
                            {copiedId === line.id ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <Switch
                            checked={line.is_active}
                            disabled={updating}
                            onCheckedChange={(checked) => {
                              updatePhoneNumber({ id: line.id, isActive: checked })
                            }}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
