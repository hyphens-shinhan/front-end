/**
 * 필수 활동(연간 필수 활동) API 타입
 * - Base: /api/v1/reports/mandatory | 인증: Bearer | YB 전용(일부 ADMIN 전용)
 * - [ADMIN] POST/GET /admin/activities, GET/DELETE /admin/activities/{id}, GET /admin/submissions/{activity_id}
 * - [YB] GET /{year}, GET /activity/{activity_id}, POST /activity/{id}/goal|simple-report|url-redirect,
 *        PATCH /{submission_id}/goal|simple-report, POST /{submission_id}/submit|complete
 */

import type { AcademicGoalCategory } from './common'

// ========== Enums (서버와 동일한 값) ==========

/** 필수 활동 유형: 목표 설정 / 간단 보고 / URL 리다이렉트 */
export type MandatoryActivityType = 'GOAL' | 'SIMPLE_REPORT' | 'URL_REDIRECT'

/** @see AcademicGoalCategory in @/types/common (re-export for mandatory 사용처) */
export type { AcademicGoalCategory } from './common'

// ========== Admin: Activity ==========

/** [관리자] 필수 활동 생성 요청 */
export interface MandatoryActivityCreate {
  title: string
  year: number
  due_date: string // "YYYY-MM-DD"
  activity_type: MandatoryActivityType
  external_url?: string | null // URL_REDIRECT일 때 필수
}

/** 필수 활동 단건 응답 */
export interface MandatoryActivityResponse {
  id: string
  title: string
  year: number
  due_date: string
  activity_type: MandatoryActivityType
  external_url: string | null
  created_at: string // ISO datetime
}

// ========== GOAL 타입 ==========

/** 학업 목표 1건 생성/수정 (GOAL 활동 제출용) */
export interface MandatoryGoalCreate {
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  plan: string
  outcome: string
}

/** 학업 목표 1건 응답 */
export interface MandatoryGoalResponse {
  id: string
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  plan: string
  outcome: string
}

/** GOAL 활동 제출 생성 요청 (목표 최소 2개) */
export interface GoalSubmissionCreate {
  goals: MandatoryGoalCreate[] // 최소 2개
}

/** GOAL 활동 제출 수정 요청 (목표 최소 2개) */
export interface GoalSubmissionUpdate {
  goals: MandatoryGoalCreate[] // 최소 2개
}

// ========== SIMPLE_REPORT 타입 ==========

/** 간단 보고서 제출 생성 요청 */
export interface SimpleReportSubmissionCreate {
  report_title: string
  report_content: string
  activity_date: string // "YYYY-MM-DD"
  location: string
  image_urls?: string[] | null
}

/** 간단 보고서 제출 수정 요청 */
export interface SimpleReportSubmissionUpdate {
  report_title: string
  report_content: string
  activity_date: string
  location: string
  image_urls?: string[] | null
}

// ========== 통합 응답 ==========

/** 필수 활동 제출 단건 응답 (GOAL / SIMPLE_REPORT 공통, activity_type에 따라 필드 사용) */
export interface MandatorySubmissionResponse {
  id: string
  activity_id: string
  activity: MandatoryActivityResponse
  user_id: string
  is_submitted: boolean
  created_at: string
  submitted_at: string | null
  // GOAL 타입일 때
  goals: MandatoryGoalResponse[] | null
  report_title: string | null
  report_content: string | null
  activity_date: string | null
  location: string | null
  image_urls: string[] | null
}

/** 활동 + 해당 활동에 대한 사용자 제출 정보 (목록/조회용) */
export interface MandatorySubmissionLookupResponse {
  activity: MandatoryActivityResponse | null
  submission: MandatorySubmissionResponse | null
}

/** 특정 연도 필수 활동 목록 응답 */
export interface MandatoryActivitiesForYearResponse {
  year: number
  activities: MandatorySubmissionLookupResponse[]
}
