import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { getProfile, updateProfile } from '@aicaller/supabase/queries'
import { profileKeys } from '@/lib/query-keys'
import type { TablesUpdate } from '@aicaller/supabase'

/**
 * Read the current user's profile.
 *
 * Same note as useWorkspace: prefer useUser().profile in most cases.
 * Use this hook on the settings/profile page where you need fresh data
 * after an update mutation.
 */
export function useProfile(initialData?: Awaited<ReturnType<typeof getProfile>>) {
  const supabase = createClient()
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: () => getProfile(supabase),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Update profile. Invalidates profileKeys.all on success.
 *
 * avatar_url upload is handled separately via Supabase Storage — upload the
 * file first, get the URL, then call this mutation with { avatar_url }.
 */
export function useUpdateProfile() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<TablesUpdate<'profiles'>, 'id' | 'is_admin' | 'created_at'>) =>
      updateProfile(supabase, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.all })
    },
  })
}