import React from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getKnowledgeBase, getKBDocuments } from '@aicaller/supabase/queries'
import { redirect, notFound } from 'next/navigation'
import KnowledgeBaseDetailClient from './components/kb-detail-client'

interface KBPageProps {
  params: Promise<{ id: string }>
}

/**
 * Knowledge Base Detail Page — Master-Detail Integration
 */
export default async function KnowledgeBaseDetailPage({ params }: KBPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // 1. Fetch KB metadata (Server Side)
  const kb = await getKnowledgeBase(supabase, id).catch(() => null)
  
  if (!kb) {
    return notFound()
  }

  // 2. Fetch linked documents (Server Side)
  const documents = await getKBDocuments(supabase, id).catch(() => [])

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background font-sans transition-colors duration-300">
       <KnowledgeBaseDetailClient id={id} initialKb={kb} initialDocuments={documents} />
    </div>
  )
}
