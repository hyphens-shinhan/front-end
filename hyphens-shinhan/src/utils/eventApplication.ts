import { EventStatus } from '@/types/posts'
import { formatDateYMD, formatTime } from './date'

/** 이벤트 신청 구간: 신청 전 / 모집 중 / 마감 */
export type EventApplicationPhase = 'before' | 'open' | 'closed'

export interface GetEventApplicationPhaseParams {
  application_start: string | null
  application_end: string | null
  event_status: EventStatus | null | undefined
  now?: Date
}

/**
 * 현재 시점 기준 이벤트 신청 구간을 반환합니다.
 * - before: 신청 시작 전
 * - open: 모집 기간 (신청 가능)
 * - closed: 마감 (신청 종료 또는 event_status === CLOSED)
 */
export function getEventApplicationPhase({
  application_start,
  application_end,
  event_status,
  now = new Date(),
}: GetEventApplicationPhaseParams): EventApplicationPhase {
  if (event_status != null && event_status === EventStatus.CLOSED) {
    return 'closed'
  }

  const applicationStartDate = application_start
    ? new Date(application_start)
    : null
  const applicationEndDate = application_end ? new Date(application_end) : null

  if (applicationStartDate !== null && now < applicationStartDate) {
    return 'before'
  }
  if (applicationEndDate !== null && now > applicationEndDate) {
    return 'closed'
  }
  return 'open'
}

export interface GetEventDetailBottomContentParams {
  phase: EventApplicationPhase
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
 * 이벤트 상세 하단(버튼 위 문구, 버튼 라벨, 비활성화 여부)을 구간·신청 상태에 따라 반환합니다.
 */
export function getEventDetailBottomContent({
  phase,
  application_start,
  application_end,
  deadlineDate,
  is_applied,
  isApplying,
}: GetEventDetailBottomContentParams): EventDetailBottomContent {
  const topContentText =
    phase === 'before' && application_start
      ? `모집 시작일 : ${formatDateYMD(application_start)} ${formatTime(application_start)}`
      : phase === 'closed'
        ? '이미 마감된 이벤트입니다.'
        : `신청 마감일 : ${formatDateYMD(deadlineDate)} ${formatTime(deadlineDate)}`

  const buttonLabel =
    phase === 'closed' ? '마감됨' : is_applied ? '신청 취소하기' : '신청하기'

  const isButtonDisabled =
    phase === 'before' || phase === 'closed' || isApplying

  return { topContentText, buttonLabel, isButtonDisabled }
}
