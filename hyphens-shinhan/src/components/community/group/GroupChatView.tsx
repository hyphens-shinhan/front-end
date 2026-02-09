'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useClub } from '@/hooks/clubs/useClubs'
import { useHeaderStore, useUserStore } from '@/stores'
import { useClubChatMessages, useChatRooms } from '@/hooks/chat/useChat'
import { useJoinClubChat, useSendMessage } from '@/hooks/chat/useChatMutations'
import MessageInput from '@/components/common/MessageInput'
import EmptyContent from '@/components/common/EmptyContent'
import { INPUT_BAR_TYPE, EMPTY_CONTENT_MESSAGES } from '@/constants'
import { cn } from '@/utils/cn'
import type { MessageResponse } from '@/types/chat'

/** Group message for UI */
interface GroupChatMessage {
  id: string
  sender_id: string | null
  sender_name: string | null
  sender_avatar: string | null
  content: string
  created_at: string
  is_own: boolean
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function convertMessageToGroupChatMessage(
  msg: MessageResponse,
  currentUserId: string | null,
): GroupChatMessage {
  return {
    id: msg.id,
    sender_id: msg.sender_id,
    sender_name: msg.sender_name,
    sender_avatar: msg.sender_avatar_url,
    content: msg.message || '',
    created_at: msg.sent_at,
    is_own: msg.sender_id === currentUserId,
  }
}

interface GroupChatViewProps {
  clubId: string
}

/**
 * 소모임 채팅 화면.
 * 디자인: 헤더(뒤로, 그룹명, 더보기), 날짜 구분, 수신/발신 말풍선, 하단 입력창.
 */
export default function GroupChatView({ clubId }: GroupChatViewProps) {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const currentUserId = user?.id ?? null
  const { data: club, isLoading: isClubLoading } = useClub(clubId)
  const { setCustomTitle, setHandlers, resetHandlers } = useHeaderStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [roomId, setRoomId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isChatRoomReady, setIsChatRoomReady] = useState(false)
  const isSendingRef = useRef(false)

  // 채팅방 목록에서 클럽 채팅방 찾기 (메시지 전송을 위한 roomId 필요)
  const { data: chatRoomsData } = useChatRooms()
  const joinClubChat = useJoinClubChat()
  const sendMessageMutation = useSendMessage()

  // 채팅방 ID 찾기 및 생성 (메시지 조회 전에 채팅방이 준비되어야 함)
  useEffect(() => {
    if (!clubId || !club) return

    if (chatRoomsData?.rooms) {
      const clubRoom = chatRoomsData.rooms.find(
        (room) => room.type === 'GROUP' && room.club_id === clubId,
      )

      if (clubRoom) {
        setRoomId(clubRoom.id)
        setIsChatRoomReady(true)
      } else if (!joinClubChat.isPending) {
        // 채팅방이 없으면 입장 시도 (생성/입장)
        joinClubChat.mutate(clubId, {
          onSuccess: (data) => {
            setRoomId(data.id)
            setIsChatRoomReady(true)
          },
          onError: () => {
            setIsChatRoomReady(false)
          },
        })
      }
    }
  }, [chatRoomsData, clubId, club, joinClubChat])

  // 클럽 채팅 메시지 조회 (채팅방이 준비된 후에만 조회)
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useClubChatMessages(clubId, {}, isChatRoomReady)

  // 메시지 데이터 변환
  const messages: GroupChatMessage[] = messagesData?.messages
    ? messagesData.messages
      .map((msg) => convertMessageToGroupChatMessage(msg, currentUserId))
      .reverse() // API는 최신순이므로 역순으로 정렬
    : []

  useEffect(() => {
    setCustomTitle(club?.name ?? '채팅')
    return () => setCustomTitle(null)
  }, [club?.name, setCustomTitle])


  useEffect(() => {
    setHandlers({
      onClick: () => {
        // TODO: 그룹 정보 메뉴
      },
    })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(() => {
    if (
      !message.trim() ||
      !roomId ||
      sendMessageMutation.isPending ||
      isSendingRef.current
    )
      return

    isSendingRef.current = true
    const messageToSend = message.trim()

    sendMessageMutation.mutate(
      {
        roomId,
        data: {
          message: messageToSend,
        },
        clubId, // 클럽 채팅 메시지 쿼리 갱신을 위해 전달
      },
      {
        onSuccess: () => {
          setMessage('')
          isSendingRef.current = false
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        },
        onError: () => {
          isSendingRef.current = false
        },
      },
    )
  }, [message, roomId, clubId, sendMessageMutation])

  if (
    isClubLoading ||
    !isChatRoomReady ||
    (isMessagesLoading && isChatRoomReady) ||
    joinClubChat.isPending
  ) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
      />
    )
  }

  if (!club) {
    return (
      <EmptyContent
        variant="error"
        message="소모임을 찾을 수 없습니다."
      />
    )
  }

  const dateLabel = messages.length > 0 ? formatDateLabel(messages[0].created_at) : ''

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-white overflow-hidden">
      {/* 메시지 목록 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        {dateLabel && (
          <p className="py-3 text-center text-[14px] font-normal leading-5 text-grey-8">
            {dateLabel}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-grey-8">아직 메시지가 없습니다.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const prev = messages[idx - 1]
              const showAvatar =
                !msg.is_own &&
                msg.sender_avatar &&
                (!prev || prev.sender_id !== msg.sender_id || prev.is_own)
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
                    msg.is_own ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!msg.is_own && showAvatar && msg.sender_avatar && (
                    <Image
                      src={msg.sender_avatar}
                      alt={msg.sender_name || ''}
                      width={38}
                      height={38}
                      className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
                      unoptimized
                    />
                  )}
                  {!msg.is_own && !showAvatar && <div className="w-[46px] shrink-0" />}
                  <div
                    className={cn(
                      'flex flex-col',
                      msg.is_own ? 'items-end' : 'items-start'
                    )}
                  >
                    {!msg.is_own && showAvatar && msg.sender_name && (
                      <span className="mb-1 px-2 text-[12px] font-normal leading-[14px] text-grey-8">
                        {msg.sender_name}
                      </span>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3',
                        msg.is_own
                          ? 'bg-primary-lighter text-black'
                          : 'bg-grey-2 text-black'
                      )}
                    >
                      <p className="text-[16px] font-normal leading-[22px] whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    <span className="mt-1 px-2 text-[12px] font-normal leading-[14px] text-grey-8">
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t border-grey-2 bg-white px-4 py-3 pb-6">
        <MessageInput
          type={INPUT_BAR_TYPE.CHAT}
          value={message}
          onChange={(value) => setMessage(value)}
          onSend={handleSend}
          isSubmitting={!roomId || sendMessageMutation.isPending}
          className="rounded-[24px] bg-grey-2"
        />
      </div>
    </div>
  )
}
