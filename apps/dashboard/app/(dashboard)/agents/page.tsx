import React from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents } from '@aicaller/supabase/queries'
import { redirect } from 'next/navigation'
import { Button } from '@aicaller/ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'

/**
 * Agents Index Page — Intelligent Navigation (Minimal)
 * 
 * 1. Fetches all agents under the current user.
 * 2. If agents exist, redirects to the first one immediately.
 * 3. Else, presents a professional, minimal "Zero State" interface.
 */
export default async function AgentsIndexPage() {
  const supabase = await createServerSupabaseClient()
  const agents = await getAgents(supabase).catch(() => [])

  // If we have agents, go straight to the first one for current selection UX
  if (agents && agents.length > 0 && agents[0]?.id) {
    redirect(`/agents/${agents[0].id}`)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-10">
      <div className="max-w-[380px] w-full text-center space-y-10">
        
        {/* Visual Anchor (Minimalist) */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center border-2 border-dashed border-border rounded-full opacity-20">
           <Plus className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-[20px] font-bold tracking-tight text-foreground uppercase">Agents Hub</h1>
          <p className="text-[12px] text-muted-foreground/40 font-medium leading-relaxed uppercase tracking-widest px-4">
            No agents found in this workspace. Create your first AI Voice Assistant to begin.
          </p>
        </div>

        <Button 
          className="w-full h-12 font-bold text-[12px] uppercase tracking-widest rounded-xl transition-all gap-3 active:scale-95"
          asChild
        >
          <Link href="/agents/new">
            <Plus className="h-4 w-4" />
            Create Your First Agent
          </Link>
        </Button>

        <div className="flex items-center justify-center gap-6 opacity-10">
           <span className="text-[10px] font-bold uppercase tracking-widest">Latency v2.4</span>
           <div className="h-1 w-1 rounded-full bg-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Neural Voice</span>
           <div className="h-1 w-1 rounded-full bg-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Vector RAG</span>
        </div>
      </div>
    </div>
  )
}
