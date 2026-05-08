import React from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getKnowledgeBases } from '@aicaller/supabase/queries'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Button, Badge } from '@aicaller/ui'
import { Plus, Database, Users } from 'lucide-react'
import Link from 'next/link'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'
import { SidebarKBList } from './components/sidebar-kb-list'

/**
 * Knowledge Bases Index Page — Intelligent Navigation
 * 
 * 1. Fetches all knowledge bases.
 * 2. If KBs exist, redirects to the first one for the Master-Detail UX.
 * 3. Else, presents a professional "Zero State" interface.
 */
export default async function KnowledgeBasesIndexPage() {
  const supabase = await createServerSupabaseClient()
  const kbs = await getKnowledgeBases(supabase).catch(() => [])

  // Detect mobile device
  const userAgent = (await headers()).get('user-agent') || ''
  const isMobile = /mobile/i.test(userAgent)

  // On Desktop: If we have KBs, go straight to the first one
  if (!isMobile && kbs && kbs.length > 0 && kbs[0]?.id) {
    redirect(`/knowledge-bases/${kbs[0].id}`)
  }

  // On Mobile: If we have KBs, show the list view in the main area
  if (isMobile && kbs && kbs.length > 0) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-foreground uppercase">Knowledge HUB</h1>
              <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">{kbs.length} Total Knowledge Bases</p>
            </div>
            <Button asChild size="sm" className="h-9 gap-2 font-bold text-[10px] uppercase tracking-widest rounded-xl">
              <Link href="/knowledge-bases">
                <Plus className="h-3.5 w-3.5" />
                Initialize
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-3">
             <SidebarKBList initialData={kbs} hideHeader={true} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background p-10">
      <div className="shrink-0 mb-8">
        <ContextualSidebarToggleButton />
      </div>
      <div className="flex-1 flex items-center justify-center">
      <div className="max-w-[420px] w-full text-center space-y-12">
        
        {/* Visual Anchor */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center border border-dashed border-border/60 rounded-xl">
            <Database className="h-10 w-10 text-muted-foreground opacity-20" />
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                <Plus className="h-4 w-4" />
            </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-[22px] font-bold tracking-tight text-foreground uppercase">Knowledge Center</h1>
          <p className="text-[12px] text-muted-foreground/40 font-medium leading-relaxed uppercase tracking-widest px-6 italic">
            Your agents are currently operating without custom context. Create a Knowledge Base to enhance their intelligence.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full h-14 font-bold text-[12px] uppercase tracking-widest rounded-xl transition-all gap-4 active:scale-95 shadow-sm shadow-primary/10"
            asChild
          >
            <Link href="/knowledge-bases">
              <Plus className="h-4 w-4" />
              Initialize Knowledge Base
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-4 py-2">
             <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border/30" />
             <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em]">Documentation</span>
             <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border/30" />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 rounded-xl border border-border/40 bg-muted/5 flex flex-col items-center gap-2">
                <Badge variant="outline" className="h-5 bg-background text-[8px] border-border/60 uppercase font-bold text-muted-foreground/40">Phase 1</Badge>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Plain Text</span>
             </div>
             <div className="p-4 rounded-xl border border-border/40 bg-muted/5 flex flex-col items-center gap-2">
                <Badge variant="outline" className="h-5 bg-background text-[8px] border-border/60 uppercase font-bold text-muted-foreground/40 opacity-40">Phase 2</Badge>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 italic">File Upload</span>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 opacity-10">
           <span className="text-[10px] font-bold uppercase tracking-widest">Global RAG</span>
           <div className="h-1 w-1 rounded-full bg-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Vector Embedding</span>
           <div className="h-1 w-1 rounded-full bg-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Azure Storage</span>
        </div>
      </div>
    </div>
    </div>
  )
}
