import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

/**
 * Shared SupabaseClient type for both server and browser environments.
 * Using SupabaseClient<Database> provides full type safety for .from('table')
 * operations across browser and server clients.
 */
export type SupabaseClientType = SupabaseClient<Database>

