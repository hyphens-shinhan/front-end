import type { ApplicationStatus } from '@/types/posts'
import { formatDateYMD, formatTime } from './date'

export interface GetEventDetailBottomContentParams {
  /** API에서 반환하는 신청 기간 기준 상태 */
  application_status: ApplicationStatus
  application_start: string | null
  application_end: string | null
  deadlineDate: string
  is_applied: boolean
  isApplying: boolean
}

export interface EventDetailBottomContent {
  topContentText: string
  buttonLabel: string
  isButtonDisabled: boolean
}

/**
 * 이벤트 상세 하단(버튼 위 문구, 버튼 라벨, 비활성화 여부)을 API의 application_status 기준으로 반환합니다.
 * - UPCOMING: 신청 시작 전
 * - OPEN: 모집 기간 (신청 가능)
 * - CLOSED: 마감
 */
export function getEventDetailBottomContent({
  application_status,
  application_start,
  application_end,
  deadlineDate,
  is_applied,
  isApplying,
}: GetEventDetailBottomContentParams): EventDetailBottomContent {
  const topContentText =
    application_status === 'UPCOMING' && application_start
      ? `모집 시작일 : ${formatDateYMD(application_start)} ${formatTime(application_start)}`
      : application_status === 'CLOSED'
        ? '이미 마감된 이벤트입니다.'
        : `신청 마감일 : ${formatDateYMD(deadlineDate)} ${formatTime(deadlineDate)}`

  const buttonLabel =
    application_status === 'CLOSED'
      ? '마감됨'
      : is_applied
        ? '신청 취소하기'
        : '신청하기'

  const isButtonDisabled =
    application_status === 'UPCOMING' ||
    application_status === 'CLOSED' ||
    isApplying

  return { topContentText, buttonLabel, isButtonDisabled }
}
