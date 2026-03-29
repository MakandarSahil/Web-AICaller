import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getWorkspace, updateWorkspace } from '@aicaller/supabase/queries'
import { workspaceKeys } from '@/lib/query-keys'
import type { TablesUpdate } from '@aicaller/supabase'

/**
 * Read the current workspace.
 *
 * In most cases you want useUser().workspace from the context instead —
 * it's always available with no loading state since it's SSR-fetched.
 *
 * Use this hook when you need:
 *  - Up-to-date workspace data after a mutation (workspace settings page)
 *  - Background refresh after the user updates workspace details
 *
 * @param initialData — pass the SSR-fetched workspace to avoid a loading flash.
 *   Pattern: server layout fetches → passes as prop → client component hydrates.
 */
export function useWorkspace(initialData?: Awaited<ReturnType<typeof getWorkspace>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: () => getWorkspace(supabase),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,   // workspace changes rarely — 5 min stale time
  })
}

/**
 * Mutate workspace fields (name, business_name, industry, website, size).
 * Invalidates workspaceKeys.all on success → useWorkspace re-fetches.
 */
export function useUpdateWorkspace() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: TablesUpdate<'workspaces'>) =>
      updateWorkspace(supabase, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.all })
    },
  })
}