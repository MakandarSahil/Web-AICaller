'use client'

import React, { useState, useEffect } from 'react'
import { 
  Badge, 
  Button, 
  ScrollArea, 
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@aicaller/ui'
import { 
  Settings as SettingsIcon, 
  Building2, 
  Globe, 
  Shield, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Camera,
  Trash2
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { useUser } from '@/providers/user-provider'
import { createClient } from '@aicaller/supabase/client'

/**
 * Settings Page — Workspace & Account High-Fidelity Refinement
 */
export default function SettingsPage() {
  const { profile, workspace, email } = useUser()
  const supabase = createClient()

  const [workspaceName, setWorkspaceName] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (workspace?.name) setWorkspaceName(workspace.name)
    // if (workspace?.timezone) setTimezone(workspace.timezone)
  }, [workspace])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      if (!workspace) throw new Error('No workspace found')
      const { error } = await supabase
        .from('workspaces')
        .update({ name: workspaceName }) // timezone: timezone
        .eq('id', workspace.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Workspace configuration preserved.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update workspace.' })
    } finally {
      setIsUpdating(false)
    }
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
      
      {/* 1. Page Header */}
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">Settings</h1>
            <div className="h-4 w-[1px] bg-border/40 mx-1" />
            <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">Workspace Governance</span>
         </div>
      </header>

      <ScrollArea className="flex-1">
         <div className="max-w-4xl mx-auto px-10 py-12 pb-40 space-y-12">
            
            <Tabs defaultValue="workspace" className="space-y-10">
               <TabsList className="h-12 bg-muted/20 border border-border/40 rounded-xl p-1 gap-1">
                  <TabsTrigger value="workspace" className="rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                     <Building2 className="h-3.5 w-3.5" />
                     Workspace
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                     <User className="h-3.5 w-3.5" />
                     My Account
                  </TabsTrigger>
                  <TabsTrigger value="security" className="rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                     <Shield className="h-3.5 w-3.5" />
                     Security
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="workspace" className="space-y-10 outline-none">
                  <Card className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5 shadow-sm">
                     <div className="p-10 border-b border-border/20 bg-muted/10 font-bold text-[14px] uppercase tracking-tight text-foreground flex items-center justify-between">
                        General Configuration
                        <Badge variant="outline" className="h-5 text-[9px] border-border text-muted-foreground/40 font-bold uppercase tracking-widest">v1.2 Stable</Badge>
                     </div>
                     <form onSubmit={handleUpdate} className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Workspace Name</Label>
                              <Input 
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold text-[14px]"
                              />
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Default Timezone</Label>
                              <Select value={timezone} onValueChange={setTimezone}>
                                 <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold text-[14px]">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="UTC" className="font-bold">UTC (Universal Time)</SelectItem>
                                    <SelectItem value="PST" className="font-bold">PST (Pacific Standard)</SelectItem>
                                    <SelectItem value="IST" className="font-bold">IST (India Standard)</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/20">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Unique Workspace ID</Label>
                           <div className="h-12 px-5 flex items-center rounded-xl bg-muted/10 border border-border/30 font-mono text-[11px] text-muted-foreground/40 tracking-wider">
                              {workspace?.id}
                           </div>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                           <Button 
                             disabled={isUpdating}
                             className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95"
                           >
                              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                              Save Changes
                           </Button>
                           {message && (
                              <span className={cn(
                                "text-[11px] font-bold uppercase tracking-widest",
                                message.type === 'success' ? "text-emerald-500" : "text-destructive"
                              )}>
                                 {message.text}
                              </span>
                           )}
                        </div>
                     </form>
                  </Card>
               </TabsContent>

               <TabsContent value="profile" className="space-y-10 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <Card className="md:col-span-2 rounded-[32px] border border-border/40 overflow-hidden bg-muted/5 p-10 space-y-10">
                        <div className="space-y-4">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Email Address</Label>
                           <Input value={email || ''} readOnly className="h-12 bg-muted/10 border-border/20 text-muted-foreground/40 rounded-xl px-5 font-bold cursor-not-allowed" />
                        </div>
                        <div className="space-y-4">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Display Name</Label>
                           <Input defaultValue={profile?.full_name || ''} className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold" />
                        </div>
                        <Button className="h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest px-10 border border-border/40 bg-muted hover:bg-muted/80 text-foreground transition-all">
                           Update Identity
                        </Button>
                     </Card>

                     <Card className="rounded-[32px] border border-border/40 bg-muted/5 p-8 flex flex-col items-center text-center space-y-6">
                        <div className="relative group">
                           <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-2 ring-primary/5 group-hover:scale-105 transition-transform duration-500">
                              <AvatarImage src={profile?.avatar_url || ''} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-extrabold">{initials}</AvatarFallback>
                           </Avatar>
                           <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-md">
                              <Camera className="h-4 w-4" />
                           </button>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 px-4">Square JPG/PNG Max 5MB</p>
                     </Card>
                  </div>
               </TabsContent>

               <TabsContent value="security" className="space-y-8 outline-none">
                  <div className="space-y-6">
                     <div className="p-8 rounded-[32px] border border-border/40 bg-muted/5 flex items-start gap-6 group hover:bg-muted/10 transition-all">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                           <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                           <h4 className="text-[14px] font-bold text-foreground uppercase tracking-tight">Two-Factor Authentication</h4>
                           <p className="text-[12px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">Mandatory for workspaces with outbound phone lines enabled.</p>
                           <Button variant="outline" className="mt-4 h-10 border-border/60 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background">Enable Security</Button>
                        </div>
                     </div>

                     <div className="p-8 rounded-[32px] border border-destructive/20 bg-destructive/5 flex items-start gap-6">
                        <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0 border border-destructive/20">
                           <Trash2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                           <h4 className="text-[14px] font-bold text-destructive uppercase tracking-tight">Danger Zone</h4>
                           <p className="text-[12px] font-medium text-destructive/40 leading-relaxed uppercase tracking-widest">Permanently delete this workspace and all associated call logs.</p>
                           <Button variant="ghost" className="mt-4 h-10 text-destructive hover:bg-destructive/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">Delete Workspace</Button>
                        </div>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>

         </div>
      </ScrollArea>

    </div>
  )
}
