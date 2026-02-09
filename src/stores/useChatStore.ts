import { create } from 'zustand'
import type { ChatMessage, Conversation } from '@/types/chat'
import { getConversations, getMessages, sendMessage, markAsRead } from '@/services/chat'

interface ChatState {
  conversations: Conversation[]
  messages: Map<string, ChatMessage[]>
  isLoading: boolean
  loadConversations: (userId: string) => Promise<void>
  loadMessages: (userId: string, otherUserId: string) => Promise<void>
  addMessage: (message: ChatMessage) => void
  sendMessage: (senderId: string, recipientId: string, content: string) => Promise<ChatMessage>
  markAsRead: (userId: string, otherUserId: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: new Map(),
  isLoading: true,

  loadConversations: async (userId: string) => {
    if (!userId) {
      set({ conversations: [], isLoading: false })
      return
    }
    set({ isLoading: true })
    try {
      const conversations = await getConversations(userId)
      set({ conversations, isLoading: false })
    } catch (e) {
      console.error('Failed to load conversations:', e)
      set({ conversations: [], isLoading: false })
    }
  },

  loadMessages: async (userId: string, otherUserId: string) => {
    if (!userId) return
    try {
      const list = await getMessages(userId, otherUserId)
      const conversationId = [userId, otherUserId].sort().join('_')
      set((state) => {
        const next = new Map(state.messages)
        next.set(conversationId, list)
        return { messages: next }
      })
    } catch (e) {
      console.error('Failed to load messages:', e)
    }
  },

  addMessage: (message: ChatMessage) => {
    const conversationId = [message.sender_id, message.recipient_id].sort().join('_')
    set((state) => {
      const next = new Map(state.messages)
      const existing = next.get(conversationId) || []
      next.set(conversationId, [...existing, message])
      return { messages: next }
    })
  },

  sendMessage: async (senderId: string, recipientId: string, content: string) => {
    const message = await sendMessage(senderId, recipientId, content)
    get().addMessage(message)
    return message
  },

  markAsRead: async (userId: string, otherUserId: string) => {
    await markAsRead(userId, otherUserId)
  },
}))
