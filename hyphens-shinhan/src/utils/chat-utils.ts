import type { ChatMessage, Conversation } from '@/types/chat'

export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function formatConversationTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / 86400000)

  if (diffDays === 0) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  if (diffDays === 1) return '어제'
  if (diffDays < 7) {
    return date.toLocaleDateString('ko-KR', { weekday: 'short' })
  }
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function groupMessagesByDate(messages: ChatMessage[]): Map<string, ChatMessage[]> {
  const grouped = new Map<string, ChatMessage[]>()
  messages.forEach((message) => {
    const date = new Date(message.created_at)
    const dateKey = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(message)
  })
  return grouped
}

export function getConversationId(user1Id: string, user2Id: string): string {
  return [user1Id, user2Id].sort().join('_')
}

export function getUnreadCount(conversation: Conversation, currentUserId: string): number {
  return conversation.user1_id === currentUserId
    ? conversation.unread_count_user1
    : conversation.unread_count_user2
}
