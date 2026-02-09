'use client'

import { useState } from 'react'
import type { ChatMessage } from '@/types/chat'
import { formatMessageTimestamp } from '@/utils/chat'
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
  const [imageError, setImageError] = useState(false)
  const avatarUrl = otherUserAvatar

  if (isOwn) {
    return (
      <div className="flex justify-end items-end gap-1 px-4">
        <span className="text-xs text-grey-6 mb-1">
          {formatMessageTimestamp(message.created_at)}
        </span>
        <div className="bg-primary-shinhanblue/10 px-4 py-3 rounded-2xl max-w-[70%]">
          <p className="text-base text-grey-10 whitespace-pre-wrap wrap-break-word leading-[22px]">
            {message.content}
          </p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((att) => (
                <div key={att.id}>
                  {att.type === 'image' && (
                    <img
                      src={att.url}
                      alt={att.name ?? 'Attachment'}
                      className="max-w-full rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4">
      <div className="w-8 h-8 rounded-full bg-grey-2 shrink-0 overflow-hidden">
        {avatarUrl && !imageError ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-grey-3" />
        )}
      </div>
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="bg-grey-2 px-4 py-3 rounded-2xl">
          <p className="text-base text-grey-10 whitespace-pre-wrap wrap-break-word leading-[22px]">
            {message.content}
          </p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((att) => (
                <div key={att.id}>
                  {att.type === 'image' && (
                    <img
                      src={att.url}
                      alt={att.name ?? 'Attachment'}
                      className="max-w-full rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-grey-6 mt-1 ml-1">
          {formatMessageTimestamp(message.created_at)}
        </span>
      </div>
    </div>
  )
}
