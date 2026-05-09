import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listApiKeys, createApiKey, revokeApiKey, updateApiKey } from '@aicaller/api-client'
import { apiKeyKeys } from '@/lib/query-keys'

export type ApiKeyListItem = {
  id: string
  name: string
  key_prefix: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
  allowed_domains: string[] | null
}

export type CreateApiKeyResponse = {
  id: string
  name: string
  key: string
  key_prefix: string
  created_at: string
}

export type RevokeApiKeyResponse = {
  id: string
  revoked: boolean
}

/**
 * List all API keys for the current workspace.
 */
export function useApiKeys() {
  return useQuery({
    queryKey: apiKeyKeys.all,
    queryFn: async () => {
      const data = await listApiKeys()
      return data as ApiKeyListItem[]
    },
  })
}

/**
 * Create a new API key.
 * Invalidates the API keys list on success.
 * Returns the raw key which should be shown to the user exactly once.
 */
export function useCreateApiKey() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const data = await createApiKey(name)
      return data as CreateApiKeyResponse
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
  })
}

/**
 * Revoke an API key by ID.
 * Invalidates the API keys list on success.
 */
export function useRevokeApiKey() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await revokeApiKey(id)
      return data as RevokeApiKeyResponse
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
  })
}

export type UpdateApiKeyData = {
  allowed_domains?: string[] | null
}

/**
 * Update an API key configuration.
 * Invalidates the API keys list on success.
 */
export function useUpdateApiKey() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateApiKeyData }) => {
      const result = await updateApiKey(id, data)
      return result as ApiKeyListItem
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
  })
}
