const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL
const DUMMY_QUERY = process.env.NEXT_PUBLIC_DUMMY_QUERY === 'true'
const DUMMY_API_KEYS = process.env.NEXT_PUBLIC_DUMMY_API_KEYS === 'true'

async function getAuthHeader() {
  const { createClient } = await import('@aicaller/supabase/client')
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${session.access_token}` }
}

export async function queryAgent(
  agentId: string,
  text: string,
  conversationId: string | undefined,
  onDelta: (delta: string) => void,
  onConversationId: (id: string) => void
) {
  if (DUMMY_QUERY) {
    onConversationId(crypto.randomUUID())
    const words = "Hello! I'm your AI assistant. How can I help you today?".split(' ')
    for (const word of words) {
      await new Promise(r => setTimeout(r, 80))
      onDelta(word + ' ')
    }
    return
  }
  const headers = await getAuthHeader()
  const res = await fetch(`${FASTAPI_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ agent_id: agentId, text, conversation_id: conversationId, stream: true }),
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let convIdSent = false
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6)
      if (raw === '[DONE]') return
      const parsed = JSON.parse(raw)
      if (!convIdSent && parsed.conversation_id) { onConversationId(parsed.conversation_id); convIdSent = true }
      if (parsed.delta) onDelta(parsed.delta)
    }
  }
}

export async function listApiKeys() {
  if (DUMMY_API_KEYS) return [
    { id: '1', name: 'Website chatbot', key_prefix: 'cm_live_a1b2c3d4',
      is_active: true, created_at: new Date().toISOString(), last_used_at: null }
  ]
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys`, { headers }).then(r => r.json())
}

export async function createApiKey(name: string) {
  if (DUMMY_API_KEYS) return {
    id: crypto.randomUUID(), name,
    key: 'cm_live_' + crypto.randomUUID().replace(/-/g,'') + crypto.randomUUID().replace(/-/g,'').slice(0,8),
    key_prefix: 'cm_live_a1b2c3d4', created_at: new Date().toISOString()
  }
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ name }),
  }).then(r => r.json())
}

export async function revokeApiKey(id: string) {
  if (DUMMY_API_KEYS) return { id, revoked: true }
  const headers = await getAuthHeader()
  return fetch(`${FASTAPI_URL}/api-keys/${id}`, { method: 'DELETE', headers }).then(r => r.json())
}
