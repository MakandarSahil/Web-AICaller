'use client'

import React, { useMemo, useState } from 'react'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import { Activity, AlertCircle, Check, Copy, ExternalLink, Globe, Info, MoreVertical, Phone, Plus, Server, ShieldCheck, Trash2, XCircle } from 'lucide-react'
import { useUser } from '@/providers/user-provider'
import { useCreatePhoneNumber, useDeletePhoneNumber, usePhoneNumbers, useUpdatePhoneNumber } from '@/hooks/use-phone-numbers'
import { useTelephonyProviders, useConnectProvider, useDisconnectProvider, useWebhookInstructions, type ConnectProviderError } from '@/hooks/use-telephony-providers'
import { toast } from 'sonner'
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
  const { mutate: deletePhoneNumber, isPending: deleting } = useDeletePhoneNumber()
  
  // Telephony providers (BYO Twilio)
  const { data: providers = [], isLoading: providersLoading } = useTelephonyProviders()
  const { mutate: connectProvider, isPending: connecting } = useConnectProvider()
  const { mutate: disconnectProvider, isPending: disconnecting } = useDisconnectProvider()
  const { data: webhookInstructions } = useWebhookInstructions()

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'request' | 'own'>('own')
  const [number, setNumber] = useState('')
  const [agentId, setAgentId] = useState<string>('')
  const [providerSid, setProviderSid] = useState('')
  
  // Provider connection form state
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [providerName, setProviderName] = useState('')
  const [accountSid, setAccountSid] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [connectionError, setConnectionError] = useState<{type: string, message: string} | null>(null)
  
  // Delete confirmation state
  const [numberToDelete, setNumberToDelete] = useState<{id: string, number: string} | null>(null)
  
  // Country codes for phone number input
  const countryCodes = [
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  ]
  
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1')

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

  const isValidPhoneNumber = (phone: string): boolean => {
    // Validates local number part (7-15 digits)
    return /^\d{7,15}$/.test(phone.trim())
  }

  const handleCreate = () => {
    if (!workspace || !agentId || !number.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    const localNumber = number.trim().replace(/\D/g, '') // Remove non-digits
    
    if (!isValidPhoneNumber(localNumber)) {
      toast.error('Invalid phone number. Please enter 7-15 digits without spaces or dashes.')
      return
    }

    // Combine country code and local number
    const fullNumber = `${selectedCountryCode}${localNumber}`

    createPhoneNumber(
      {
        workspaceId: workspace.id,
        agentId,
        number: fullNumber,
        providerSid: providerSid.trim() ? providerSid.trim() : null,
      },
      {
        onSuccess: () => {
          setNumber('')
          setProviderSid('')
          setAgentId('')
          setSelectedCountryCode('+1')
          toast.success('Phone number added successfully!')
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to add phone number')
        }
      }
    )
  }
  
  const handleConnectProvider = () => {
    if (!providerName.trim() || !accountSid.trim() || !authToken.trim()) return
    
    setConnectionError(null)
    
    connectProvider(
      {
        provider: 'twilio',
        display_name: providerName.trim(),
        account_sid: accountSid.trim(),
        auth_token: authToken.trim(),
      },
      {
        onSuccess: () => {
          setShowConnectDialog(false)
          setProviderName('')
          setAccountSid('')
          setAuthToken('')
          setConnectionError(null)
          toast.success('Twilio account connected successfully!')
        },
        onError: (error: any) => {
          // Error is already in the format we defined in the hook
          setConnectionError({
            type: error.type || 'UNKNOWN',
            message: error.userMessage || 'Failed to connect provider. Please try again.'
          })
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
          <Dialog onOpenChange={(open) => {
            if (!open) {
              // Reset form when dialog closes
              setNumber('')
              setProviderSid('')
              setAgentId('')
              setSelectedCountryCode('+1')
              setActiveTab('own')
            }
          }}>
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
                      <Label>Phone Number <span className="text-red-500">*</span></Label>
                      <div className="flex gap-2">
                        <Select 
                          value={selectedCountryCode} 
                          onValueChange={setSelectedCountryCode}
                        >
                          <SelectTrigger className="w-[180px] h-10">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="mr-2">{country.flag}</span>
                                {country.code} ({country.country})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={number}
                          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="5551234567"
                          className="h-10 font-mono flex-1"
                          maxLength={15}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <strong>Full number:</strong> {selectedCountryCode}{number || '__________'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Examples: <code className="bg-muted px-1 rounded">+14155552671</code> (USA), <code className="bg-muted px-1 rounded">+447700900123</code> (UK), <code className="bg-muted px-1 rounded">+919876543210</code> (India)
                        </p>
                      </div>
                      {number && !/^\d{7,15}$/.test(number) && (
                        <Alert variant="destructive" className="mt-2 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Invalid phone number. Please enter 7-15 digits (numbers only, no spaces or dashes).
                          </AlertDescription>
                        </Alert>
                      )}
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
            <MetricCard label="Connected providers" value={providers.length.toString()} icon={Server} description="Twilio accounts" tone="info" />
          </section>
          
          {/* Telephony Providers Section */}
          <section className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-5 sm:p-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Telephony Providers</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect your own Twilio account to use your own phone numbers.
                </p>
              </div>
              <Button 
                onClick={() => setShowConnectDialog(true)} 
                variant="outline" 
                className="h-9 gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Connect Twilio
              </Button>
            </div>
            
            <div className="p-5 sm:p-6">
              {providersLoading ? (
                <div className="text-sm text-muted-foreground">Loading providers...</div>
              ) : providers.length === 0 ? (
                <EmptyState
                  icon={Server}
                  title="No connected providers"
                  description="Connect your Twilio account to use your own phone numbers with CallMind."
                  className="min-h-[180px]"
                />
              ) : (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <Card key={provider.id} className="border-border/70">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Server className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-sm font-semibold">{provider.display_name}</CardTitle>
                              <CardDescription className="text-xs capitalize">{provider.provider}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {provider.is_verified && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => disconnectProvider(provider.id)}
                              disabled={disconnecting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Webhook Instructions */}
              {webhookInstructions && (
                <div className="mt-6">
                  <Alert className="border-blue-500/20 bg-blue-500/10 text-blue-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <p className="font-medium mb-2">Webhook Configuration Required</p>
                      <p className="mb-2">After connecting your provider, configure your Twilio number webhook:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        {webhookInstructions.instructions.slice(0, 4).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                        <li>
                          URL: <code className="bg-blue-100 px-1 rounded">{webhookInstructions.webhook_url_template.replace('{agent_id}', 'YOUR_AGENT_ID')}</code>
                        </li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
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
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setNumberToDelete({id: line.id, number: line.number})}
                              disabled={deleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
      
      {/* Connect Provider Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Twilio Account</DialogTitle>
            <DialogDescription>
              Enter your Twilio credentials to connect your own phone numbers. Credentials are stored securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Error Display */}
            {connectionError && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-50/50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm text-red-700">
                  <p className="font-medium mb-1">
                    {connectionError.type === 'INVALID_CREDENTIALS' && 'Invalid Credentials'}
                    {connectionError.type === 'ENCRYPTION_ERROR' && 'Server Configuration Error'}
                    {connectionError.type === 'SERVER_ERROR' && 'Server Error'}
                    {connectionError.type === 'UNKNOWN' && 'Connection Failed'}
                  </p>
                  <p className="text-red-600/80">{connectionError.message}</p>
                  {connectionError.type === 'INVALID_CREDENTIALS' && (
                    <div className="mt-3 text-xs text-red-600/70 bg-red-100/50 p-2 rounded">
                      <p className="font-medium">How to fix:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>Log in to <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">Twilio Console</a></li>
                        <li>Go to Account → API keys & tokens</li>
                        <li>Copy your Account SID (starts with AC...)</li>
                        <li>Copy your Auth Token (click 'Show')</li>
                        <li>Paste both values exactly (no extra spaces)</li>
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="provider-name">Display Name</Label>
              <Input
                id="provider-name"
                value={providerName}
                onChange={(e) => {
                  setProviderName(e.target.value)
                  if (connectionError) setConnectionError(null)
                }}
                placeholder="My Twilio Account"
              />
              <p className="text-xs text-muted-foreground">A friendly name to identify this connection</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-sid">Account SID</Label>
              <Input
                id="account-sid"
                value={accountSid}
                onChange={(e) => {
                  setAccountSid(e.target.value)
                  if (connectionError) setConnectionError(null)
                }}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Find this in your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Twilio Console</a> → Account → API keys & tokens
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="auth-token">Auth Token</Label>
              <Input
                id="auth-token"
                type="password"
                value={authToken}
                onChange={(e) => {
                  setAuthToken(e.target.value)
                  if (connectionError) setConnectionError(null)
                }}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="font-mono"
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Stored encrypted with AES-128. Never shown again.</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConnectDialog(false)
                setConnectionError(null)
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnectProvider}
              disabled={connecting || !providerName.trim() || !accountSid.trim() || !authToken.trim()}
            >
              {connecting ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Connect Twilio'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!numberToDelete} 
        onOpenChange={(open) => !open && setNumberToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Phone Number
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong className="font-mono text-foreground">{numberToDelete?.number}</strong>?
              <br /><br />
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Stop routing calls to this number</li>
                <li>Remove the number from your workspace</li>
                <li>Delete associated configuration</li>
              </ul>
              <p className="mt-3 text-sm text-destructive/80">
                This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setNumberToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (numberToDelete) {
                  deletePhoneNumber(numberToDelete.id, {
                    onSuccess: () => {
                      toast.success('Phone number deleted successfully')
                      setNumberToDelete(null)
                    },
                    onError: () => {
                      toast.error('Failed to delete phone number')
                    }
                  })
                }
              }}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Number'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
