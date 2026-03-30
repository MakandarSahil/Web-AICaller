'use client'

import React, { useEffect, useState } from 'react'
import { 
  Users, 
  PhoneCall, 
  MessageSquare, 
  Activity, 
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  ScrollArea
} from '@aicaller/ui'
import { useUser } from '@/providers/user-provider'

/**
 * Overview Client Component (Professional / Retell AI Density)
 * 
 * 1. Normalized font weights: font-black -> font-bold/semibold.
 * 2. Softened borders for a more integrated look.
 */
export function OverviewClient() {
  const { profile, workspace, email } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString?: string) => {
    if (!mounted || !dateString) return '...'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(dateString))
    } catch {
      return 'Invalid Date'
    }
  }

  const today = mounted 
    ? new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()) 
    : 'Loading date...'

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full font-sans transition-colors duration-300" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header className="page-header shrink-0 px-6 sm:px-8 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40 h-[var(--header-height)]">
        <div className="flex flex-col gap-0.5 text-left">
          <h1 className="page-title text-[15px] sm:text-[16px] font-bold tracking-tight text-foreground">Overview</h1>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={11} className="shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-50">{today}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex h-9 gap-2 text-[12px] font-semibold border-border/40 bg-white/2 hover:bg-white/5 transition-all active:scale-95 rounded-xl">
            <Activity className="h-4 w-4 text-emerald-500" />
            Live Monitor
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 sm:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto">
          
          {/* 1. Metric Cards Grid - Professional Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="stat-card border-brand-500/5 hover:shadow-2xl transition-all group bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 p-0">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                   Total Calls
                </CardTitle>
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                   <PhoneCall size={18} />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter">0</div>
                <p className="text-[12px] text-muted-foreground font-semibold mt-2 flex items-center gap-1.5">
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md text-[10px]">+0%</span>
                  vs last 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="stat-card border-brand-500/5 hover:shadow-2xl transition-all group bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 p-0">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                   Active Chats
                </CardTitle>
                <div className="h-9 w-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                   <MessageSquare size={18} />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter">0</div>
                <p className="text-[12px] text-muted-foreground font-semibold mt-2 flex items-center gap-1.5">
                  <span className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded-md text-[10px]">+0%</span>
                  vs last 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="stat-card border-brand-500/5 hover:shadow-2xl transition-all group bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 p-0">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                   Users Managed
                </CardTitle>
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                   <Users size={18} />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter">0</div>
                <p className="text-[12px] text-muted-foreground font-semibold mt-2">Current Active Population</p>
              </CardContent>
            </Card>

            <Card className="stat-card border-brand-500/5 hover:shadow-2xl transition-all group bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 p-0">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                   System Health
                </CardTitle>
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                   <Activity size={18} />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter uppercase">Optimal</div>
                <p className="text-[12px] text-muted-foreground font-semibold mt-2">All services online</p>
              </CardContent>
            </Card>
          </div>

          {/*  diagnostic Card - Professional Midnight */}
          <Card className="bg-card border border-border/40 overflow-hidden shadow-2xl rounded-3xl">
            <CardHeader className="border-b border-border/20 p-6 sm:p-8 bg-white/2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-3">
                    <div className="h-8 w-8 bg-brand-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
                       <Info size={16} />
                    </div>
                    Session Context Diagnostics
                  </CardTitle>
                  <p className="text-[13px] text-muted-foreground font-medium opacity-60">System information retrieved from Supabase UserProvider.</p>
                </div>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
                   Connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* User Info */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">User Profile</h4>
                  <div className="space-y-5 text-left">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Full Name</span>
                       <span className="text-[14px] font-semibold text-foreground">{profile?.full_name || 'Loading...'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Auth Email</span>
                       <span className="text-[14px] font-semibold text-brand-500 truncate decoration-brand-500/20">{email || '...'}</span>
                    </div>
                  </div>
                </div>

                {/* Workspace Info */}
                <div className="space-y-6 lg:border-l lg:border-border/10 lg:pl-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">Workspace</h4>
                  <div className="space-y-5 text-left">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Active Name</span>
                       <span className="text-[14px] font-semibold text-foreground">{workspace?.name || 'Loading...'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Joined On</span>
                       <span className="text-[14px] font-semibold text-foreground">{formatDate(workspace?.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-6 lg:border-l lg:border-border/10 lg:pl-10 text-left">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">Settings</h4>
                  <div className="flex flex-wrap gap-2">
                     <Badge variant="secondary" className="px-3.5 py-1 border border-border/40 bg-white/5 text-foreground font-semibold text-[10px] rounded-full uppercase tracking-tight">Free Tier</Badge>
                     <Badge variant="secondary" className="px-3.5 py-1 border border-border/40 bg-white/5 text-foreground font-semibold text-[10px] rounded-full uppercase tracking-tight">Early Access</Badge>
                     {profile?.is_admin && (
                        <Badge className="px-3.5 py-1 bg-brand-500 text-white font-bold text-[10px] rounded-full uppercase tracking-tight">ADMIN</Badge>
                     )}
                  </div>
                  <div className="mt-8">
                     <Button variant="outline" className="w-full justify-between h-11 px-5 border-border/40 bg-white/2 text-foreground font-semibold hover:bg-white/5 transition-all rounded-2xl group shadow-sm">
                        Account Settings
                        <ExternalLink size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                     </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
