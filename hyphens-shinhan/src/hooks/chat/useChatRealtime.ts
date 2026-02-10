'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { chatKeys } from './useChat'
import type { MessageResponse } from '@/types/chat'

/**
 * Supabase 대시보드에서 Realtime 활성화 필요:
 * Database → Replication → supabase_realtime → chat_messages 테이블 추가
 *
 * 참고: 동일 채널 중복 구독 시 "tried to subscribe multiple times" 방지를 위해
 * channelRef로 채널을 보존하고 unmount 시 removeChannel로 해제.
 * https://velog.io/@wjdcks2252/Supabase로-실시간-채팅-구현하기
 */

/** Supabase Realtime INSERT payload.new (DB row) - 컬럼명은 백엔드 chat_messages 테이블 기준 */
interface ChatMessageRow {
  id?: string
  room_id?: string
  sender_id?: string | null
  sender_name?: string | null
  sender_avatar_url?: string | null
  sent_at?: string
  message?: string | null
  file_urls?: string[] | null
  [key: string]: unknown
}

function mapRowToMessageResponse(row: ChatMessageRow): MessageResponse {
  return {
    id: row.id ?? '',
    sender_id: row.sender_id ?? null,
    sender_name: row.sender_name ?? null,
    sender_avatar_url: row.sender_avatar_url ?? null,
    room_id: row.room_id ?? '',
    sent_at: row.sent_at ?? new Date().toISOString(),
    message: row.message ?? null,
    file_urls: Array.isArray(row.file_urls) ? row.file_urls : null,
  }
}

export interface UseChatRealtimeOptions {
  /** 클럽 채팅인 경우: 새 메시지 시 갱신할 쿼리가 clubId 기준이므로 전달 */
  clubId?: string | null
  /** useClubChatMessages와 동일한 params (쿼리 키 일치용, 기본 {}) */
  params?: { cursor?: string; limit?: number }
}

/**
 * 채팅방 실시간 구독.
 * - 입장 시 메시지 로드는 기존 useClubChatMessages / useMessages (GET) 사용.
 * - 이 훅은 Supabase Realtime으로 chat_messages 테이블 INSERT만 구독해, 새 메시지 시 React Query 캐시를 갱신.
 */
export function useChatRealtime(
  roomId: string | null,
  options: UseChatRealtimeOptions = {},
) {
  const queryClient = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const { clubId, params = {} } = options

  useEffect(() => {
    if (!roomId) return

    const supabase = createClient()
    const channelName = `room:${roomId}`

    // 중복 구독 방지: 기존 채널이 있으면 먼저 해제
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = (payload?.new ?? payload) as ChatMessageRow
          const newMessage = mapRowToMessageResponse(row)

          const mergeNewMessage = (
            old: { messages: MessageResponse[]; has_more: boolean } | undefined,
          ) => {
            if (!old) return { messages: [newMessage], has_more: false }
            const exists = old.messages.some((m) => m.id === newMessage.id)
            if (exists) return old
            return {
              ...old,
              messages: [newMessage, ...old.messages],
            }
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
        },
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel
        }
        if (process.env.NODE_ENV === 'development') {
          if (status === 'SUBSCRIBED') {
            console.debug('[useChatRealtime] SUBSCRIBED', channelName)
          }
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('[useChatRealtime]', status, err)
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
      if (channelRef.current === channel) {
        channelRef.current = null
      }
    }
  }, [roomId, clubId, queryClient])
}
