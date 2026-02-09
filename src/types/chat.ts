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
