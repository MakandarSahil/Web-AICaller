'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import {
  getKnowledgeBases,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
} from '@aicaller/supabase/queries'
import { knowledgeBaseKeys } from '@/lib/query-keys'

type GetKnowledgeBasesResult = Awaited<ReturnType<typeof getKnowledgeBases>>

/**
 * Hook for fetching all knowledge bases.
 */
export function useKnowledgeBases(initialData?: GetKnowledgeBasesResult) {
  const supabase = createClient()
  return useQuery({
    queryKey: knowledgeBaseKeys.all,
    queryFn: () => getKnowledgeBases(supabase),
    initialData: initialData ?? undefined,
  })
}

export function useCreateKnowledgeBase() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      workspaceId: string
      name: string
      description?: string | null
    }) =>
      createKnowledgeBase(supabase, {
        workspace_id: payload.workspaceId,
        name: payload.name,
        description: payload.description ?? null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.all })
    },
  })
}

export function useUpdateKnowledgeBase() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      id: string
      name: string
      description?: string | null
    }) =>
      updateKnowledgeBase(supabase, payload.id, {
        name: payload.name,
        description: payload.description ?? null,
      }),
    onSuccess: (_kb, variables) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.detail(variables.id) })
    },
  })
}

export function useDeleteKnowledgeBase() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteKnowledgeBase(supabase, id),
    onSuccess: (_void, id) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.all })
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.detail(id) })
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.documents(id) })
    },
  })
}
