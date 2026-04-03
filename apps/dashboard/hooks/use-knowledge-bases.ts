'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getKnowledgeBases } from '@aicaller/supabase/queries'

export const kbKeys = {
  all: ['knowledge-bases'] as const,
  list: () => [...kbKeys.all, 'list'] as const,
  detail: (id: string) => [...kbKeys.all, 'detail', id] as const,
}

/**
 * Hook for fetching all knowledge bases.
 */
export function useKnowledgeBases() {
  const supabase = createClient()
  return useQuery({
    queryKey: kbKeys.list(),
    queryFn: () => getKnowledgeBases(supabase),
  })
}
