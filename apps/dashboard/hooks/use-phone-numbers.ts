'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import {
  getPhoneNumbers,
  createPhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,
} from '@aicaller/supabase/queries'
import { phoneNumberKeys } from '@/lib/query-keys'

type GetPhoneNumbersResult = Awaited<ReturnType<typeof getPhoneNumbers>>

export function usePhoneNumbers(initialData?: GetPhoneNumbersResult) {
  const supabase = createClient()

  return useQuery({
    queryKey: phoneNumberKeys.all,
    queryFn: () => getPhoneNumbers(supabase),
    enabled: true,
    initialData: initialData ?? undefined,
  })
}

export function useCreatePhoneNumber() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      workspaceId: string
      agentId: string
      number: string
      providerSid?: string | null
      webhookUrl?: string
    }) =>
      createPhoneNumber(supabase, {
        workspaceId: payload.workspaceId,
        agentId: payload.agentId,
        number: payload.number,
        providerSid: payload.providerSid ?? null,
        webhookUrl: payload.webhookUrl,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: phoneNumberKeys.all })
    },
  })
}

export function useUpdatePhoneNumber() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      id: string
      agentId?: string
      isActive?: boolean
      webhookUrl?: string | null
      providerSid?: string | null
    }) =>
      updatePhoneNumber(supabase, payload.id, {
        agentId: payload.agentId,
        isActive: payload.isActive,
        webhookUrl: payload.webhookUrl,
        providerSid: payload.providerSid,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: phoneNumberKeys.all })
    },
  })
}

export function useDeletePhoneNumber() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePhoneNumber(supabase, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: phoneNumberKeys.all })
    },
  })
}

