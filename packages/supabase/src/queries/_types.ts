import type { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types/database.types'

/**
 * Shared SupabaseClient type for both server and browser environments.
 * Using ReturnType<typeof createBrowserClient<Database>> ensures compatibility
 * between @aicaller/supabase/client and @aicaller/supabase/server.
 */
export type SupabaseClientType = ReturnType<typeof createBrowserClient<Database>>
