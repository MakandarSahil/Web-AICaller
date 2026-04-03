'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
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
  Textarea,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import {
  Plus,
  Phone,
  Globe,
  Copy,
  Check,
  MoreVertical,
  ShieldCheck,
  Server,
  Globe as GlobeIcon,
} from 'lucide-react'
import { useUser } from '@/providers/user-provider'
import {
  useCreatePhoneNumber,
  usePhoneNumbers,
  useUpdatePhoneNumber,
} from '@/hooks/use-phone-numbers'
import type { getAgents, getPhoneNumbers } from '@aicaller/supabase/queries'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgents>>>[number]
type PhoneNumberRow = NonNullable<Awaited<ReturnType<typeof getPhoneNumbers>>>[number]

type PhoneNumbersClientProps = {
  initialPhoneNumbers: PhoneNumberRow[]
  initialAgents: Agent[]
}

function defaultWebhookUrl(agentId: string) {
  return `https://api.callmind.com/voice?agent_id=${agentId}`
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
  const [activeTab, setActiveTab] = useState<'request' | 'own'>('request')

  // BYO form state
  const [number, setNumber] = useState('')
  const [agentId, setAgentId] = useState<string>('')
  const [providerSid, setProviderSid] = useState('')

  const selectableAgents = initialAgents ?? []

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

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">Phone Numbers</h1>
          <div className="h-4 w-[1px] bg-border/40 mx-1" />
          <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">
            Global Deployment
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 gap-2.5 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 active:scale-95">
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
              Add Number
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border/50 rounded-none p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
              <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">Provision Phone Number</DialogTitle>
              <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                Connect a dedicated line to start making and receiving AI automated voice calls.
              </p>
            </DialogHeader>

            <div className="p-8">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'request' | 'own')} className="w-full">
                <TabsList className="h-12 w-full bg-muted/20 border border-border/40 rounded-xl p-1 gap-1 mb-8">
                  <TabsTrigger
                    value="request"
                    className="flex-1 h-full rounded-lg font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2"
                  >
                    <GlobeIcon className="h-3.5 w-3.5" />
                    Request Platform Number
                  </TabsTrigger>
                  <TabsTrigger
                    value="own"
                    className="flex-1 h-full rounded-lg font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Bring Your Own
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Request flow
                    </Label>
                    <div className="rounded-none border border-border/40 bg-muted/5 p-6">
                      <p className="text-[12px] font-bold uppercase tracking-widest">Coming soon</p>
                      <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-2">
                        Platform numbers are assigned by the platform/admin. For now, use “Bring Your Own”.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="own" className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Phone Number (E.164)
                    </Label>
                    <Input
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="+15551234567"
                      className="h-12 bg-muted/10 border-border/50 rounded-none px-5 font-mono text-[14px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Assign Agent
                      </Label>
                      <Select value={agentId} onValueChange={setAgentId}>
                        <SelectTrigger className="h-12 bg-muted/10 border-border/50 rounded-none px-5 font-bold">
                          <SelectValue placeholder="Select Agent" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-border/50">
                          {selectableAgents.length === 0 ? (
                            <SelectItem value="__none__" disabled>
                              No agents available
                            </SelectItem>
                          ) : (
                            selectableAgents.map((a) => (
                              <SelectItem key={a.id} value={a.id} className="font-bold">
                                {a.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Provider SID (Optional)
                      </Label>
                      <Input
                        value={providerSid}
                        onChange={(e) => setProviderSid(e.target.value)}
                        placeholder="ACxxxxxxxx..."
                        className="h-12 bg-muted/10 border-border/50 rounded-none px-5 font-mono text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 border border-border/40 p-6 rounded-none space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                      <Server className="h-3 w-3 text-primary" />
                      Webhook Configuration
                    </h4>
                    <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
                      Set your provider's voice webhook to route calls to CallMind.
                    </p>
                    <div className="h-10 flex items-center justify-between px-4 rounded-none bg-background border border-border/50 font-mono text-[11px] text-primary/80 gap-3">
                      <span className="truncate">{webhookPreview}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => {
                          if (!agentId) return
                          handleCopy(defaultWebhookUrl(agentId), `webhook-${agentId}`)
                        }}
                        disabled={!agentId}
                      >
                        {copiedId === `webhook-${agentId}` ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground/20 hover:text-primary" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (!workspace) return
                      if (!agentId || !number.trim()) return

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
                    }}
                    disabled={creating || !workspace || !agentId || !number.trim()}
                    className="w-full h-12 rounded-none font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 active:scale-95 disabled:opacity-50"
                  >
                    {creating ? 'Saving...' : 'Verify & Save'}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-10 py-12 pb-40 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Numbers', value: String(stats.active), icon: Phone, color: 'text-primary' },
              { label: 'Platform Owned', value: String(stats.platform), icon: Globe, color: 'text-emerald-500' },
              { label: 'BYO Numbers', value: String(stats.own), icon: ShieldCheck, color: 'text-amber-500' },
              { label: 'Total Requests', value: '0', icon: Plus, color: 'text-muted-foreground' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-none border border-border/40 bg-muted/5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                  <stat.icon className={cn('h-4 w-4 opacity-40', stat.color)} />
                </div>
                <span className="text-[20px] font-bold tracking-tight text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>

          <section className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Assigned Infrastructure</h3>
              <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                Manage active lines and routing configurations for your agents.
              </p>
            </div>

            <div className="rounded-none border border-border/40 overflow-hidden bg-muted/5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/10">
                      <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Phone Number
                      </th>
                      <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Type
                      </th>
                      <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Assigned Agent
                      </th>
                      <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Webhook URL
                      </th>
                      <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Status
                      </th>
                      <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/20">
                    {phoneNumbers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="h-[240px] text-center">
                          <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-3">
                            <Phone className="h-8 w-8 text-muted-foreground" />
                            <p className="text-[11px] font-bold uppercase tracking-widest">No phone numbers yet</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      phoneNumbers.map((line) => (
                        <tr key={line.id} className="group hover:bg-muted/20 transition-colors">
                          <td className="py-6 px-8">
                            <span className="text-[14px] font-mono font-bold text-foreground tracking-tight">
                              {line.number}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <Badge
                              variant="outline"
                              className={cn(
                                'h-5 bg-background border-border text-[9px] font-bold uppercase tracking-widest',
                                line.number_type === 'platform' ? 'text-emerald-500' : 'text-amber-500'
                              )}
                            >
                              {line.number_type === 'platform' ? 'Platform' : 'BYO'}
                            </Badge>
                          </td>
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-none bg-primary/5 flex items-center justify-center text-primary/40 shrink-0">
                                <Server className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-[13px] font-bold text-foreground/80 truncate">
                                {line.agents?.name ?? '-'}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <button
                              onClick={() => {
                                const url = line.webhook_url ?? defaultWebhookUrl(line.agent_id)
                                handleCopy(url, line.id)
                              }}
                              className="flex items-center gap-2 group/copy px-3 py-1.5 rounded-none bg-background border border-border/40 hover:border-primary/20 transition-all overflow-hidden max-w-[160px]"
                            >
                              <span className="text-[10px] font-mono text-muted-foreground/30 truncate">
                                {line.webhook_url ?? defaultWebhookUrl(line.agent_id)}
                              </span>
                              {copiedId === line.id ? (
                                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground/20 group-hover/copy:text-primary shrink-0 transition-colors" />
                              )}
                            </button>
                          </td>
                          <td className="py-6 px-8">
                            <Switch
                              checked={line.is_active}
                              disabled={updating}
                              onCheckedChange={(checked) => {
                                updatePhoneNumber({
                                  id: line.id,
                                  isActive: checked,
                                })
                              }}
                              className="data-[state=checked]:bg-emerald-500 scale-90"
                            />
                          </td>
                          <td className="py-6 px-8 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-none opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground transition-all active:scale-95"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="text-[11px] text-muted-foreground/40 font-medium uppercase tracking-widest text-center">
            Platform number request is coming soon.
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

