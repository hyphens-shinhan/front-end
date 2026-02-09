/**
 * Chat types aligned with plimate-server API and UI.
 * Plimate: ChatRoomListResponse, ChatRoomResponse, MessageResponse, MessageCreate.
 */

/** Plimate: room type */
export type ChatRoomType = 'DM' | 'GROUP'

/** Plimate: ChatRoomMember (id, name, avatar_url) */
export interface ChatRoomMember {
  id: string
  name: string
  avatar_url: string | null
}

/** Plimate: MessageResponse (API response for a single message) */
export interface MessageResponse {
  id: string
  sender_id: string | null
  sender_name: string | null
  sender_avatar_url: string | null
  room_id: string
  sent_at: string
  message: string | null
  file_urls: string[] | null
}

/** Plimate: ChatRoomResponse (single room in list or create-or-get response) */
export interface ChatRoomResponse {
  id: string
  type: ChatRoomType
  created_at: string
  members: ChatRoomMember[]
  club_id: string | null
  name: string | null
  image_url: string | null
  last_message?: MessageResponse | null
}

/** Plimate: ChatRoomListResponse (GET /api/v1/chats) */
export interface ChatRoomListResponse {
  rooms: ChatRoomResponse[]
}

/** Plimate: MessageListResponse (GET /api/v1/chats/{room_id}/messages) */
export interface MessageListResponse {
  messages: MessageResponse[]
  has_more: boolean
}

/** Plimate: MessageCreate (POST body for send message) */
export interface MessageCreate {
  message?: string | null
  file_urls?: string[] | null
}

/** UI: normalized message for list/bubbles (from MessageResponse) */
export interface ChatMessage {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
  attachments?: { id: string; url: string; type: 'image' | 'file' | 'video'; name?: string; size?: number }[]
}

/** UI: list-item shape for conversation card (from ChatRoomResponse for 1:1) */
export interface ChatRoomListItem {
  id: string
  type: ChatRoomType
  otherUserId: string
  otherUserName: string
  otherUserAvatar: string | null
  lastMessageContent: string | null
  lastMessageAt: string
}
