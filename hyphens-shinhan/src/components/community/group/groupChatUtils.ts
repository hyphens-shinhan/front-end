import type { MessageResponse } from '@/types/chat'

/** Group message for UI */
export interface GroupChatMessage {
  id: string
  sender_id: string | null
  sender_name: string | null
  sender_avatar: string | null
  content: string
  created_at: string
  is_own: boolean
}

export function formatMessageTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function convertMessageToGroupChatMessage(
  msg: MessageResponse,
  currentUserId: string | null,
): GroupChatMessage {
  return {
    id: msg.id,
    sender_id: msg.sender_id,
    sender_name: msg.sender_name,
    sender_avatar: msg.sender_avatar_url,
    content: msg.message || '',
    created_at: msg.sent_at,
    is_own: msg.sender_id === currentUserId,
  }
}
