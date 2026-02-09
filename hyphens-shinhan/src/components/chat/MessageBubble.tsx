'use client'

import type { ChatMessage } from '@/types/chat'
import { formatMessageTimestamp } from '@/utils/chat-utils'
import Avatar from '@/components/common/Avatar'
import { cn } from '@/utils/cn'

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  otherUserAvatar?: string | null
}

export default function MessageBubble({
  message,
  isOwn,
  otherUserAvatar,
}: MessageBubbleProps) {
  if (message.deleted_at) {
    return (
      <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
        <div className="px-4 py-2 bg-grey-2 rounded-xl">
          <p className="body-8 text-grey-8 italic">삭제된 메시지</p>
        </div>
      </div>
    )
  }

  if (isOwn) {
    return (
      <div className="flex justify-end items-end gap-1.5 px-4">
        <span className="font-caption-caption4 text-grey-8 mb-1">
          {formatMessageTimestamp(message.created_at)}
        </span>
        <div className="bg-primary-lighter px-4 py-3 rounded-2xl max-w-[70%]">
          <p className="body-6 text-grey-11 whitespace-pre-wrap break-words leading-[22px]">
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4">
      <Avatar
        src={otherUserAvatar ?? undefined}
        alt=""
        size={32}
        className="rounded-full shrink-0"
      />
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="bg-grey-2 px-4 py-3 rounded-2xl">
          <p className="body-6 text-grey-11 whitespace-pre-wrap break-words leading-[22px]">
            {message.content}
          </p>
        </div>
        <span className="font-caption-caption4 text-grey-8 mt-1 ml-1">
          {formatMessageTimestamp(message.created_at)}
        </span>
      </div>
    </div>
  )
}
