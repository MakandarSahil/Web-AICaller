'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
} from '@aicaller/ui'
import { Activity, Check, Copy, Key, Lock, Plus, ShieldAlert, Trash2, Zap } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'

const mockKeys = [
  { id: '1', name: 'Production Dashboard', key: 'pk_live_************************4a2b', env: 'production', created: '2024-03-12', lastUsed: '2 min ago' },
  { id: '2', name: 'Development Webhook', key: 'pk_test_************************9f8e', env: 'development', created: '2024-03-28', lastUsed: '3 hours ago' },
]

export default function ApiKeysPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateKey = () => {
    setNewKey('pk_live_51P2c9JK8vL0m1zPx9sR4tQ5uV6wW7xY8z0a1b2c3d4e5f6g7h8i9j0')
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-background font-sans">
      <PageHeader
        title="API keys"
        description="Manage secure access for external systems"
        actions={
          <Dialog onOpenChange={(open) => !open && setNewKey(null)}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-2">
                <Plus className="h-3.5 w-3.5" />
                Generate key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl overflow-hidden rounded-xl border-border/70 bg-card p-0">
              <DialogHeader className="border-b border-border/70 bg-muted/20 p-6 text-left">
                <DialogTitle className="text-base font-semibold">New API key</DialogTitle>
                <DialogDescription>
                  Grant external systems access to your workspace APIs.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                {!newKey ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Key description</Label>
                      <Input placeholder="e.g. Website assistant" className="h-10" />
                    </div>

                    <div className="space-y-3">
                      <Label>Environment</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-left">
                          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Zap className="h-4 w-4 text-primary" />
                            Production
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">Live credentials</span>
                        </button>
                        <button className="rounded-lg border border-border/70 bg-muted/20 p-4 text-left transition-colors hover:bg-muted/40">
                          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            Development
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">Testing credentials</span>
                        </button>
                      </div>
                    </div>

                    <Button className="h-10 w-full" onClick={generateKey}>
                      Generate API key
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Alert className="rounded-lg border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle className="font-semibold">Store this key now</AlertTitle>
                      <AlertDescription>
                        This key is shown once. If it is lost, create a replacement key.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label>Secret API key</Label>
                      <div className="flex h-11 items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3">
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-primary">{newKey}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(newKey, 'new')}>
                          {copiedId === 'new' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button variant="secondary" className="h-10 w-full" onClick={() => setNewKey(null)}>
                      I saved this key
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-5 sm:p-6 lg:p-8">
          <section className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Integration infrastructure</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Use secure REST APIs to trigger outbound calls, sync knowledge data, and fetch realtime transcripts.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <StatusBadge tone="success">Operational</StatusBadge>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                      View API reference
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">Active credentials</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Rotate keys regularly and keep production credentials restricted.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/20">
                    {['Name', 'Masked key', 'Environment', 'Last used', 'Actions'].map((heading) => (
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
                  {mockKeys.map((key) => (
                    <tr key={key.id} className="group transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Key className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground">{key.name}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">Created {key.created}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{key.key}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(key.key, key.id)}>
                            {copiedId === key.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="capitalize">
                          {key.env}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-muted-foreground">{key.lastUsed}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
