'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@/contexts/ChatContext'
import MessageBubble from './MessageBubble'
import { groupMessagesByDate } from '@/utils/chat'
import { cn } from '@/utils/cn'

interface MessageListProps {
  roomId: string
  otherUserAvatar?: string | null
}

export default function MessageList({ roomId, otherUserAvatar }: MessageListProps) {
  const { messagesByRoomId, currentUserId } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messages = messagesByRoomId.get(roomId) ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-sm text-grey-6">로딩 중...</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <p className="text-sm text-grey-6 mb-1">메시지가 없습니다</p>
          <p className="text-xs text-grey-5">대화를 시작해보세요!</p>
        </div>
      </div>
    )
  }

  const grouped = groupMessagesByDate(messages)

  return (
    <div className={cn('flex-1 overflow-y-auto space-y-4')}>
      {Array.from(grouped.entries()).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          <div className="text-center mb-6">
            <span className="text-sm text-grey-6">{dateKey}</span>
          </div>
          <div className="space-y-3">
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
                otherUserAvatar={otherUserAvatar}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
