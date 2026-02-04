// MARK: - 활동(Activities) API 타입 정의

import type { EventStatus } from './posts'

// ========== Activity 관련 타입 ==========

/**
 * 이사회 보고서 제출 상태
 */
export interface CouncilReportStatus {
  /** 보고서 제목 (없을 수 있음) */
  title?: string | null
  /** 제출 완료 여부 */
  is_completed: boolean
}

/**
 * 학술 보고서 제출 상태
 */
export interface AcademicReportStatus {
  /** 제출 완료 여부 */
  is_completed: boolean
}

/**
 * 필수 활동 유형
 * @example "GOAL" | "SIMPLE_REPORT" | "URL_REDIRECT"
 */
export type MandatoryActivityType = string

/**
 * 필수 활동(과제) 단일 항목 상태
 */
export interface MandatoryActivityStatus {
  /** 활동 ID (UUID) */
  id: string
  /** 활동 제목 */
  title: string
  /** 활동 유형 */
  activity_type: MandatoryActivityType
  /** 제출 여부 */
  is_submitted: boolean
  /** 제출 마감일 (ISO "YYYY-MM-DD") */
  due_date: string
}

/**
 * 필수 활동(과제) 보고 전체 상태
 */
export interface MandatoryReportStatus {
  /** 필수 활동 목록 */
  activities: MandatoryActivityStatus[]
}

/**
 * 신청한 이벤트 단일 항목 상태 (post EventStatus 사용)
 */
export interface AppliedEventStatus {
  /** 이벤트 ID (UUID) */
  id: string
  /** 이벤트 제목 */
  title: string
  /** 이벤트 일시 (ISO datetime) */
  event_date: string
  /** 이벤트 진행 상태 (SCHEDULED | OPEN | CLOSED) */
  status: EventStatus
}

/**
 * 신청한 이벤트 목록 상태
 */
export interface AppliedEventsStatus {
  /** 신청 이벤트 목록 */
  events: AppliedEventStatus[]
}

/**
 * 월별 활동 상태 (이사회·학술 보고 등)
 */
export interface MonthlyActivityStatus {
  /** 월 (1–12) */
  month: number
  /** 이사회 보고서 상태 */
  council_report: CouncilReportStatus
  /** 학술 보고서 상태 */
  academic_report: AcademicReportStatus
}

/**
 * 연도별 활동 요약
 */
export interface YearlyActivitySummary {
  /** 연도 */
  year: number
  /** 이사회 ID (UUID, 없을 수 있음) */
  council_id?: string | null
  /** 월별 활동 상태 목록 */
  months: MonthlyActivityStatus[]
  /** 해당 연도 이사회 보고 전체 완료 여부 */
  council_all_completed: boolean
  /** 해당 연도 학술 보고 전체 완료 여부 */
  academic_all_completed: boolean
  /** 학술 활동 모니터링 대상 여부 */
  academic_is_monitored: boolean
  /** 필수 활동(과제) 보고 상태 */
  mandatory_report: MandatoryReportStatus
  /** 신청한 이벤트 목록 상태 */
  applied_events: AppliedEventsStatus
}

/**
 * 활동 요약 API 응답 (연도 범위 + 연도별 요약 목록)
 */
export interface ActivitiesSummaryResponse {
  /** 조회 가능 최소 연도 */
  min_year: number
  /** 조회 가능 최대 연도 */
  max_year: number
  /** 연도별 활동 요약 목록 */
  years: YearlyActivitySummary[]
}
