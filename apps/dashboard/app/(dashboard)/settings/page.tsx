'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@aicaller/supabase/client'
import type { Database } from '@aicaller/supabase/types'
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
} from '@aicaller/ui'
import { User, Building2, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

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

  if (!profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-slate-800" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-64 bg-slate-800 md:col-span-2" />
          <Skeleton className="h-64 bg-slate-800" />
        </div>
      </div>
    )
  }

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : (email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-slate-400">Manage your Account, Workspace, and Security</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-slate-800 px-6">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="workspace" className="data-[state=active]:bg-slate-800 px-6">
            <Building2 className="mr-2 h-4 w-4" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-800 px-6">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Content */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">Update your account detail and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white focus:ring-brand-500/20"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-slate-800 border-slate-700 text-slate-400 opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile || fullName === profile?.full_name}
                      className="bg-brand-600 hover:bg-brand-700 text-white min-w-[120px]"
                    >
                      {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                    
                    {profileMessage && (
                      <div className={`flex items-center text-sm ${profileMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {profileMessage.type === 'success' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                        {profileMessage.text}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Your Avatar</CardTitle>
                <CardDescription className="text-slate-400">Public profile photo</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Avatar className="h-24 w-24 ring-4 ring-brand-500/10 mb-4">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-brand-600 text-white text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Change Photo
                </Button>
                <p className="mt-4 text-xs text-slate-500 max-w-[160px]">
                  JPG, GIF or PNG. 1MB max size.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workspace Content */}
        <TabsContent value="workspace" className="space-y-6 outline-none">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Workspace Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure your business identity</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleUpdateWorkspace} className="space-y-6">
                <div className="max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspaceName" className="text-slate-200">Workspace Name</Label>
                    <Input
                      id="workspaceName"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="My Business"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200 opacity-60">Workspace ID</Label>
                    <div className="bg-slate-800/50 border border-slate-800 rounded-md p-2 text-xs font-mono text-slate-500">
                      {workspace?.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isUpdatingWorkspace || workspaceName === workspace?.name}
                    className="bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    {isUpdatingWorkspace ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Name
                  </Button>
                  
                  {workspaceMessage && (
                    <div className={`flex items-center text-sm ${workspaceMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {workspaceMessage.type === 'success' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                      {workspaceMessage.text}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Content */}
        <TabsContent value="security" className="space-y-6 outline-none">
           <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Account Security</CardTitle>
              <CardDescription className="text-slate-400">Update your password and security keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-lg flex items-start gap-4">
                <Shield className="h-5 w-5 text-brand-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-white">Password protection</h4>
                  <p className="text-sm text-slate-400 mt-1">We recommend a strong, unique password to keep your account safe.</p>
                  <Button variant="outline" size="sm" className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800">
                    Change Password
                  </Button>
                </div>
              </div>

               <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-lg flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-rose-400">Delete Account</h4>
                  <p className="text-sm text-slate-400 mt-1">Permanently remove your account and all associated data. This cannot be undone.</p>
                  <Button variant="ghost" size="sm" className="mt-4 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300">
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
