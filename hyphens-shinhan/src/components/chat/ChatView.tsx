'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/contexts/ChatContext'
import { useHeaderStore } from '@/stores'
import * as ChatService from '@/services/chat'
import { ROUTES } from '@/constants'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { cn } from '@/utils/cn'

interface ChatViewProps {
  otherUserId: string
}

export default function ChatView({ otherUserId }: ChatViewProps) {
  const router = useRouter()
  const setCustomTitle = useHeaderStore((s) => s.setCustomTitle)
  const {
    currentUserId,
    loadMessages,
    addMessage,
    messagesByRoomId,
  } = useChat()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [otherUserName, setOtherUserName] = useState<string>('알 수 없음')
  const [otherUserAvatar, setOtherUserAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!currentUserId || !otherUserId) {
        setIsLoading(false)
        return
      }
      setError(null)
      setIsLoading(true)
      try {
        const room = await ChatService.createOrGetDmRoom(otherUserId)
        if (cancelled) return
        setRoomId(room.id)
        const other = ChatService.getOtherMember(room, currentUserId)
        if (other) {
          setOtherUserName(other.name)
          setOtherUserAvatar(other.avatar_url)
        }
        setCustomTitle(other?.name ?? '알 수 없음')
        await loadMessages(room.id, otherUserId)
      } catch (err) {
        if (!cancelled) {
          console.error('ChatView: init failed', err)
          setError('대화를 불러올 수 없습니다.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    init()
    return () => {
      cancelled = true
      setCustomTitle(null)
    }
  }, [currentUserId, otherUserId, loadMessages, setCustomTitle])

  const handleSend = async (content: string) => {
    if (!roomId || !currentUserId) return
    try {
      const res = await ChatService.sendMessage(roomId, { message: content })
      const chatMessage = ChatService.messageResponseToChatMessage(res, otherUserId)
      addMessage(roomId, {
        ...chatMessage,
        sender_id: chatMessage.sender_id || currentUserId,
      })
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('ChatView: send failed', err)
      alert('메시지 전송에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-grey-6">로딩 중...</p>
      </div>
    )
  }

  if (error || !roomId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <p className="text-sm text-grey-6">{error ?? '대화를 불러올 수 없습니다.'}</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.CHAT)}
          className="text-sm font-medium text-primary-shinhanblue"
        >
          채팅 목록으로
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col flex-1 min-h-0 bg-white')}>
      <div className={cn('flex-1 overflow-hidden flex flex-col min-h-0 pt-1')}>
        <MessageList roomId={roomId} otherUserAvatar={otherUserAvatar} />
        <div ref={messagesEndRef} />
      </div>
      <div className="shrink-0">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}
