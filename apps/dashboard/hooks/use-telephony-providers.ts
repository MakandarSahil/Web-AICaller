import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFastApiBaseUrl } from '@aicaller/api-client'
import { useUser } from '@/providers/user-provider'

export type TelephonyProvider = {
  id: string
  provider: string
  display_name: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export type ConnectProviderData = {
  provider: string
  display_name: string
  account_sid: string
  auth_token: string
}

async function getAuthHeaders() {
  const { createClient } = await import('@aicaller/supabase/client')
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${session.access_token}` }
}

export function useTelephonyProviders() {
  return useQuery({
    queryKey: ['telephony-providers'],
    queryFn: async (): Promise<TelephonyProvider[]> => {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getFastApiBaseUrl()}/telephony/providers`, {
        headers,
      })
      if (!response.ok) throw new Error('Failed to fetch providers')
      return response.json()
    },
  })
}

export type ConnectProviderError = {
  type: 'INVALID_CREDENTIALS' | 'ENCRYPTION_ERROR' | 'SERVER_ERROR' | 'UNKNOWN'
  message: string
  userMessage: string
}

export function useConnectProvider() {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ConnectProviderData): Promise<TelephonyProvider> => {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getFastApiBaseUrl()}/telephony/providers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to connect provider' }))
        const errorDetail = errorData.detail || 'Failed to connect provider'
        
        // Map backend errors to user-friendly messages
        let error: ConnectProviderError = {
          type: 'UNKNOWN',
          message: errorDetail,
          userMessage: 'An unexpected error occurred. Please try again.'
        }
        
        if (response.status === 400) {
          if (errorDetail.includes('Invalid Twilio credentials')) {
            error = {
              type: 'INVALID_CREDENTIALS',
              message: errorDetail,
              userMessage: 'Invalid Twilio credentials. Please check your Account SID and Auth Token. You can find these in your Twilio Console.'
            }
          } else {
            error = {
              type: 'INVALID_CREDENTIALS',
              message: errorDetail,
              userMessage: errorDetail
            }
          }
        } else if (response.status === 500) {
          if (errorDetail.includes('Encryption') || errorDetail.includes('encrypt')) {
            error = {
              type: 'ENCRYPTION_ERROR',
              message: errorDetail,
              userMessage: 'Server encryption is not configured properly. Please contact support.'
            }
          } else {
            error = {
              type: 'SERVER_ERROR',
              message: errorDetail,
              userMessage: 'Server error. Please try again later or contact support if the problem persists.'
            }
          }
        } else if (response.status === 403) {
          error = {
            type: 'INVALID_CREDENTIALS',
            message: errorDetail,
            userMessage: 'You do not have permission to connect providers. Please ensure you are logged in.'
          }
        }
        
        throw error
      }
      
      return response.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['telephony-providers'] })
    },
  })
}

export function useDisconnectProvider() {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: async (providerId: string): Promise<void> => {
      const headers = await getAuthHeaders()
      const response = await fetch(`${getFastApiBaseUrl()}/telephony/providers/${providerId}`, {
        method: 'DELETE',
        headers,
      })
      if (!response.ok) throw new Error('Failed to disconnect provider')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['telephony-providers'] })
    },
  })
}

export function useWebhookInstructions() {
  return useQuery({
    queryKey: ['webhook-instructions'],
    queryFn: async () => {
      const response = await fetch(`${getFastApiBaseUrl()}/telephony/webhook-instructions`)
      if (!response.ok) throw new Error('Failed to fetch instructions')
      return response.json() as Promise<{
        provider: string
        webhook_url_template: string
        instructions: string[]
      }>
    },
    staleTime: Infinity, // These don't change often
  })
}
