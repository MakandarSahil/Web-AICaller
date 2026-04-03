import { ReactNode } from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getKnowledgeBases } from '@aicaller/supabase/queries'
import { SidebarKBList } from './components/sidebar-kb-list'
import { ContextualSidebar } from '@/components/layout/sidebar-context'

/**
 * Knowledge Bases Layout — Master-Detail Container
 * 
 * 1. Fetches KBs on the server for SSR
 * 2. Injects SidebarKBList into the global contextual sidebar slot via ContextualSidebar
 * 3. Renders detail content (the selected KB) in the main slot
 */
export default async function KnowledgeBasesLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  
  // Fetch KB list for the persistent sub-sidebar
  const knowledgeBases = await getKnowledgeBases(supabase).catch(() => [])

  return (
    <>
      <ContextualSidebar>
        <SidebarKBList initialData={knowledgeBases} />
      </ContextualSidebar>
      <div className="flex-1 flex flex-col min-w-0 bg-background h-full font-sans">
        {children}
      </div>
    </>
  )
}
