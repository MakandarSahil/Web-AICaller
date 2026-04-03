import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { getAgents, getPhoneNumbers } from '@aicaller/supabase/queries'
import PhoneNumbersClient from './phone-numbers-client'

export default async function PhoneNumbersPage() {
  const supabase = await createServerSupabaseClient()

  const [phoneNumbers, agents] = await Promise.all([
    getPhoneNumbers(supabase).catch(() => []),
    getAgents(supabase).catch(() => []),
  ])

  return (
    <PhoneNumbersClient
      initialPhoneNumbers={phoneNumbers}
      initialAgents={agents}
    />
  )
}

