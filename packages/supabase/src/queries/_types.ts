import type { createServerSupabaseClient } from '../server'

/**
 * Derive client type directly from the server client factory.
 * This is the most accurate type — it matches exactly what both
 * createServerSupabaseClient and createClient return at runtime.
 */
export type SupabaseClientType = Awaited<ReturnType<typeof createServerSupabaseClient>>