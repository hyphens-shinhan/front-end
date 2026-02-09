'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useUserStore, useHeaderStore, useChatStore } from '@/stores'
import MessageList from './MessageList'
import ChatOptionsMenu from './ChatOptionsMenu'
import MessageInput from '@/components/common/MessageInput'
import { INPUT_BAR_TYPE } from '@/constants'
import { cn } from '@/utils/cn'
import { MOCK_CURRENT_USER_ID } from '@/data/mock-chat'

interface ChatViewProps {
  otherUserId: string
}

const MOCK_NAMES: Record<string, string> = {
  user2: '김철수',
  user3: '박민수',
  user4: '이지은',
  user5: '최수진',
}

export default function ChatView({ otherUserId }: ChatViewProps) {
  const user = useUserStore((s) => s.user)
  const { setCustomTitle, setHandlers, resetHandlers } = useHeaderStore()
  const {
    conversations,
    loadMessages,
    addMessage,
    sendMessage: sendMessageApi,
    markAsRead,
  } = useChatStore()

  const [otherUser, setOtherUser] = useState<{ id: string; name: string; avatar?: string } | null>(null)
  const [message, setMessage] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUserId = user?.id ?? MOCK_CURRENT_USER_ID

  useEffect(() => {
    if (!currentUserId) return
    const conv = conversations.find(
      (c) =>
        (c.user1_id === currentUserId && c.user2_id === otherUserId) ||
        (c.user2_id === currentUserId && c.user1_id === otherUserId),
    )
    if (conv?.other_user) {
      setOtherUser(conv.other_user)
    } else {
      setOtherUser({
        id: otherUserId,
        name: MOCK_NAMES[otherUserId] ?? '알 수 없음',
      })
    }
  }, [currentUserId, otherUserId, conversations])

  useEffect(() => {
    setCustomTitle(otherUser?.name ?? '채팅')
    return () => {
      setCustomTitle(null)
    }
  }, [otherUser?.name, setCustomTitle])

  useEffect(() => {
    setHandlers({
      onClick: () => setShowOptions((v) => !v),
    })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  useEffect(() => {
    if (!currentUserId) return
    loadMessages(currentUserId, otherUserId)
    markAsRead(currentUserId, otherUserId)
  }, [currentUserId, otherUserId, loadMessages, markAsRead])

  const handleSend = useCallback(() => {
    if (!currentUserId || !message.trim()) return
    sendMessageApi(currentUserId, otherUserId, message.trim()).then((msg) => {
      addMessage(msg)
      setMessage('')
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [currentUserId, otherUserId, message, sendMessageApi, addMessage])

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="body-8 text-grey-8">로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Optional dropdown for more menu (when header more is clicked) */}
      {showOptions && (
        <div className="fixed top-14 right-4 z-50">
          <ChatOptionsMenu
            otherUserId={otherUserId}
            onClose={() => setShowOptions(false)}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col pt-1">
        <MessageList
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          otherUserAvatar={otherUser?.avatar}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className={cn('shrink-0 border-t border-grey-2')}>
        <MessageInput
          type={INPUT_BAR_TYPE.CHAT}
          value={message}
          onChange={setMessage}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
