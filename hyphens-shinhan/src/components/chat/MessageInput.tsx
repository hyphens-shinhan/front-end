'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface MessageInputProps {
  onSend: (content: string) => void
  placeholder?: string
}

export default function MessageInput({
  onSend,
  placeholder = '메시지 입력하기',
}: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    onSend(trimmed)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('bg-grey-1 px-4 py-3 pb-6 lg:pb-3 shrink-0 border-t border-grey-2')}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'flex-1 h-11 px-4 bg-white rounded-xl text-[15px] text-grey-10',
            'placeholder:text-grey-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
            'border border-grey-2'
          )}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          className={cn(
            'w-11 h-11 rounded-xl bg-primary-shinhanblue text-white flex items-center justify-center shrink-0',
            'transition-colors hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
          )}
          aria-label="전송"
        >
          <Icon name="IconLLineArrowSend2" size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}
