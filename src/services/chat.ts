/**
 * Chat API service (plimate-server).
 * GET /api/v1/chats, POST /api/v1/chats/message/{user_id}, GET/POST /api/v1/chats/{room_id}/messages.
 * Set CHAT_API_DETACHED=true to skip network calls and return empty data (for UI-only).
 */
import apiClient from './apiClient'
import type {
  ChatRoomListResponse,
  ChatRoomResponse,
  MessageListResponse,
  MessageCreate,
  MessageResponse,
  ChatMessage,
  ChatRoomListItem,
  ChatRoomMember,
} from '@/types/chat'

const CHATS_PREFIX = '/api/v1/chats'

/** When false (default), chat API is detached: no network calls, empty/mock data. Set NEXT_PUBLIC_CHAT_API_ENABLED=true to enable. */
const CHAT_API_DETACHED = process.env.NEXT_PUBLIC_CHAT_API_ENABLED !== 'true'

/** List all chat rooms (ordered by most recent message). */
export async function getChatRooms(): Promise<ChatRoomResponse[]> {
  if (CHAT_API_DETACHED) return []
  const { data } = await apiClient.get<ChatRoomListResponse>(CHATS_PREFIX)
  return data.rooms ?? []
}

/** Create or get 1:1 DM room with target user. Returns room. */
export async function createOrGetDmRoom(targetUserId: string): Promise<ChatRoomResponse> {
  if (CHAT_API_DETACHED) {
    return {
      id: `detached-${targetUserId}`,
      type: 'DM',
      created_at: new Date().toISOString(),
      members: [{ id: targetUserId, name: '알 수 없음', avatar_url: null }],
      club_id: null,
      name: null,
      image_url: null,
      last_message: null,
    }
  }
  const { data } = await apiClient.post<ChatRoomResponse>(
    `${CHATS_PREFIX}/message/${encodeURIComponent(targetUserId)}`
  )
  return data
}

/** Get paginated messages for a room. */
export async function getMessages(
  roomId: string,
  cursor?: string | null,
  limit = 30
): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  if (CHAT_API_DETACHED) return { messages: [], hasMore: false }
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  params.set('limit', String(limit))
  const { data } = await apiClient.get<MessageListResponse>(
    `${CHATS_PREFIX}/${encodeURIComponent(roomId)}/messages`,
    { params }
  )
  const messages = (data.messages || []).map((msg) => messageResponseToChatMessage(msg))
  return { messages, hasMore: data.has_more ?? false }
}

/** Send a message to a room. */
export async function sendMessage(
  roomId: string,
  body: MessageCreate
): Promise<MessageResponse> {
  if (CHAT_API_DETACHED) {
    return {
      id: `detached-${Date.now()}`,
      sender_id: null,
      sender_name: null,
      sender_avatar_url: null,
      room_id: roomId,
      sent_at: new Date().toISOString(),
      message: body.message ?? null,
      file_urls: body.file_urls ?? null,
    }
  }
  const { data } = await apiClient.post<MessageResponse>(
    `${CHATS_PREFIX}/${encodeURIComponent(roomId)}/messages`,
    body
  )
  return data
}

/** Map plimate MessageResponse to UI ChatMessage (recipient_id must be set by caller for 1:1). */
export function messageResponseToChatMessage(
  msg: MessageResponse,
  recipientId?: string
): ChatMessage {
  return {
    id: msg.id,
    sender_id: msg.sender_id ?? '',
    recipient_id: recipientId ?? '',
    content: msg.message ?? '',
    created_at: msg.sent_at,
    sender: msg.sender_id
      ? {
          id: msg.sender_id,
          name: msg.sender_name ?? '',
          avatar: msg.sender_avatar_url ?? undefined,
        }
      : undefined,
    attachments:
      msg.file_urls?.map((url, i) => ({
        id: `att_${msg.id}_${i}`,
        url,
        type: 'image' as const,
      })) ?? [],
  }
}

/** Map plimate ChatRoomResponse to list item. currentUserId used to get "other" member in DM. */
export function roomToListItem(
  room: ChatRoomResponse,
  currentUserId?: string
): ChatRoomListItem {
  const other = getOtherMember(room, currentUserId)
  const last = room.last_message
  return {
    id: room.id,
    type: room.type,
    otherUserId: other?.id ?? '',
    otherUserName: other?.name ?? '알 수 없음',
    otherUserAvatar: other?.avatar_url ?? null,
    lastMessageContent: last?.message ?? null,
    lastMessageAt: last?.sent_at ?? room.created_at,
  }
}

/** Get the other member in a 1:1 room (exclude current user). */
export function getOtherMember(
  room: ChatRoomResponse,
  currentUserId?: string
): ChatRoomMember | null {
  if (!room.members?.length) return null
  if (currentUserId && room.members.length === 2) {
    return room.members.find((m) => m.id !== currentUserId) ?? room.members[0] ?? null
  }
  return room.members[0] ?? null
}
