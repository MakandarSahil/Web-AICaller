'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getConversations, getConversationsByAgent, getConversation, getMessages } from '@aicaller/supabase/queries'
import { conversationKeys } from '@/lib/query-keys'

type GetConversationsResult = Awaited<ReturnType<typeof getConversations>>
type GetAgentConversationsResult = Awaited<ReturnType<typeof getConversationsByAgent>>
type GetConversationResult = Awaited<ReturnType<typeof getConversation>>
type GetMessagesResult = Awaited<ReturnType<typeof getMessages>>

export function useConversations(initialData?: GetConversationsResult) {
  const supabase = createClient()
  return useQuery({
    queryKey: conversationKeys.all,
    queryFn: () => getConversations(supabase),
    initialData: initialData ?? undefined,
  })
}

export function useAgentConversations(agentId: string, initialData?: GetAgentConversationsResult) {
  const supabase = createClient()
  return useQuery({
    queryKey: conversationKeys.agent(agentId),
    queryFn: () => getConversationsByAgent(supabase, agentId),
    enabled: !!agentId,
    initialData: initialData ?? undefined,
  })
}

export function useConversation(id: string, initialData?: GetConversationResult) {
  const supabase = createClient()
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => getConversation(supabase, id),
    enabled: !!id,
    initialData: initialData ?? undefined,
  })
}

export function useConversationMessages(id: string, initialData?: GetMessagesResult) {
  const supabase = createClient()
  return useQuery({
    queryKey: conversationKeys.messages(id),
    queryFn: () => getMessages(supabase, id),
    enabled: !!id,
    initialData: initialData ?? undefined,
  })
}