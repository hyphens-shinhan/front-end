import { ROUTES } from '@/constants'
import type {
  NotificationResponse,
  NotificationType,
  NotificationItem,
} from '@/types/notification'
import type { IconName } from '@/components/common/Icon'

const TYPE_ICON: Record<NotificationType, IconName> = {
  LIKE: 'IconLBoldHeart',
  COMMENT: 'IconLBoldMessageText',
  COMMENT_REPLY: 'IconLBoldMessageText',
  CHAT_MESSAGE: 'IconLBoldMessages3',
  FOLLOW_REQUEST: 'IconLBoldProfile2user',
  FOLLOW_ACCEPT: 'IconLBoldProfile2user',
  REPORT_EXPORT: 'IconLBoldDocumentDownload',
  MENTORING_REQUEST: 'IconLBoldTeacher',
  MENTORING_ACCEPTED: 'IconLBoldTeacher',
}

function getTitleAndBody(
  type: NotificationType,
  actorName: string | null,
): { title: string; body: string } {
  const name = actorName ?? '알 수 없음'
  switch (type) {
    case 'LIKE':
      return { title: '좋아요', body: `${name}님이 게시글을 좋아요 했어요.` }
    case 'COMMENT':
      return { title: '새로운 댓글', body: `${name}님이 댓글을 남겼어요.` }
    case 'COMMENT_REPLY':
      return { title: '답글', body: `${name}님이 답글을 남겼어요.` }
    case 'CHAT_MESSAGE':
      return {
        title: '새로운 메시지',
        body: `${name}님의 메시지가 도착했어요.`,
      }
    case 'FOLLOW_REQUEST':
      return { title: '팔로우 요청', body: `${name}님이 팔로우를 요청했어요.` }
    case 'FOLLOW_ACCEPT':
      return {
        title: '친구가 되었어요!',
        body: `${name}님이 팔로우를 수락했어요.`,
      }
    case 'REPORT_EXPORT':
      return { title: '보고서 제출', body: '제출이 완료되었어요.' }
    case 'MENTORING_REQUEST':
      return { title: '멘토링 요청', body: `${name}님이 멘토링을 요청했어요.` }
    case 'MENTORING_ACCEPTED':
      return { title: '멘토링 수락', body: `${name}님이 멘토링을 수락했어요.` }
    default:
      return { title: '알림', body: '새로운 알림이 있어요.' }
  }
}

/** ISO datetime → YYYY.MM.DD */
function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

/** ISO datetime → HH:mm */
function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * API 단건 응답을 리스트 UI용 NotificationItem으로 변환
 */
export function mapNotificationToItem(
  res: NotificationResponse,
): NotificationItem {
  const { title, body } = getTitleAndBody(res.type, res.actor?.name ?? null)
  return {
    id: res.id,
    type: res.type,
    title,
    body,
    date: formatDate(res.created_at),
    time: formatTime(res.created_at),
    unread: !res.is_read,
    icon: TYPE_ICON[res.type],
    post_id: res.post_id ?? null,
    room_id: res.room_id ?? null,
    actor_id: res.actor?.id ?? null,
    club_id: res.club_id ?? null,
  }
}

/**
 * 알림 type·id에 맞는 상세 페이지 경로 반환. 이동할 수 없으면 null.
 */
export function getNotificationDetailPath(
  item: NotificationItem,
): string | null {
  switch (item.type) {
    case 'LIKE':
    case 'COMMENT':
    case 'COMMENT_REPLY':
      return item.post_id
        ? `${ROUTES.COMMUNITY.FEED.DETAIL}/${item.post_id}`
        : null
    case 'CHAT_MESSAGE':
      if (item.club_id) {
        return `${ROUTES.COMMUNITY.GROUP.DETAIL}/${item.club_id}/chat`
      }
      // DM: /chat/[userId] 는 상대방 user id 필요. room_id(채팅방 UUID)가 아닌 actor_id(메시지 보낸 사람) 사용
      return item.actor_id ? `${ROUTES.CHAT}/${item.actor_id}` : null
    case 'FOLLOW_REQUEST':
    case 'FOLLOW_ACCEPT':
      return item.actor_id ? ROUTES.MYPAGE.PUBLIC_PROFILE(item.actor_id) : null
    case 'MENTORING_REQUEST':
    case 'MENTORING_ACCEPTED':
      return item.actor_id ? `${ROUTES.MENTORS.MAIN}/${item.actor_id}` : null
    case 'REPORT_EXPORT':
      return ROUTES.SCHOLARSHIP.MAIN
    default:
      return null
  }
}
