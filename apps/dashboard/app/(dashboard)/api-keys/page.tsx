'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Skeleton,
  Tabs,
  TabsContent,
  Textarea,
} from '@aicaller/ui'
import { Activity, Check, Copy, Key, Lock, Plus, ShieldAlert, Trash2, Zap, AlertCircle, Code, Terminal, Globe, BookOpen, Play, Send, Loader2 } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/use-api-keys'
import { useAgents } from '@/hooks/use-agents'
import { formatDistanceToNow } from '@/lib/date'
import { getFastApiBaseUrl } from '@aicaller/api-client'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'

type CodeLanguage = 'curl' | 'javascript' | 'python'

const CODE_TEMPLATES: Record<CodeLanguage, (apiKey: string, agentId: string, message: string) => string> = {
  curl: (apiKey, agentId, message) => `curl -X POST ${getFastApiBaseUrl()}/query \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiKey}" \\
  -d '{
    "agent_id": "${agentId}",
    "text": "${message}",
    "stream": true
  }'`,

  javascript: (apiKey, agentId, message) => `const response = await fetch('${getFastApiBaseUrl()}/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '${apiKey}'
  },
  body: JSON.stringify({
    agent_id: '${agentId}',
    text: '${message}',
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const lines = decoder.decode(value).split('\\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;
      const parsed = JSON.parse(data);
      console.log(parsed.delta); // Streamed text chunk
    }
  }
}`,

  python: (apiKey, agentId, message) => `import requests
import json

response = requests.post(
    '${getFastApiBaseUrl()}/query',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': '${apiKey}'
    },
    json={
        'agent_id': '${agentId}',
        'text': '${message}',
        'stream': True
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        decoded = line.decode('utf-8')
        if decoded.startswith('data: '):
            data = decoded[6:]
            if data == '[DONE]':
                continue
            parsed = json.loads(data)
            print(parsed.get('delta', ''), end='', flush=True)`,
}

export default function ApiKeysPage() {
  const { data: apiKeys, isLoading: isLoadingKeys, error: keysError } = useApiKeys()
  const { data: agents, isLoading: isLoadingAgents } = useAgents()
  const createKeyMutation = useCreateApiKey()
  const revokeKeyMutation = useRevokeApiKey()

  const [activeTab, setActiveTab] = useState<'keys' | 'usage'>('keys')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [keyName, setKeyName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null)
  
  // API Usage tab state
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('curl')
  const [demoMessage, setDemoMessage] = useState('Hello, what are your business hours?')
  const [demoResponse, setDemoResponse] = useState('')
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [testApiKey, setTestApiKey] = useState('')

  const tabs = [
    { id: 'keys', label: 'My Keys', icon: Key },
    { id: 'usage', label: 'API Usage & Demo', icon: Code },
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerateKey = async () => {
    if (!keyName.trim()) return
    try {
      const result = await createKeyMutation.mutateAsync(keyName.trim())
      setNewKey(result.key)
      setKeyName('')
    } catch {}
  }

  const handleRevoke = async (id: string) => {
    try {
      await revokeKeyMutation.mutateAsync(id)
      setKeyToRevoke(null)
    } catch {}
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setNewKey(null)
      setKeyName('')
      createKeyMutation.reset()
    }
  }

  const handleRunDemo = async () => {
    if (!selectedAgent || !testApiKey.trim()) return
    
    setIsDemoLoading(true)
    setDemoResponse('')

    try {
      const response = await fetch(`${getFastApiBaseUrl()}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': testApiKey.trim(),
        },
        body: JSON.stringify({
          agent_id: selectedAgent,
          text: demoMessage,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      // Read the SSE stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const lines = decoder.decode(value).split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.delta) {
                  fullResponse += parsed.delta
                  setDemoResponse(fullResponse)
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      setDemoResponse(`Error: ${error instanceof Error ? error.message : 'Failed to send request'}`)
    } finally {
      setIsDemoLoading(false)
    }
  }

  const activeKeys = apiKeys?.filter(k => k.is_active) ?? []
  const revokedKeys = apiKeys?.filter(k => !k.is_active) ?? []
  const selectedKeyData = activeKeys.find(k => k.id === selectedApiKey)
  const selectedAgentData = agents?.find(a => a.id === selectedAgent)

  const generatedCode = selectedKeyData && selectedAgentData 
    ? CODE_TEMPLATES[codeLanguage](selectedKeyData.key_prefix + '...', selectedAgentData.id, demoMessage)
    : CODE_TEMPLATES[codeLanguage]('cm_live_your_api_key_here', 'your-agent-uuid-here', demoMessage)

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden bg-background font-sans">
      {/* Header - Matching Agent/KB Design */}
      <header className="px-4 md:px-10 border-b border-border bg-background sticky top-0 z-50 transition-colors py-2 md:py-0 h-auto md:h-28">
        
        {/* Top Row: Info & Actions */}
        <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between gap-4 py-2 md:py-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <ContextualSidebarToggleButton className="mr-1 shrink-0" />
            
            <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-2">
                  <h1 className="text-[18px] md:text-[20px] font-bold text-foreground tracking-tight truncate leading-none">
                    API Keys
                  </h1>
                  <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/20">Integration</Badge>
               </div>
               <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="text-[11px] font-medium text-muted-foreground">
                    Manage API keys and access integration guides
                 </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-10 px-5 rounded-xl font-bold text-[12px] gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Generate Key</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>New API key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for external integrations.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {!newKey ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Key name</Label>
                        <Input
                          id="key-name"
                          placeholder="e.g. Website chatbot"
                          value={keyName}
                          onChange={(e) => setKeyName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleGenerateKey()}
                        />
                      </div>

                      {createKeyMutation.isError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>
                            Failed to create API key. Please try again.
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        className="w-full" 
                        onClick={handleGenerateKey}
                        disabled={!keyName.trim() || createKeyMutation.isPending}
                      >
                        {createKeyMutation.isPending ? (
                          <>
                            <Activity className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate API key'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Alert className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Store this key now</AlertTitle>
                        <AlertDescription>
                          This key is shown once. If lost, you'll need to create a new one.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <Label>Your API key</Label>
                        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                          <code className="flex-1 truncate font-mono text-sm text-primary">{newKey}</code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 shrink-0" 
                            onClick={() => newKey && handleCopy(newKey, 'new')}
                          >
                            {copiedId === 'new' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        onClick={() => handleDialogClose(false)}
                      >
                        I saved this key
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bottom Row: Tab Navigation */}
        <div className="flex items-center gap-2 h-12">
            <nav className="flex items-center h-full px-1">
              {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'keys' | 'usage')}
                      className={cn(
                        "relative h-12 px-5 flex items-center gap-2.5 transition-all group border-b-2 border-transparent",
                        isActive 
                          ? "text-foreground font-bold border-primary" 
                          : "text-muted-foreground/60 hover:text-foreground font-medium"
                      )}
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-opacity",
                        isActive ? "opacity-100 text-primary" : "opacity-40 group-hover:opacity-100"
                      )} />
                      <span className="text-[12px] tracking-tight">{tab.label}</span>
                    </button>
                  )
              })}
            </nav>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="max-w-5xl mx-auto px-10 py-12 pb-40">
            
            {/* KEYS TAB */}
            {activeTab === 'keys' && (
              <div className="space-y-6">
                {keysError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error loading API keys</AlertTitle>
                    <AlertDescription>
                      Failed to load your API keys. Please refresh the page.
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Active credentials</CardTitle>
                    <CardDescription>
                      Your workspace API keys for external integrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead>
                          <tr className="border-b border-border/70 text-left text-xs font-medium text-muted-foreground">
                            <th className="pb-3 pl-0 pr-4">Name</th>
                            <th className="pb-3 px-4">Key prefix</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 px-4">Created</th>
                            <th className="pb-3 px-4">Last used</th>
                            <th className="pb-3 pl-4 pr-0 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/70">
                          {isLoadingKeys ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <tr key={i}>
                                <td className="py-4"><Skeleton className="h-4 w-32" /></td>
                                <td className="py-4"><Skeleton className="h-4 w-28" /></td>
                                <td className="py-4"><Skeleton className="h-5 w-16" /></td>
                                <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="py-4 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
                              </tr>
                            ))
                          ) : activeKeys.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Key className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">No API keys yet</p>
                                    <p className="text-sm text-muted-foreground">
                                      Create your first key to start integrating.
                                    </p>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setIsDialogOpen(true)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create API key
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            activeKeys.map((key) => (
                              <tr key={key.id} className="group">
                                <td className="py-4 pl-0 pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                      <Key className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{key.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(key.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                                      {key.key_prefix}...
                                    </code>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7" 
                                      onClick={() => handleCopy(key.key_prefix, key.id)}
                                    >
                                      {copiedId === key.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Active
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-sm text-muted-foreground">
                                  {new Date(key.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 text-sm text-muted-foreground">
                                  {key.last_used_at ? formatDistanceToNow(key.last_used_at) : 'Never'}
                                </td>
                                <td className="py-4 pl-4 pr-0 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => setKeyToRevoke(key.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {revokedKeys.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Revoked keys</CardTitle>
                      <CardDescription>These keys no longer work.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border/70 text-left text-xs font-medium text-muted-foreground">
                              <th className="pb-3 pl-0 pr-4">Name</th>
                              <th className="pb-3 px-4">Key prefix</th>
                              <th className="pb-3 px-4">Status</th>
                              <th className="pb-3 px-4">Created</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/70 opacity-60">
                            {revokedKeys.map((key) => (
                              <tr key={key.id}>
                                <td className="py-4 pl-0 pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                      <Key className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{key.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{key.key_prefix}...</code>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge variant="outline">Revoked</Badge>
                                </td>
                                <td className="px-4 py-4 text-sm text-muted-foreground">
                                  {new Date(key.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* USAGE TAB */}
            {activeTab === 'usage' && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Configuration Panel */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Integration Setup
                      </CardTitle>
                      <CardDescription>
                        Select your API key and agent to generate working code examples.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* API Key Selector */}
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        {isLoadingKeys ? (
                          <Skeleton className="h-10 w-full" />
                        ) : activeKeys.length === 0 ? (
                          <Alert className="border-amber-500/20 bg-amber-500/10">
                            <AlertCircle className="h-4 w-4 text-amber-700" />
                            <AlertDescription className="text-amber-700">
                              No active API keys. <button onClick={() => {setActiveTab('keys'); setIsDialogOpen(true);}} className="font-medium underline">Create one first</button>.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedApiKey || ''}
                            onChange={(e) => setSelectedApiKey(e.target.value || null)}
                          >
                            <option value="">Select an API key</option>
                            {activeKeys.map((key) => (
                              <option key={key.id} value={key.id}>
                                {key.name} ({key.key_prefix}...)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Agent Selector */}
                      <div className="space-y-2">
                        <Label>Agent</Label>
                        {isLoadingAgents ? (
                          <Skeleton className="h-10 w-full" />
                        ) : agents?.length === 0 ? (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              No agents found. <Link href="/agents/new" className="font-medium underline">Create an agent first</Link>.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedAgent || ''}
                            onChange={(e) => setSelectedAgent(e.target.value || null)}
                          >
                            <option value="">Select an agent</option>
                            {agents?.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Integration Values Display */}
                      {selectedKeyData && selectedAgentData && (
                        <div className="rounded-lg border border-border/70 bg-muted/30 p-4 space-y-3">
                          <h4 className="text-sm font-semibold">Your Integration Values</h4>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">API Key Prefix:</span>
                              <code className="rounded bg-background px-2 py-0.5 font-mono text-xs">{selectedKeyData.key_prefix}...</code>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Agent ID:</span>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-background px-2 py-0.5 font-mono text-xs max-w-[150px] truncate">{selectedAgentData.id}</code>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => handleCopy(selectedAgentData.id, 'agent-id')}
                                >
                                  {copiedId === 'agent-id' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Base URL:</span>
                              <code className="rounded bg-background px-2 py-0.5 font-mono text-xs">{getFastApiBaseUrl()}</code>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Auth Info */}
                      <div className="rounded-lg border border-border/70 p-4">
                        <h4 className="text-sm font-semibold mb-2">Authentication</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pass your API key in the header:
                        </p>
                        <code className="block rounded bg-slate-950 px-3 py-2 font-mono text-xs text-slate-50">
                          X-API-Key: cm_live_xxxxxxxx...
                        </code>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interactive Demo */}
                  {selectedAgentData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="h-5 w-5" />
                          Test API
                        </CardTitle>
                        <CardDescription>
                          Send a test message to your agent using your API key.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* API Key Input */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>API Key</Label>
                            <span className="text-xs text-muted-foreground">Only stored in memory</span>
                          </div>
                          <Input
                            type="password"
                            value={testApiKey}
                            onChange={(e) => setTestApiKey(e.target.value)}
                            placeholder="cm_live_xxxxxxxx..."
                            className="font-mono"
                          />
                          <p className="text-xs text-muted-foreground">
                            Paste your full API key here. It won't be saved - only used for this test.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea
                            value={demoMessage}
                            onChange={(e) => setDemoMessage(e.target.value)}
                            placeholder="Enter your message..."
                            rows={3}
                          />
                        </div>
                        <Button 
                          onClick={handleRunDemo}
                          disabled={isDemoLoading || !demoMessage.trim() || !testApiKey.trim()}
                          className="w-full"
                        >
                          {isDemoLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Test Message
                            </>
                          )}
                        </Button>
                        
                        {demoResponse && (
                          <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                            <Label className="text-xs text-muted-foreground mb-2 block">Response</Label>
                            <p className="text-sm whitespace-pre-wrap">{demoResponse}</p>
                          </div>
                        )}
                        
                        {demoResponse && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDemoResponse('')}
                            className="w-full"
                          >
                            Clear Response
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Code Examples Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Code Examples
                    </CardTitle>
                    <CardDescription>
                      Copy-paste ready code for your integration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Language Selector */}
                    <div className="flex gap-2">
                      {(['curl', 'javascript', 'python'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLanguage(lang)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            codeLanguage === lang
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <pre className="rounded-lg bg-slate-950 p-4 overflow-x-auto">
                        <code className="text-xs font-mono text-slate-50 whitespace-pre">
                          {generatedCode}
                        </code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-slate-100"
                        onClick={() => handleCopy(generatedCode, 'code')}
                      >
                        {copiedId === 'code' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>

                    {/* Available Endpoints */}
                    <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                      <h4 className="text-sm font-semibold mb-3">Available Endpoints</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="outline" className="font-mono text-xs bg-emerald-50 text-emerald-700 border-emerald-200">POST</Badge>
                          <code className="font-mono text-xs text-muted-foreground">/query</code>
                          <span className="text-xs text-muted-foreground">- Send text query (SSE streaming)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">GET</Badge>
                          <code className="font-mono text-xs text-muted-foreground">/api-keys</code>
                          <span className="text-xs text-muted-foreground">- List API keys</span>
                        </div>
                      </div>
                    </div>

                    {/* Widget Integration */}
                    <Alert className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      <Globe className="h-4 w-4" />
                      <AlertTitle className="font-semibold">Website Widget</AlertTitle>
                      <AlertDescription className="text-sm">
                        Want to add a chat widget to your website? The API key above works with our 
                        <Link href="/agents" className="font-medium underline ml-1">website widget integration</Link>.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Revoke confirmation dialog */}
      <Dialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke API key?</DialogTitle>
            <DialogDescription>
              This will immediately disable the key. Any integrations using this key will stop working.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => keyToRevoke && handleRevoke(keyToRevoke)}
              disabled={revokeKeyMutation.isPending}
            >
              {revokeKeyMutation.isPending ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke key'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
