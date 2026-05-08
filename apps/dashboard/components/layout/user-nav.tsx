'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { 
  LogOut, 
  Settings, 
  HelpCircle, 
  User, 
  ChevronsUpDown, 
  Mail,
  Sun,
  Moon,
  Monitor,
  Check
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@aicaller/ui/lib/utils'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@aicaller/ui'
import { useUser } from '@/providers/user-provider'
import { createClient } from '@aicaller/supabase/client'

/**
 * User Navigation (Midnight Theme Optimized)
 * 
 * Account dropdown and theme toggle.
 * Uses hsl(var(--card)) (#242630) for high-fidelity dark mode contrast.
 */
export function UserNav({ collapsed = false }: { collapsed?: boolean }) {
  const { profile, email } = useUser()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = profile?.full_name
    ? profile.full_name.charAt(0)
    : email?.charAt(0) || 'U'

  return (
    <div className="flex flex-col gap-1 w-full shrink-0 font-sans">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-11 justify-start gap-3 px-3 border-border/30 bg-muted hover:bg-sidebar-active-bg transition-all rounded-xl shadow-sm dark:border-border/20 dark:bg-muted dark:hover:bg-sidebar-active-bg",
              collapsed && "justify-center px-0 h-11"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0 shadow-sm transition-transform hover:scale-105 border-2 border-sidebar-bg ring-1 ring-emerald-100/20">
               {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
               ) : (
                  <span className="text-[12px] uppercase font-semibold">
                    {initials}
                  </span>
               )}
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-col items-start overflow-hidden text-left flex-1">
                  <span className="text-[14px] font-bold text-foreground truncate tracking-tight w-full opacity-90">
                    {profile?.full_name || 'My Account'}
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-auto shrink-0 opacity-40" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-72 bg-card border border-border shadow-[0_20px_80px_rgb(0,0,0,0.4)] rounded-xl p-1.5 z-50" 
          align={collapsed ? 'center' : 'start'} 
          side={collapsed ? 'right' : 'top'} 
          sideOffset={14}
        >
          <div className="px-3.5 py-4 mb-1.5 bg-muted rounded-xl border border-border/30 flex items-center gap-3 dark:bg-muted dark:border-border/20">
             <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center text-emerald-400">
                <Mail size={16} />
             </div>
             <div className="overflow-hidden text-left">
                <p className="text-[14px] font-semibold text-foreground truncate tracking-tight">
                   {profile?.full_name || 'My Account'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate font-bold mt-0.5 tracking-tight uppercase opacity-50">{email}</p>
             </div>
          </div>
          
          <DropdownMenuItem onSelect={() => router.push('/settings')} className="flex items-center gap-3 cursor-pointer w-full text-[13px] font-semibold py-3 px-4 rounded-xl hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg transition-all text-foreground">
            <User className="h-4.5 w-4.5 text-muted-foreground opacity-60" />
            Profile Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem onSelect={() => router.push('/settings')} className="flex items-center gap-3 cursor-pointer w-full text-[13px] font-semibold py-3 px-4 rounded-xl hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg transition-all text-foreground">
            <Settings className="h-4.5 w-4.5 text-muted-foreground opacity-60" />
            Workspace Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/30 my-1.5 mx-1.5" />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer w-full text-[13px] font-semibold py-3 px-4 rounded-xl hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg transition-all text-foreground focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg">
              {theme === 'dark' ? <Moon className="h-4.5 w-4.5 text-brand-500" /> : <Sun className="h-4.5 w-4.5 text-brand-500" />}
              Appearance
              <span className="ml-auto text-[11px] px-2 py-0.5 bg-muted rounded-lg text-muted-foreground font-semibold uppercase tracking-tighter capitalize opacity-60 dark:bg-muted">{theme}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-[180px] bg-card border border-border shadow-3xl p-1.5 rounded-xl">
                <DropdownMenuItem onSelect={() => setTheme('light')} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg font-bold cursor-pointer text-[12.5px]">
                   <div className="flex items-center gap-3 text-foreground">
                    <Sun className="h-4 w-4" /> Light
                   </div>
                   {theme === 'light' && <Check className="h-4 w-4 text-brand-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme('dark')} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg font-bold cursor-pointer text-[12.5px]">
                   <div className="flex items-center gap-3 text-foreground">
                    <Moon className="h-4 w-4" /> Dark
                   </div>
                   {theme === 'dark' && <Check className="h-4 w-4 text-brand-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme('system')} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl focus:bg-sidebar-active-bg dark:focus:bg-sidebar-active-bg font-bold cursor-pointer text-[12.5px]">
                   <div className="flex items-center gap-3 text-foreground">
                    <Monitor className="h-4 w-4" /> System
                   </div>
                   {theme === 'system' && <Check className="h-4 w-4 text-brand-500" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem onSelect={() => router.push('/help')} className="flex items-center gap-3 cursor-pointer w-full text-[13px] font-semibold py-3 px-4 rounded-xl hover:bg-sidebar-active-bg dark:hover:bg-sidebar-active-bg transition-all text-foreground">
            <HelpCircle className="h-4.5 w-4.5 text-muted-foreground opacity-60" />
            Help & Support
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/30 my-1.5 mx-1.5" />
          
          <DropdownMenuItem 
            onSelect={handleLogout} 
            className="flex items-center gap-3 cursor-pointer w-full text-[13px] font-semibold py-3 px-4 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-tighter"
          >
            <LogOut className="h-4.5 w-4.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
