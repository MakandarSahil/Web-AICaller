import { getDashboardAuthHeaders } from './auth'
import { getFastApiBaseUrl, isDummyApiKeysEnabled, isDummyQueryEnabled } from './env'
import { ApiError, throwIfNotOk } from './errors'
import { readSseStream } from './streaming'

type ApiKeyListItem = {
  id: string
  name: string
  key_prefix: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
  allowed_domains: string[] | null
}

type CreateApiKeyResponse = {
  id: string
  name: string
  key: string
  key_prefix: string
  created_at: string
}

type UpdateApiKeyRequest = {
  allowed_domains?: string[] | null
}

type RevokeApiKeyResponse = {
  id: string
  revoked: boolean
}

type QueryStreamChunk = {
  delta?: string
  conversation_id?: string
  error?: string
}

type QueryAgentOptions = {
  signal?: AbortSignal
}

type PreviewVoiceOptions = {
  signal?: AbortSignal
}

export async function queryAgent(
  agentId: string,
  text: string,
  conversationId: string | undefined,
  onDelta: (delta: string) => void,
  onConversationId: (id: string) => void,
  options?: QueryAgentOptions
): Promise<void> {
  if (isDummyQueryEnabled()) {
    onConversationId(crypto.randomUUID())
    const words = "Hello! I'm your AI assistant. How can I help you today?".split(' ')
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 80))
      onDelta(`${word} `)
    }
    return
  }

  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source': 'dashboard_test', // Mark as dashboard test - won't be persisted
      ...headers,
    },
    body: JSON.stringify({
      agent_id: agentId,
      text,
      conversation_id: conversationId,
      stream: true,
    }),
    signal: options?.signal,
  })

  await throwIfNotOk(response)

  let hasConversationId = false

  await readSseStream(
    response,
    (raw) => {
      if (raw === '[DONE]') {
        return
      }

      let parsed: QueryStreamChunk
      try {
        parsed = JSON.parse(raw) as QueryStreamChunk
      } catch {
        throw new ApiError(502, 'Invalid stream payload from backend')
      }

      if (parsed.error) {
        throw new ApiError(502, parsed.error)
      }

      if (!hasConversationId && parsed.conversation_id) {
        hasConversationId = true
        onConversationId(parsed.conversation_id)
      }

      if (parsed.delta) {
        onDelta(parsed.delta)
      }
    },
    options?.signal
  )
}

export async function previewAgentVoice(
  agentId: string,
  text: string,
  voice: string,
  options?: PreviewVoiceOptions
): Promise<Blob> {
  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/query/tts-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      agent_id: agentId,
      text,
      voice,
    }),
    signal: options?.signal,
  })

  await throwIfNotOk(response)
  return response.blob()
}

export async function listApiKeys(): Promise<ApiKeyListItem[]> {
  if (isDummyApiKeysEnabled()) {
    return [
      {
        id: '1',
        name: 'Website chatbot',
        key_prefix: 'cm_live_a1b2c3d4',
        is_active: true,
        created_at: new Date().toISOString(),
        last_used_at: null,
        allowed_domains: null,
      },
    ]
  }

  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/api-keys`, {
    headers,
  })

  await throwIfNotOk(response)
  return response.json() as Promise<ApiKeyListItem[]>
}

export async function createApiKey(name: string): Promise<CreateApiKeyResponse> {
  if (isDummyApiKeysEnabled()) {
    return {
      id: crypto.randomUUID(),
      name,
      key:
        'cm_live_' +
        crypto.randomUUID().replace(/-/g, '') +
        crypto.randomUUID().replace(/-/g, '').slice(0, 8),
      key_prefix: 'cm_live_a1b2c3d4',
      created_at: new Date().toISOString(),
    }
  }

  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/api-keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ name }),
  })

  await throwIfNotOk(response)
  return response.json() as Promise<CreateApiKeyResponse>
}

export async function revokeApiKey(id: string): Promise<RevokeApiKeyResponse> {
  if (isDummyApiKeysEnabled()) {
    return { id, revoked: true }
  }

  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/api-keys/${id}`, {
    method: 'DELETE',
    headers,
  })

  await throwIfNotOk(response)
  return response.json() as Promise<RevokeApiKeyResponse>
}

export async function updateApiKey(id: string, data: UpdateApiKeyRequest): Promise<ApiKeyListItem> {
  if (isDummyApiKeysEnabled()) {
    return {
      id,
      name: 'Updated Key',
      key_prefix: 'cm_live_test',
      is_active: true,
      created_at: new Date().toISOString(),
      last_used_at: null,
      allowed_domains: data.allowed_domains || null,
    }
  }

  const headers = await getDashboardAuthHeaders()
  const response = await fetch(`${getFastApiBaseUrl()}/api-keys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })

  await throwIfNotOk(response)
  return response.json() as Promise<ApiKeyListItem>
}
