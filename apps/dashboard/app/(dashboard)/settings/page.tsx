'use client'

import React, { useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aicaller/ui'
import { AlertCircle, Building2, Camera, CheckCircle2, Loader2, Shield, Trash2, User } from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { useUser } from '@/providers/user-provider'
import { createClient } from '@aicaller/supabase/client'
import { PageHeader } from '@/components/ui/page-header'

export default function SettingsPage() {
  const { profile, workspace, email } = useUser()
  const supabase = createClient()

  const [workspaceName, setWorkspaceName] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (workspace?.name) setWorkspaceName(workspace.name)
  }, [workspace])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      if (!workspace) throw new Error('No workspace found')
      const { error } = await supabase.from('workspaces').update({ name: workspaceName }).eq('id', workspace.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Workspace settings saved.' })
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage({ type: 'error', text: 'Failed to update workspace.' })
    } finally {
      setIsUpdating(false)
    }
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
      <PageHeader title="Settings" description="Workspace, account, and security preferences" />

      <ScrollArea className="flex-1">
        <div className="mx-auto w-full max-w-5xl p-5 sm:p-6 lg:p-8">
          <Tabs defaultValue="workspace" className="space-y-6">
            <TabsList className="grid h-10 w-full max-w-xl grid-cols-3 rounded-lg border border-border/70 bg-muted/30 p-1">
              <TabsTrigger value="workspace" className="rounded-md text-sm">
                <Building2 className="h-3.5 w-3.5" />
                Workspace
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-md text-sm">
                <User className="h-3.5 w-3.5" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-md text-sm">
                <Shield className="h-3.5 w-3.5" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="outline-none">
              <Card className="overflow-hidden rounded-xl border-border/70 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/70 p-5 sm:p-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Workspace profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Core workspace identity and defaults.</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">Active</Badge>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6 p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Workspace name</Label>
                      <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                          <SelectItem value="IST">IST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Workspace ID</Label>
                    <div className="flex h-10 items-center rounded-lg border border-border/70 bg-muted/20 px-3 font-mono text-xs text-muted-foreground">
                      {workspace?.id ?? 'Loading'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center">
                    <Button disabled={isUpdating} className="h-10 gap-2">
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save changes
                    </Button>
                    {message ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 text-sm font-medium',
                          message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                        )}
                      >
                        {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {message.text}
                      </span>
                    ) : null}
                  </div>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="outline-none">
              <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                <Card className="rounded-xl border-border/70 bg-card p-5 shadow-sm sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-foreground">Account profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Personal identity used across the dashboard.</p>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label>Email address</Label>
                      <Input value={email || ''} readOnly className="h-10 cursor-not-allowed bg-muted/20 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label>Display name</Label>
                      <Input defaultValue={profile?.full_name || ''} className="h-10" />
                    </div>
                    <Button variant="outline" className="h-10">Update profile</Button>
                  </div>
                </Card>

                <Card className="flex flex-col items-center rounded-xl border-border/70 bg-card p-6 text-center shadow-sm">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border border-border">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-primary">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">{profile?.full_name || 'Profile photo'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Square JPG or PNG, max 5MB.</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="outline-none">
              <div className="space-y-4">
                <SecurityRow
                  icon={Shield}
                  title="Two-factor authentication"
                  description="Recommended for workspaces with outbound phone lines enabled."
                  action={<Button variant="outline" size="sm">Enable</Button>}
                />
                <SecurityRow
                  icon={Trash2}
                  title="Danger zone"
                  description="Permanently delete this workspace and all associated call data."
                  danger
                  action={<Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Delete workspace</Button>}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  action,
  danger,
}: {
  icon: typeof Shield
  title: string
  description: string
  action: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between', danger ? 'border-destructive/20 bg-destructive/5' : 'border-border/70 bg-card')}>
      <div className="flex items-start gap-4">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', danger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className={cn('text-sm font-semibold', danger ? 'text-destructive' : 'text-foreground')}>{title}</h3>
          <p className={cn('mt-1 text-sm', danger ? 'text-destructive/70' : 'text-muted-foreground')}>{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
