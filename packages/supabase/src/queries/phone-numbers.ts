import type { SupabaseClientType } from './_types'
import type { Tables, TablesInsert, TablesUpdate } from '../types'

type PhoneNumber = Tables<'phone_numbers'>

export type PhoneNumberRow = PhoneNumber & {
  agents?: Pick<Tables<'agents'>, 'id' | 'name'>
}

type PhoneNumberType = TablesInsert<'phone_numbers'>['number_type']

function defaultWebhookUrl(agentId: string) {
  // Keep consistent with backend voice routing.
  return `https://api.iamspiderman.me/voice?agent_id=${agentId}`
}

/**
 * List active phone numbers in the authenticated user's workspace.
 * Includes the assigned agent (for dashboard display).
 */
export async function getPhoneNumbers(supabase: SupabaseClientType): Promise<PhoneNumberRow[]> {
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*, agents(id, name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as PhoneNumberRow[]) ?? []
}

/**
 * Create a BYO (Bring Your Own) phone number and attach it to an agent.
 */
export async function createPhoneNumber(
  supabase: SupabaseClientType,
  payload: {
    workspaceId: string
    agentId: string
    number: string
    providerSid?: string | null
    webhookUrl?: string
  }
): Promise<PhoneNumberRow> {
  const { data, error } = await supabase
    .from('phone_numbers')
    .insert({
      workspace_id: payload.workspaceId,
      agent_id: payload.agentId,
      number: payload.number,
      number_type: 'own' as PhoneNumberType,
      provider_sid: payload.providerSid ?? null,
      webhook_url: payload.webhookUrl ?? defaultWebhookUrl(payload.agentId),
      is_active: true,
    })
    .select('*, agents(id, name)')
    .single()

  if (error) throw error
  return data as PhoneNumberRow
}

/**
 * Update phone number assignment/toggle.
 */
export async function updatePhoneNumber(
  supabase: SupabaseClientType,
  id: string,
  payload: {
    agentId?: string
    isActive?: boolean
    webhookUrl?: string | null
    providerSid?: string | null
  }
): Promise<PhoneNumberRow> {
  const updates: TablesUpdate<'phone_numbers'> = {}

  if (typeof payload.agentId === 'string') updates.agent_id = payload.agentId
  if (typeof payload.isActive === 'boolean') updates.is_active = payload.isActive
  if (payload.webhookUrl !== undefined) updates.webhook_url = payload.webhookUrl
  if (payload.providerSid !== undefined) updates.provider_sid = payload.providerSid

  const { data, error } = await supabase
    .from('phone_numbers')
    .update(updates)
    .eq('id', id)
    .select('*, agents(id, name)')
    .single()

  if (error) throw error
  return data as PhoneNumberRow
}

export async function deletePhoneNumber(supabase: SupabaseClientType, id: string): Promise<void> {
  const { error } = await supabase.from('phone_numbers').delete().eq('id', id)
  if (error) throw error
}

