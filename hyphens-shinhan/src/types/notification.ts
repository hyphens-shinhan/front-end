import type { IconName } from '@/components/common/Icon'

// ========== Notification API 타입 (Base: /api/v1/notifications | 인증: Bearer) ==========

/** 알림 유형 */
export type NotificationType =
  | 'LIKE'
  | 'COMMENT'
  | 'COMMENT_REPLY'
  | 'CHAT_MESSAGE'
  | 'FOLLOW_REQUEST'
  | 'FOLLOW_ACCEPT'
  | 'REPORT_EXPORT'
  | 'MENTORING_REQUEST'
  | 'MENTORING_ACCEPTED'

/** 알림을 일으킨 유저 */
export interface NotificationActor {
  id: string
  name: string
  avatar_url: string | null
}

/** 단건 응답 */
export interface NotificationResponse {
  id: string
  type: NotificationType
  recipient_id: string
  actor: NotificationActor | null
  post_id: string | null
  comment_id: string | null
  room_id: string | null
  club_id: string | null
  is_read: boolean
  created_at: string
}

/** 목록 응답 (created_at 내림차순, unread_only 옵션 지원) */
export interface NotificationListResponse {
  notifications: NotificationResponse[]
  total: number
  unread_count: number
}

/** 전체 읽음 처리 응답 */
export interface MarkAllReadResponse {
  message: string
}

/** 단건 읽음/삭제 응답 */
export interface NotificationMessageResponse {
  message: string
}

// ========== 웹 푸시 (Web Push) API 타입 ==========
// Base: /api/v1/notifications | 인증: Bearer

/** 구독 등록/해제 시 body (브라우저 PushSubscription 기준) */
export interface PushSubscriptionCreate {
  endpoint: string
  p256dh: string
  auth: string
}

/** VAPID 공개키 응답 */
export interface VapidKeyResponse {
  vapid_public_key: string
}

/** 푸시 구독 등록/해제 메시지 응답 */
export interface PushSubscriptionMessageResponse {
  message: string
}

// ========== UI용 타입 (기존 리스트 표시) ==========

/** 단일 알림 아이템 (리스트 UI용, 상세 이동용 id 포함) */
export interface NotificationItem {
  id: string
  /** 알림 유형 (상세 이동 분기용) */
  type: NotificationType
  /** 알림 제목 */
  title: string
  /** 알림 본문 요약 */
  body: string
  /** 표시용 날짜 (YYYY.MM.DD) */
  date: string
  /** 표시용 시간 (HH:mm) */
  time: string
  /** 읽음 여부 */
  unread: boolean
  /** 리스트에서 사용할 아이콘 */
  icon: IconName
  /** 상세 이동용: 게시글 id (LIKE, COMMENT, COMMENT_REPLY) */
  post_id?: string | null
  /** 상세 이동용: 채팅방/상대 id (CHAT_MESSAGE) */
  room_id?: string | null
  /** 상세 이동용: 알림을 일으킨 유저 id (팔로우/멘토링 등) */
  actor_id?: string | null
  /** 상세 이동용: 소모임 id (club 관련 알림) */
  club_id?: string | null
}
