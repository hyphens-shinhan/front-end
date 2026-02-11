/** Chat-related TypeScript interfaces */

export interface MessageAttachment {
  id: string
  url: string
  type: 'image' | 'file' | 'video'
  name?: string
  size?: number
}

export interface ChatMessage {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  attachments?: MessageAttachment[]
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  read_at?: string | null
  sender?: {
    id: string
    name: string
    avatar?: string
  }
  recipient?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface Conversation {
  id: string
  user1_id: string
  user2_id: string
  last_message_at: string
  last_message_content?: string | null
  unread_count_user1: number
  unread_count_user2: number
  pinned_user1: boolean
  pinned_user2: boolean
  muted_user1: boolean
  muted_user2: boolean
  other_user?: {
    id: string
    name: string
    avatar?: string
  }
  last_message?: ChatMessage
  unread_count?: number
  is_pinned?: boolean
  is_muted?: boolean
}

// ========== Group Chat API Types (새로운 통합 채팅 API) ==========

/** 채팅방 타입 */
export type ChatRoomType = 'DM' | 'GROUP'

/** 채팅방 멤버 */
export interface ChatRoomMember {
  id: string // UUID
  name: string
  avatar_url: string | null
}

/** 메시지 응답 (DM + GROUP 공통) */
export interface MessageResponse {
  id: string // UUID
  sender_id: string | null // UUID | null (익명일 때 null)
  sender_name: string | null
  sender_avatar_url: string | null
  room_id: string // UUID
  sent_at: string // ISO datetime
  message: string | null
  file_urls: string[] | null
}

/** 메시지 생성 요청 */
export interface MessageCreate {
  message?: string | null
  file_urls?: string[] | null
}

/** 메시지 목록 응답 */
export interface MessageListResponse {
  messages: MessageResponse[]
  has_more: boolean
}

/** 채팅방 응답 */
export interface ChatRoomResponse {
  id: string // UUID
  type: ChatRoomType
  created_at: string // ISO datetime
  members: ChatRoomMember[]
  club_id: string | null // UUID | null (GROUP일 때만)
  name: string | null // GROUP일 때 클럽명
  image_url: string | null // GROUP일 때 클럽 이미지
  last_message: MessageResponse | null
  unread_count: number
}

/** 채팅방 목록 응답 */
export interface ChatRoomListResponse {
  rooms: ChatRoomResponse[]
}
