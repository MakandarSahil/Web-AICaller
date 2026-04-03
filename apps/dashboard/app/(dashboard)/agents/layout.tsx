import { ReactNode } from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents } from '@aicaller/supabase/queries'
import { SidebarAgentList } from './components/sidebar-agent-list'
import { ContextualSidebar } from '@/components/layout/sidebar-context'

/**
 * Agents Layout — Master-Detail Container
 * 
 * 1. Fetches agents on the server for SSR
 * 2. Injects SidebarAgentList into the global contextual sidebar slot via ContextualSidebar
 * 3. Renders detail content (the selected agent) in the main slot
 */
export default async function AgentsLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  
  // Fetch agents list for the persistent sidebar
  const agents = await getAgents(supabase).catch(() => [])

  return (
    <>
      <ContextualSidebar>
        <SidebarAgentList initialData={agents} />
      </ContextualSidebar>
      <div className="flex-1 flex flex-col min-w-0 bg-background h-full font-sans">
        {children}
      </div>
    </>
  )
}
