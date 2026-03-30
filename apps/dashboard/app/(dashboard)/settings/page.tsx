'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@aicaller/supabase/client'
import { useUser } from '@/providers/user-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
  ScrollArea,
} from '@aicaller/ui'
import { User, Building2, Shield, Loader2, CheckCircle2, AlertCircle, Camera, Settings as SettingsIcon } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { cn } from '@aicaller/ui/lib/utils'

/**
 * Settings Page (Professional / Midnight Theme Optimized)
 * 
 * Target Surface: #181B25
 * Target Card: #242630
 * Target Sidebar: #0E121B
 */
export default function SettingsPage() {
  const { profile, workspace, email } = useUser()
  const supabase = createClient()

  // Profile States
  const [fullName, setFullName] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Workspace States
  const [workspaceName, setWorkspaceName] = useState('')
  const [isUpdatingWorkspace, setIsUpdatingWorkspace] = useState(false)
  const [workspaceMessage, setWorkspaceMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Sync state with user data
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name)
    if (workspace?.name) setWorkspaceName(workspace.name)
  }, [profile, workspace])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileMessage(null)

    try {
      if (!profile) throw new Error('No profile found')
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', profile.id)

      if (error) throw error
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' })
      setTimeout(() => setProfileMessage(null), 3000)
    } catch (err: unknown) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingWorkspace(true)
    setWorkspaceMessage(null)

    try {
      if (!workspace) throw new Error('No workspace found')
      const { error } = await supabase
        .from('workspaces')
        .update({ name: workspaceName })
        .eq('id', workspace.id)

      if (error) throw error
      setWorkspaceMessage({ type: 'success', text: 'Workspace updated successfully' })
      setTimeout(() => setWorkspaceMessage(null), 3000)
    } catch (err: unknown) {
      setWorkspaceMessage({ type: 'error', text: 'Failed to update workspace' })
    } finally {
      setIsUpdatingWorkspace(false)
    }
  }

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : (email?.[0] ?? 'U').toUpperCase()

  const LoadingSkeleton = (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
         <Skeleton className="h-10 w-48 bg-white/5" />
         <Skeleton className="h-4 w-72 bg-white/2" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Skeleton className="h-[400px] bg-white/5 md:col-span-2 rounded-2xl" />
        <Skeleton className="h-[300px] bg-white/5 rounded-2xl" />
      </div>
    </div>
  )

  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full font-sans transition-colors duration-300">
        
        {/* Page Header */}
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground">Settings</h1>
            <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground opacity-50 uppercase tracking-widest ml-2 border-l border-border/40 pl-4">Account & Workspace</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground opacity-40">
               <SettingsIcon size={16} />
             </div>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6 sm:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!profile ? (
              LoadingSkeleton
            ) : (
              <div className="space-y-10">
                <Tabs defaultValue="profile" className="space-y-8">
                  <TabsList className="bg-white/2 border border-border/40 p-1 h-12 rounded-xl">
                    <TabsTrigger value="profile" className="rounded-lg px-6 data-[state=active]:bg-white/5 data-[state=active]:shadow-sm data-[state=active]:text-brand-500 font-bold transition-all text-[13px]">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="workspace" className="rounded-lg px-6 data-[state=active]:bg-white/5 data-[state=active]:shadow-sm data-[state=active]:text-brand-500 font-bold transition-all text-[13px]">
                      <Building2 className="mr-2 h-4 w-4" /> Workspace
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 data-[state=active]:bg-white/5 data-[state=active]:shadow-sm data-[state=active]:text-brand-500 font-bold transition-all text-[13px]">
                      <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Content */}
                  <TabsContent value="profile" className="space-y-8 outline-none animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                      <Card className="stat-card lg:col-span-2 border border-border/40 overflow-hidden bg-card">
                        <CardHeader className="border-b border-border/20 bg-white/2 px-8 py-6">
                          <CardTitle className="text-foreground text-[15px] font-bold tracking-tight">Profile Information</CardTitle>
                          <CardDescription className="text-muted-foreground font-medium opacity-60 text-[12px]">Update your account display name and primary contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid gap-8 sm:grid-cols-2">
                              <div className="space-y-2.5">
                                <Label htmlFor="fullName" className="text-foreground/70 font-bold text-[12px] uppercase tracking-wider opacity-60">Full Name</Label>
                                <Input
                                  id="fullName"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="bg-white/2 border-border/40 text-foreground placeholder:text-muted-foreground/30 h-11 px-4 rounded-xl focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-[13.5px]"
                                  placeholder="e.g. Sahil Makandar"
                                />
                              </div>
                              <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-foreground/70 font-bold text-[12px] uppercase tracking-wider opacity-60">Email Address</Label>
                                <Input
                                  id="email"
                                  value={email}
                                  disabled
                                  className="bg-white/2 border-border/20 text-muted-foreground cursor-not-allowed h-11 px-4 rounded-xl font-medium opacity-50"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                              <Button
                                type="submit"
                                disabled={isUpdatingProfile || fullName === profile?.full_name}
                                className="bg-brand-500 hover:bg-brand-600 text-white min-w-[140px] h-11 rounded-xl font-bold shadow-lg shadow-brand-500/10 transition-all active:scale-95 text-[12.5px]"
                              >
                                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Changes
                              </Button>
                              
                              {profileMessage && (
                                <div className={cn(
                                  "flex items-center text-[12px] font-bold px-4 py-2 rounded-lg animate-in zoom-in-95 duration-200",
                                  profileMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                )}>
                                  {profileMessage.type === 'success' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                                  {profileMessage.text}
                                </div>
                              )}
                            </div>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="stat-card border border-border/40 overflow-hidden h-fit bg-card group">
                        <CardHeader className="border-b border-border/20 bg-white/2 px-6 py-6 text-center">
                          <CardTitle className="text-foreground text-[14px] font-bold tracking-tight">Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-10 text-center relative">
                          <div className="relative mb-8">
                            <Avatar className="h-28 w-28 ring-4 ring-brand-500/10 shadow-3xl border-4 border-card transition-transform group-hover:scale-105 duration-500">
                              <AvatarImage src={profile?.avatar_url || ''} />
                              <AvatarFallback className="bg-brand-500 text-white text-3xl font-extrabold">{initials}</AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-card border border-border/60 shadow-lg flex items-center justify-center text-muted-foreground hover:text-brand-500 transition-colors z-10">
                               <Camera size={14} />
                            </button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-brand-500 font-bold hover:bg-white/5 px-8 h-9 rounded-xl border border-transparent hover:border-brand-500/20">
                            Change Photo
                          </Button>
                          <p className="mt-8 text-[11px] text-muted-foreground font-medium underline-offset-4 decoration-muted-foreground/20 decoration-dashed max-w-[160px] opacity-40">
                            Square image recommended. Max 2MB.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Workspace Content */}
                  <TabsContent value="workspace" className="space-y-8 outline-none animate-in fade-in duration-300">
                    <Card className="stat-card border border-border/40 overflow-hidden bg-card">
                      <CardHeader className="border-b border-border/20 bg-white/2 px-8 py-6">
                        <CardTitle className="text-foreground text-[15px] font-bold tracking-tight">Workspace Identity</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium opacity-60 text-[12px]">Manage how your organization appears across callMind</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8">
                         <form onSubmit={handleUpdateWorkspace} className="space-y-8">
                          <div className="max-w-md space-y-8">
                            <div className="space-y-2.5">
                              <Label htmlFor="workspaceName" className="text-foreground/70 font-bold text-[12px] uppercase tracking-wider opacity-60">Display Name</Label>
                              <Input
                                id="workspaceName"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="bg-white/2 border-border/40 text-foreground h-11 px-4 rounded-xl font-medium focus:ring-brand-500/10 transition-all"
                                placeholder="e.g. Acme Corp"
                              />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-foreground/30 font-bold text-[11px] uppercase tracking-[0.2em]">System ID</Label>
                              <div className="bg-white/2 border border-border/20 rounded-xl p-3.5 text-[11.5px] font-mono text-muted-foreground flex items-center justify-between opacity-50">
                                <span>{workspace?.id}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Registry Key</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <Button
                              type="submit"
                              disabled={isUpdatingWorkspace || workspaceName === workspace?.name}
                              className="bg-brand-500 hover:bg-brand-600 text-white h-11 px-10 rounded-xl font-bold shadow-lg shadow-brand-500/10 transition-all active:scale-95 text-[12.5px]"
                            >
                              {isUpdatingWorkspace ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Update Brand
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Security Content */}
                  <TabsContent value="security" className="space-y-8 outline-none animate-in fade-in duration-300">
                     <Card className="stat-card border border-border/40 overflow-hidden bg-card">
                      <CardHeader className="border-b border-border/20 bg-white/2 px-8 py-6">
                        <CardTitle className="text-foreground text-[15px] font-bold tracking-tight">Safety & Access</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium opacity-60 text-[12px]">Protect your workspace with advanced security measures</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="p-8 bg-white/2 border border-border/20 rounded-2xl flex items-start gap-6 group hover:bg-white/5 transition-all duration-300">
                          <div className="h-11 w-11 rounded-1.5xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-sm border border-blue-500/10 group-hover:scale-105 transition-transform">
                             <Shield size={22} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground text-[15px] tracking-tight">Multi-Level Authentication</h4>
                            <p className="text-[13px] text-muted-foreground mt-2 font-medium leading-relaxed opacity-60">Ensure only authorized members can access your callMind workspace. We recommend enabling 2FA.</p>
                            <Button variant="outline" size="sm" className="mt-8 border-border/40 text-muted-foreground hover:bg-white/5 hover:text-foreground font-bold px-8 h-10 rounded-xl transition-all">
                              Configure 2FA
                            </Button>
                          </div>
                        </div>

                         <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-6">
                          <div className="h-11 w-11 rounded-1.5xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                             <AlertCircle size={22} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-rose-400 text-[15px] tracking-tight">Danger Zone</h4>
                            <p className="text-[13px] text-muted-foreground mt-2 font-medium leading-relaxed opacity-60">Permanently delete your account and all associated data. This action is irreversible.</p>
                            <Button variant="ghost" size="sm" className="mt-8 text-rose-500 hover:bg-rose-500/10 font-bold px-8 h-10 rounded-xl transition-all decoration-rose-500/20 underline-offset-4 decoration-solid">
                              Deactivate Workspace
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </DashboardShell>
  )
}
