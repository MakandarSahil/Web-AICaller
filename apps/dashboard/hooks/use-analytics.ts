'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getConversationAnalytics, getWorkspaceConversationAnalytics } from '@aicaller/supabase/queries'
import { analyticsKeys } from '@/lib/query-keys'

export function useConversationAnalytics(conversationId: string, initialData?: Awaited<ReturnType<typeof getConversationAnalytics>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: analyticsKeys.conversation(conversationId),
    queryFn: () => getConversationAnalytics(supabase, conversationId),
    enabled: !!conversationId,
    initialData: initialData ?? undefined,
  })
}

export function useWorkspaceConversationAnalytics(days: 7 | 30 | 90 = 30, initialData?: Awaited<ReturnType<typeof getWorkspaceConversationAnalytics>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: analyticsKeys.workspace(days),
    queryFn: () => getWorkspaceConversationAnalytics(supabase, days),
    initialData: initialData ?? undefined,
  })
}