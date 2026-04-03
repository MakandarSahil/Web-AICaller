export async function getDashboardAuthHeaders(): Promise<Record<string, string>> {
  const { createClient } = await import('@aicaller/supabase/client')
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}
