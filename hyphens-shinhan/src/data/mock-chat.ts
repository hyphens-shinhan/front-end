import type { ChatMessage, Conversation } from '@/types/chat'

/** Mock current user ID (YB scholar) */
export const MOCK_CURRENT_USER_ID = 'user1'

/** Placeholder avatar base for consistent mock avatars */
const AVATAR_BASE = 'https://api.dicebear.com/7.x/initials/svg?seed='

function getMockAvatar(id: string): string {
  return `${AVATAR_BASE}${encodeURIComponent(id)}`
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    user1_id: MOCK_CURRENT_USER_ID,
    user2_id: 'user2',
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_message_content: '안녕! 인턴십 준비는 어떻게 되고 있어?',
    unread_count_user1: 0,
    unread_count_user2: 2,
    pinned_user1: false,
    pinned_user2: false,
    muted_user1: false,
    muted_user2: false,
    other_user: {
      id: 'user2',
      name: '김철수',
      avatar: getMockAvatar('user2'),
    },
    unread_count: 0,
    is_pinned: false,
    is_muted: false,
  },
  {
    id: 'conv2',
    user1_id: MOCK_CURRENT_USER_ID,
    user2_id: 'user3',
    last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_message_content: '장학금 조언 감사해요!',
    unread_count_user1: 0,
    unread_count_user2: 0,
    pinned_user1: false,
    pinned_user2: false,
    muted_user1: false,
    muted_user2: false,
    other_user: {
      id: 'user3',
      name: '박민수',
      avatar: getMockAvatar('user3'),
    },
    unread_count: 0,
    is_pinned: false,
    is_muted: false,
  },
  {
    id: 'conv3',
    user1_id: MOCK_CURRENT_USER_ID,
    user2_id: 'user4',
    last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    last_message_content: '네트워킹 이벤트에 참석하실 건가요?',
    unread_count_user1: 1,
    unread_count_user2: 0,
    pinned_user1: false,
    pinned_user2: false,
    muted_user1: false,
    muted_user2: false,
    other_user: {
      id: 'user4',
      name: '이지은',
      avatar: getMockAvatar('user4'),
    },
    unread_count: 1,
    is_pinned: false,
    is_muted: false,
  },
  {
    id: 'conv4',
    user1_id: MOCK_CURRENT_USER_ID,
    user2_id: 'user5',
    last_message_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    last_message_content: '멘토링 세션 일정 확인 부탁드려요',
    unread_count_user1: 0,
    unread_count_user2: 0,
    pinned_user1: false,
    pinned_user2: false,
    muted_user1: false,
    muted_user2: false,
    other_user: {
      id: 'user5',
      name: '최수진',
      avatar: getMockAvatar('user5'),
    },
    unread_count: 0,
    is_pinned: false,
    is_muted: false,
  },
]

const mockMessage = (
  id: string,
  senderId: string,
  recipientId: string,
  content: string,
  createdAt: Date,
  senderName: string,
): ChatMessage => ({
  id,
  sender_id: senderId,
  recipient_id: recipientId,
  content,
  created_at: createdAt.toISOString(),
  sender: {
    id: senderId,
    name: senderName,
    avatar: getMockAvatar(senderId),
  },
})

/** Mock messages by sorted user IDs */
export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  user1_user2: [
    mockMessage('msg1', MOCK_CURRENT_USER_ID, 'user2', '인턴십 준비는 어떻게 되고 있어?', new Date(Date.now() - 2 * 60 * 60 * 1000), '나'),
    mockMessage('msg2', 'user2', MOCK_CURRENT_USER_ID, '잘 되고 있어! 구글 면접 기회를 받았어', new Date(Date.now() - 1 * 60 * 60 * 1000), '김철수'),
    mockMessage('msg3', MOCK_CURRENT_USER_ID, 'user2', '대단하네! 축하해!', new Date(Date.now() - 45 * 60 * 1000), '나'),
    mockMessage('msg4', 'user2', MOCK_CURRENT_USER_ID, '고마워! 면접 때문에 긴장되긴 해', new Date(Date.now() - 30 * 60 * 1000), '김철수'),
  ],
  user1_user3: [
    mockMessage('msg5', 'user3', MOCK_CURRENT_USER_ID, '장학금 신청 관련해서 질문이 있어서 연락드렸어요', new Date(Date.now() - 25 * 60 * 60 * 1000), '박민수'),
    mockMessage('msg6', MOCK_CURRENT_USER_ID, 'user3', '네, 무엇이 궁금하신가요?', new Date(Date.now() - 24 * 60 * 60 * 1000), '나'),
    mockMessage('msg7', 'user3', MOCK_CURRENT_USER_ID, '장학금 조언 감사해요!', new Date(Date.now() - 24 * 60 * 60 * 1000), '박민수'),
  ],
  user1_user4: [
    mockMessage('msg8', 'user4', MOCK_CURRENT_USER_ID, '안녕하세요! 네트워킹 이벤트에 참석하실 건가요?', new Date(Date.now() - 3 * 60 * 60 * 1000), '이지은'),
    mockMessage('msg9', MOCK_CURRENT_USER_ID, 'user4', '네, 참석할 예정이에요!', new Date(Date.now() - 2 * 60 * 60 * 1000), '나'),
  ],
  user1_user5: [
    mockMessage('msg10', MOCK_CURRENT_USER_ID, 'user5', '멘토링 세션 일정 확인 부탁드려요', new Date(Date.now() - 5 * 60 * 60 * 1000), '나'),
    mockMessage('msg11', 'user5', MOCK_CURRENT_USER_ID, '네, 확인했습니다. 다음 주 화요일 오후 2시로 예약되어 있어요', new Date(Date.now() - 4 * 60 * 60 * 1000), '최수진'),
  ],
}

export function getMockConversations(userId: string): Conversation[] {
  return MOCK_CONVERSATIONS.map((conv) => {
    const unread =
      conv.user1_id === userId ? conv.unread_count_user1 : conv.user2_id === userId ? conv.unread_count_user2 : 0
    return { ...conv, unread_count: unread }
  })
}

export function getMockMessages(userId: string, otherUserId: string): ChatMessage[] {
  const key = [userId, otherUserId].sort().join('_')
  let msgs = MOCK_MESSAGES[key] || []
  if (msgs.length === 0) {
    const mockKey = [MOCK_CURRENT_USER_ID, otherUserId].sort().join('_')
    msgs = MOCK_MESSAGES[mockKey] || []
  }
  if (msgs.length === 0) return []
  return msgs.map((m) => ({
    ...m,
    sender_id: m.sender_id === MOCK_CURRENT_USER_ID ? userId : m.sender_id,
    recipient_id: m.recipient_id === MOCK_CURRENT_USER_ID ? userId : m.recipient_id,
  }))
}
