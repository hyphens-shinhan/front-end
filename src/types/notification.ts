import type { IconName } from '@/components/common/Icon'

/** 단일 알림 아이템 */
export interface NotificationItem {
  id: string
  /** 알림 제목 (예: 신한장학재단 공지사항, 새로운 메시지) */
  title: string
  /** 알림 본문 요약 */
  body: string
  /** 표시용 날짜 (YYYY.MM.DD) */
  date: string
  /** 표시용 시간 (HH:mm) */
  time: string
  /** 읽음 여부 - 미읽음이면 강조 배경 표시 */
  unread: boolean
  /** 리스트에서 사용할 아이콘 */
  icon: IconName
}
