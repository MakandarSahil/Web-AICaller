'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import { conversationKeys } from '@/lib/query-keys'
import type { Tables } from '@aicaller/supabase'

/**
 * Realtime bridge — Supabase Postgres changes → TanStack Query cache patches.
 *
 * ARCHITECTURE DECISION:
 * We do NOT re-fetch on realtime events. Instead we patch the cache directly
 * with setQueryData. This gives instant UI updates without a round-trip.
 *
 * Supabase realtime is enabled on two tables (see schema):
 *  - conversations: listen for status changes (active → completed)
 *  - messages: listen for new message inserts (live transcript)
 *
 * These hooks are used inside the conversation detail page ONLY.
 * The conversations list page uses normal polling/stale-time, not realtime.
 *
 * HOW TO ADD A NEW REALTIME SUBSCRIPTION:
 *  1. Add a hook below following the same pattern.
 *  2. Use the correct table name and filter.
 *  3. Call qc.setQueryData to patch the cache — never call invalidateQueries
 *     inside a realtime handler (causes a fetch storm on every WS message).
 *  4. Clean up the channel in the useEffect return function.
 */

/**
 * Subscribe to new messages in a conversation.
 * Appends each incoming message to the messages cache without re-fetching.
 *
 * Usage: call inside the conversation detail page component.
 *
 * @param conversationId — the active conversation to subscribe to.
 */
export function useMessageRealtime(conversationId: string) {
  // useRef stabilises the client reference — createClient() would return a new
  // object on every render, causing the effect to re-subscribe endlessly.
  const supabaseRef = useRef(createClient())
  const qc = useQueryClient()

  useEffect(() => {
    if (!conversationId) return
    const supabase = supabaseRef.current

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Tables<'messages'>
          qc.setQueryData(
            conversationKeys.messages(conversationId),
            (old: Tables<'messages'>[] | undefined) =>
              old ? [...old, newMessage] : [newMessage]
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, qc])
}

/**
 * Subscribe to conversation status changes (active → completed).
 * Updates the conversation status in the detail cache.
 *
 * Usage: call inside the conversation detail page component.
 */
export function useConversationStatusRealtime(conversationId: string) {
  const supabaseRef = useRef(createClient())
  const qc = useQueryClient()

  useEffect(() => {
    if (!conversationId) return
    const supabase = supabaseRef.current

    const channel = supabase
      .channel(`conversation-status:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as Tables<'conversations'>
          // Patch status + ended_at + summary without a full refetch
          qc.setQueryData(
            conversationKeys.detail(conversationId),
            (old: Tables<'conversations'> | undefined) =>
              old
                ? {
                    ...old,
                    status: updated.status,
                    ended_at: updated.ended_at,
                    summary: updated.summary,
                    message_count: updated.message_count,
                  }
                : updated
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, qc])
}