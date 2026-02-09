import type { ChatMessage, Conversation } from '@/types/chat'
import {
  getMockConversations,
  getMockMessages,
  MOCK_MESSAGES,
  MOCK_CONVERSATIONS,
} from '@/data/mock-chat'

function getAvatar(id: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(id)}`
}

export async function getConversations(userId: string): Promise<Conversation[]> {
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
  _attachments?: Array<{ url: string; type: string; name?: string; size?: number }>,
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
    if (conv.user1_id === recipientId) conv.unread_count_user1 = (conv.unread_count_user1 || 0) + 1
    else conv.unread_count_user2 = (conv.unread_count_user2 || 0) + 1
  }

  return newMessage
}

export async function markAsRead(_userId: string, _otherUserId: string): Promise<void> {
  // Mock only
}
