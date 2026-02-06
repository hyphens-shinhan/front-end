/**
 * Academic(월별 학업) API 타입
 * - 서버 API 요청/응답과 동일한 구조로 유지
 */

import type { AcademicGoalCategory } from './common'

/** @see common.AcademicGoalCategory (re-export for academic 사용처) */
export type { AcademicGoalCategory } from './common'

// ========== Goal (월별 학업 목표) ==========

/** 학업 목표 1건 생성/수정 (월별 보고서 내 목표 항목) */
export interface GoalCreate {
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  /** 달성률 0–100, 선택 */
  achievement_pct?: number | null
}

/** 학업 목표 1건 응답 */
export interface GoalResponse {
  id: string
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  achievement_pct: number | null
}

// ========== Report 생성/수정 ==========

/** 월별 학업 보고서 생성 요청 (목표 최소 2개) */
export interface AcademicReportCreate {
  year: number
  month: number // 1–12
  goals: GoalCreate[] // 최소 2개
  /** 증빙 자료 URL 목록 */
  evidence_urls?: string[] | null
}

/** 월별 학업 보고서 수정 요청 (목표 최소 2개) */
export interface AcademicReportUpdate {
  goals: GoalCreate[] // 최소 2개
  evidence_urls?: string[] | null
}

// ========== Report 응답 ==========

/** 월별 학업 보고서 단건 응답 */
export interface AcademicReportResponse {
  id: string
  user_id: string
  year: number
  month: number
  is_submitted: boolean
  created_at: string // ISO datetime
  submitted_at: string | null
  evidence_urls: string[] | null
  goals: GoalResponse[]
}

/** 월별 학업 보고서 목록 응답 (페이지네이션 등) */
export interface AcademicReportListResponse {
  reports: AcademicReportResponse[]
  total: number
}

/** 특정 연·월 보고서 조회 시 사용 (있으면 report, 없으면 exists false) */
export interface AcademicReportLookupResponse {
  exists: boolean
  report: AcademicReportResponse | null
}

// ========== Admin: Monitoring ==========

/** [Admin] 특정 사용자·연도 학업 모니터링 활성화 시 응답 */
export interface AcademicMonitoringEnableResponse {
  user_id: string
  year: number
  enabled: true
}

/** [Admin] 특정 사용자·연도 학업 모니터링 비활성화 시 응답 */
export interface AcademicMonitoringDisableResponse {
  user_id: string
  year: number
  enabled: false
}

/** [Admin] 특정 사용자의 모니터링 대상 연도 목록 */
export interface AcademicMonitoringYearsResponse {
  user_id: string
  years: number[]
}
