import React from 'react'
import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getConversation, getMessages } from '@aicaller/supabase/queries'
import { notFound } from 'next/navigation'
import ConversationDetailClient from './components/conversation-detail-client'

interface ConversationPageProps {
  params: Promise<{ id: string }>
}

/**
 * Conversation Detail Page — Server Side Logic
 */
export default async function ConversationDetailPage({ params }: ConversationPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  // 1. Fetch Conversation (Server Side)
  const conversation = await getConversation(supabase, id).catch(() => null)
  
  if (!conversation) {
    // For UI development, we'll allow mock data in the client if preferred, 
    // but in real wiring this would be a 404.
    // return notFound()
  }

  // 2. Fetch Messages (Server Side)
  const messages = await getMessages(supabase, id).catch(() => [])

  return <ConversationDetailClient id={id} />
}
