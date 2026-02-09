import apiClient from './apiClient'
import type {
  ChatMessage,
  Conversation,
  ChatRoomResponse,
  ChatRoomListResponse,
  MessageResponse,
  MessageCreate,
  MessageListResponse,
} from '@/types/chat'
import {
  getMockConversations,
  getMockMessages,
  MOCK_MESSAGES,
  MOCK_CONVERSATIONS,
} from '@/data/mock-chat'

const BASE = '/chats'

function getAvatar(id: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(id)}`
}

export async function getConversations(
  userId: string,
): Promise<Conversation[]> {
  if (!userId) return []
  return getMockConversations(userId)
}

export async function getMessages(
  userId: string,
  otherUserId: string,
  _limit = 50,
  _offset = 0,
): Promise<ChatMessage[]> {
  const messages = getMockMessages(userId, otherUserId)
  return messages
}

export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string,
  _attachments?: Array<{
    url: string
    type: string
    name?: string
    size?: number
  }>,
): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    sender_id: senderId,
    recipient_id: recipientId,
    content,
    created_at: new Date().toISOString(),
    sender: {
      id: senderId,
      name: '나',
      avatar: getAvatar(senderId),
    },
  }

  const key = [senderId, recipientId].sort().join('_')
  if (!MOCK_MESSAGES[key]) MOCK_MESSAGES[key] = []
  MOCK_MESSAGES[key].push(newMessage)

  let conv = MOCK_CONVERSATIONS.find(
    (c) =>
      (c.user1_id === senderId && c.user2_id === recipientId) ||
      (c.user1_id === recipientId && c.user2_id === senderId),
  )
  if (!conv) {
    conv = {
      id: `conv_${Date.now()}`,
      user1_id: senderId,
      user2_id: recipientId,
      last_message_at: newMessage.created_at,
      last_message_content: content,
      unread_count_user1: 0,
      unread_count_user2: 1,
      pinned_user1: false,
      pinned_user2: false,
      muted_user1: false,
      muted_user2: false,
      other_user: {
        id: recipientId,
        name: `User ${recipientId.slice(-4)}`,
        avatar: getAvatar(recipientId),
      },
      unread_count: 0,
      is_pinned: false,
      is_muted: false,
    }
    MOCK_CONVERSATIONS.push(conv)
  } else {
    conv.last_message_at = newMessage.created_at
    conv.last_message_content = content
    if (conv.user1_id === recipientId)
      conv.unread_count_user1 = (conv.unread_count_user1 || 0) + 1
    else conv.unread_count_user2 = (conv.unread_count_user2 || 0) + 1
  }

  return newMessage
}

export async function markAsRead(
  _userId: string,
  _otherUserId: string,
): Promise<void> {
  // Mock only
}

// ========== Group Chat API Service (새로운 통합 채팅 API) ==========

/**
 * 채팅 API 서비스
 * Base: /api/v1/chats | 인증: Bearer
 */
export const ChatService = {
  /**
   * 클럽 채팅방 입장/생성 (POST /clubs/{club_id}/join)
   * 클럽 멤버만 접근 가능
   */
  joinClubChat: async (clubId: string): Promise<ChatRoomResponse> => {
    const response = await apiClient.post<ChatRoomResponse>(
      `/clubs/${clubId}/join`,
    )
    return response.data
  },

  /**
   * 클럽 채팅방 나가기 (POST /clubs/{club_id}/leave)
   */
  leaveClubChat: async (clubId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/clubs/${clubId}/leave`,
    )
    return response.data
  },

  /**
   * 클럽 채팅 메시지 조회 (GET /clubs/{club_id}/messages)
   * @param cursor 마지막 메시지 ID (페이징용)
   * @param limit 기본 30
   */
  getClubChatMessages: async (
    clubId: string,
    params?: { cursor?: string; limit?: number },
  ): Promise<MessageListResponse> => {
    const response = await apiClient.get<MessageListResponse>(
      `/clubs/${clubId}/messages`,
      { params },
    )
    return response.data
  },

  /**
   * 채팅방 목록 조회 (GET /)
   * 내가 속한 모든 채팅방 목록, 최신 메시지순
   */
  getChatRooms: async (): Promise<ChatRoomListResponse> => {
    const response = await apiClient.get<ChatRoomListResponse>(BASE)
    return response.data
  },

  /**
   * 특정 채팅방 메시지 조회 (GET /{room_id}/messages)
   * @param cursor 마지막 메시지 ID (페이징용)
   * @param limit 기본값 없음
   */
  getMessages: async (
    roomId: string,
    params?: { cursor?: string; limit?: number },
  ): Promise<MessageListResponse> => {
    const response = await apiClient.get<MessageListResponse>(
      `${BASE}/${roomId}/messages`,
      { params },
    )
    return response.data
  },

  /**
   * 메시지 전송 (POST /{room_id}/messages)
   */
  sendMessage: async (
    roomId: string,
    data: MessageCreate,
  ): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      `${BASE}/${roomId}/messages`,
      data,
    )
    return response.data
  },

  /**
   * DM 생성/조회 (POST /message/{user_id})
   * 상호 팔로우 필요
   */
  createOrGetDM: async (userId: string): Promise<ChatRoomResponse> => {
    const response = await apiClient.post<ChatRoomResponse>(
      `${BASE}/message/${userId}`,
    )
    return response.data
  },
}
