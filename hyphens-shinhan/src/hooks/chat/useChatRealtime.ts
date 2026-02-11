'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { chatKeys } from './useChat'
import type { MessageResponse } from '@/types/chat'

export interface UseChatRealtimeOptions {
  clubId?: string | null
  params?: { cursor?: string; limit?: number }
  currentUserId?: string | null
}

/** Mark the room as read, then invalidate the rooms cache so unread counts update. */
function markRoomAsRead(roomId: string, userId: string, queryClient: QueryClient) {
  createClient()
    .from('chat_room_members')
    .update({ last_read_at: new Date().toISOString() })
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    })
}

/**
 * Subscribes to a Supabase **Broadcast** channel for the given room.
 *
 * Instead of relying on postgres_changes (which requires WAL replication +
 * RLS + specific Supabase project configuration), Broadcast is a simple
 * client-to-client message relay through Supabase Realtime.
 *
 * Flow:
 *  1. User sends a message → POST to FastAPI → DB insert → API returns the saved message
 *  2. On success the sender calls `sendBroadcast(savedMessage)`
 *  3. All other subscribers in the same room receive the broadcast and merge
 *     the new message into the React-Query cache instantly.
 *
 * Returns `sendBroadcast` — call it after a successful message send.
 */
export function useChatRealtime(
  roomId: string | null,
  options: UseChatRealtimeOptions = {},
) {
  const queryClient = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const { clubId, params = {}, currentUserId } = options

  // Keep a stable ref to the latest values so the callback is never stale
  const optionsRef = useRef({ clubId, params, queryClient, roomId, currentUserId })
  useEffect(() => {
    optionsRef.current = { clubId, params, queryClient, roomId, currentUserId }
  })

  useEffect(() => {
    if (!roomId) return

    let cancelled = false
    const supabase = createClient()
    const channelName = `chat:${roomId}`

    // Clean up any previous channel held in the ref
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false }, // sender already has the message via mutation
        },
      })
      .on('broadcast', { event: 'new_message' }, (payload) => {
        if (cancelled) return

        const newMessage = payload.payload as MessageResponse
        if (!newMessage?.id) return

        const { clubId, params, queryClient, currentUserId } = optionsRef.current

        const mergeNewMessage = (
          old: { messages: MessageResponse[]; has_more: boolean } | undefined,
        ) => {
          if (!old) return { messages: [newMessage], has_more: false }
          const exists = old.messages.some((m) => m.id === newMessage.id)
          if (exists) return old
          return { ...old, messages: [newMessage, ...old.messages] }
        }

        if (clubId) {
          queryClient.setQueryData(
            chatKeys.clubMessages(clubId, params),
            mergeNewMessage,
          )
        } else {
          queryClient.setQueryData(
            chatKeys.messages(roomId, params),
            mergeNewMessage,
          )
        }

        // Mark as read when receiving a message from another user
        if (currentUserId && newMessage.sender_id !== currentUserId) {
          markRoomAsRead(roomId, currentUserId, queryClient)
        }
      })
      .subscribe((status, err) => {
        if (cancelled) return
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel
          // Mark as read when user opens the chat room
          const { currentUserId, queryClient: qc } = optionsRef.current
          if (currentUserId) {
            markRoomAsRead(roomId, currentUserId, qc)
          }
        }
        if (process.env.NODE_ENV === 'development') {
          if (status === 'SUBSCRIBED') {
            console.debug('[useChatRealtime] SUBSCRIBED (broadcast)', channelName)
          }
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('[useChatRealtime]', status, err)
          }
        }
      })

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
      if (channelRef.current === channel) {
        channelRef.current = null
      }
    }
  }, [roomId])

  /** Broadcast a newly sent message to all other subscribers in the room. */
  const sendBroadcast = useCallback(
    (message: MessageResponse) => {
      if (!channelRef.current) return
      channelRef.current.send({
        type: 'broadcast',
        event: 'new_message',
        payload: message,
      })
    },
    [],
  )

  return { sendBroadcast }
}
