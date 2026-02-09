'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useMe } from '@/hooks/user/useUser'
import * as ChatService from '@/services/chat'
import type { ChatMessage, ChatRoomListItem, ChatRoomResponse } from '@/types/chat'

interface ChatContextType {
  rooms: ChatRoomResponse[]
  listItems: ChatRoomListItem[]
  messagesByRoomId: Map<string, ChatMessage[]>
  loadRooms: () => Promise<void>
  loadMessages: (roomId: string, otherUserId?: string) => Promise<void>
  addMessage: (roomId: string, message: ChatMessage) => void
  isLoadingRooms: boolean
  currentUserId: string | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { data: me } = useMe()
  const currentUserId = me?.id ?? null

  const [rooms, setRooms] = useState<ChatRoomResponse[]>([])
  const [messagesByRoomId, setMessagesByRoomId] = useState<Map<string, ChatMessage[]>>(new Map())
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)

  const loadRooms = useCallback(async () => {
    if (!currentUserId) {
      setRooms([])
      return
    }
    setIsLoadingRooms(true)
    try {
      const list = await ChatService.getChatRooms()
      setRooms(list)
    } catch (err) {
      console.error('ChatContext: loadRooms failed', err)
      setRooms([])
    } finally {
      setIsLoadingRooms(false)
    }
  }, [currentUserId])

  const loadMessages = useCallback(
    async (roomId: string, otherUserId?: string) => {
      if (!currentUserId) return
      try {
        const { messages } = await ChatService.getMessages(roomId)
        const withRecipient = messages.map((m) => {
          const recipientId =
            m.sender_id === currentUserId ? otherUserId ?? '' : currentUserId
          return { ...m, recipient_id: recipientId }
        })
        setMessagesByRoomId((prev) => {
          const next = new Map(prev)
          next.set(roomId, withRecipient)
          return next
        })
      } catch (err) {
        console.error('ChatContext: loadMessages failed', err)
      }
    },
    [currentUserId]
  )

  const addMessage = useCallback((roomId: string, message: ChatMessage) => {
    setMessagesByRoomId((prev) => {
      const next = new Map(prev)
      const list = next.get(roomId) ?? []
      next.set(roomId, [...list, message])
      return next
    })
  }, [])

  useEffect(() => {
    if (currentUserId) {
      loadRooms()
    } else {
      setRooms([])
    }
  }, [currentUserId, loadRooms])

  const listItems: ChatRoomListItem[] = rooms.map((room) =>
    ChatService.roomToListItem(room, currentUserId ?? undefined)
  )

  const value: ChatContextType = {
    rooms,
    listItems,
    messagesByRoomId,
    loadRooms,
    loadMessages,
    addMessage,
    isLoadingRooms,
    currentUserId,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (ctx === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return ctx
}
