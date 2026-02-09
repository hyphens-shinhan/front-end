'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useClub } from '@/hooks/clubs/useClubs'
import { useHeaderStore } from '@/stores'
import MessageInput from '@/components/common/MessageInput'
import { INPUT_BAR_TYPE } from '@/constants'
import { cn } from '@/utils/cn'

/** Mock group message for UI (no real API yet) */
interface GroupChatMessage {
  id: string
  sender_id: string
  sender_name?: string
  sender_avatar?: string
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

function getMockMessages(currentUserId: string): GroupChatMessage[] {
  const base = new Date()
  base.setDate(20)
  base.setMonth(0)
  base.setFullYear(2026)
  const t1 = new Date(base)
  t1.setHours(13, 12, 0)
  const t2 = new Date(base)
  t2.setHours(13, 13, 0)
  return [
    {
      id: '1',
      sender_id: 'user1',
      sender_name: '멤버1',
      sender_avatar: 'https://placehold.co/38x38',
      content: '안녕하세요~',
      created_at: t1.toISOString(),
      is_own: false,
    },
    {
      id: '2',
      sender_id: currentUserId,
      content: '안녕하세요!! 잘 부탁드립니다!',
      created_at: t1.toISOString(),
      is_own: true,
    },
    {
      id: '3',
      sender_id: 'user2',
      sender_name: '멤버2',
      sender_avatar: 'https://placehold.co/38x38',
      content: '반갑습니다!!',
      created_at: t1.toISOString(),
      is_own: false,
    },
    {
      id: '4',
      sender_id: 'user3',
      sender_name: '멤버3',
      sender_avatar: 'https://placehold.co/38x38',
      content: '새로운 분이 오셔서 좋네요 ㅎㅎ',
      created_at: t2.toISOString(),
      is_own: false,
    },
    {
      id: '5',
      sender_id: 'user3',
      content: '저희 이번주는',
      created_at: t2.toISOString(),
      is_own: false,
    },
    {
      id: '6',
      sender_id: 'user3',
      content: '금요일 3시에 스터디 있습니다!',
      created_at: t2.toISOString(),
      is_own: false,
    },
  ]
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
  const { data: club, isLoading } = useClub(clubId)
  const { setCustomTitle, setHandlers, resetHandlers } = useHeaderStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<GroupChatMessage[]>([])
  const [message, setMessage] = useState('')
  const currentUserId = 'current_user'

  useEffect(() => {
    setMessages(getMockMessages(currentUserId))
  }, [])

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
    if (!message.trim()) return
    const newMsg: GroupChatMessage = {
      id: `msg_${Date.now()}`,
      sender_id: currentUserId,
      content: message.trim(),
      created_at: new Date().toISOString(),
      is_own: true,
    }
    setMessages((prev) => [...prev, newMsg])
    setMessage('')
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [message])

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-grey-8">로딩 중...</p>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-grey-8">소모임을 찾을 수 없습니다.</p>
      </div>
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
          {messages.map((msg, idx) => {
            const prev = messages[idx - 1]
            const showAvatar =
              !msg.is_own &&
              (msg.sender_avatar ?? true) &&
              (!prev || prev.sender_id !== msg.sender_id || prev.is_own)
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.is_own ? 'justify-end' : 'justify-start'
                )}
              >
                {!msg.is_own && showAvatar && (
                  <img
                    src={msg.sender_avatar ?? 'https://placehold.co/38x38'}
                    alt=""
                    className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
                  />
                )}
                {!msg.is_own && !showAvatar && <div className="w-[46px] shrink-0" />}
                <div
                  className={cn(
                    'flex flex-col',
                    msg.is_own ? 'items-end' : 'items-start'
                  )}
                >
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
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t border-grey-2 bg-white px-4 py-3 pb-6">
        <MessageInput
          type={INPUT_BAR_TYPE.CHAT}
          value={message}
          onChange={setMessage}
          onSend={handleSend}
          className="rounded-[24px] bg-grey-2"
        />
      </div>
    </div>
  )
}
