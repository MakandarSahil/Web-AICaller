import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack QueryClient configuration.
 *
 * Defaults chosen for a dashboard-style app:
 * - staleTime 60s: workspace/agent data doesn't change every second.
 *   Conversations get shorter staleTime via individual useQuery options.
 * - gcTime 5min: keep inactive cache alive for quick back-navigation.
 * - retry 1: one retry on failure — Supabase errors are usually real, not transient.
 * - throwOnError false: let hooks handle errors gracefully, not crash boundaries.
 *
 * DO NOT export a singleton — Next.js server/client boundary requires
 * a new QueryClient per server render. Use the provider instead.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // 60 seconds
        gcTime: 5 * 60 * 1000,      // 5 minutes
        retry: 1,
        refetchOnWindowFocus: true,
        throwOnError: false,
      },
      mutations: {
        retry: 0,                   // never retry mutations — side effects are not idempotent
        throwOnError: false,
      },
    },
  })
}