const DEFAULT_FASTAPI_URL = 'https://api.iamspiderman.me'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getFastApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_FASTAPI_URL
  if (fromEnv && fromEnv.trim()) {
    return trimTrailingSlash(fromEnv)
  }
  return DEFAULT_FASTAPI_URL
}

export function isDummyQueryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DUMMY_QUERY === 'true'
}

export function isDummyApiKeysEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DUMMY_API_KEYS === 'true'
}

export function getVoiceWebhookUrl(agentId: string): string {
  const safeAgentId = encodeURIComponent(agentId)
  return `${getFastApiBaseUrl()}/voice?agent_id=${safeAgentId}`
}
