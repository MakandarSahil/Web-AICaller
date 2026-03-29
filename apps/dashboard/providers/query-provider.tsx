'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { makeQueryClient } from '@/lib/query-client'
import type { QueryClient } from '@tanstack/react-query'

/**
 * TanStack QueryClientProvider for Next.js App Router.
 *
 * WHY useState and not a module-level singleton:
 * Next.js App Router renders Server and Client Components in the same process.
 * A module-level QueryClient would be shared across requests on the server,
 * leaking data between users. useState creates a new client per component
 * mount, which in Next.js means one per user session.
 *
 * Usage: wrap your root layout's <body> with this provider.
 *
 * <QueryProvider>
 *   {children}
 * </QueryProvider>
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  )
}