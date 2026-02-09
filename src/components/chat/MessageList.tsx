'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores'
import { groupMessagesByDate } from '@/utils/chat-utils'
import MessageBubble from './MessageBubble'
import { cn } from '@/utils/cn'

interface MessageListProps {
  currentUserId: string
  otherUserId: string
  otherUserAvatar?: string | null
}

export default function MessageList({
  currentUserId,
  otherUserId,
  otherUserAvatar,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, loadMessages } = useChatStore()

  useEffect(() => {
    loadMessages(currentUserId, otherUserId)
  }, [currentUserId, otherUserId, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const conversationId = [currentUserId, otherUserId].sort().join('_')
  const conversationMessages = messages.get(conversationId) ?? []
  const grouped = groupMessagesByDate(conversationMessages)

  if (conversationMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="body-8 text-grey-8 mb-1">메시지가 없습니다</p>
          <p className="font-caption-caption4 text-grey-6">대화를 시작해보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex-1 overflow-y-auto space-y-4 pb-2')}>
      {Array.from(grouped.entries()).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          <div className="text-center mb-4">
            <span className="font-caption-caption2 text-grey-8">{dateKey}</span>
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
