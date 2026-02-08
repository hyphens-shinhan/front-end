/**
 * 유지 심사(학업 보고) API 타입
 * Base: /api/v1/reports/academic
 * 서버: app/schemas/academic.py
 */

// --- 목표 카테고리 (MAJOR_REVIEW = 유지 심사 관련) ---
export const AcademicGoalCategory = {
  MAJOR_REVIEW: 'MAJOR_REVIEW',
  ENGLISH_STUDY: 'ENGLISH_STUDY',
  CERTIFICATION_PREP: 'CERTIFICATION_PREP',
  STUDY_GROUP: 'STUDY_GROUP',
  ASSIGNMENT_EXAM_PREP: 'ASSIGNMENT_EXAM_PREP',
  OTHER: 'OTHER',
} as const
export type AcademicGoalCategory =
  (typeof AcademicGoalCategory)[keyof typeof AcademicGoalCategory]

// --- 요청 ---
export interface GoalCreate {
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  achievement_pct?: number | null // 0~100
}

/** POST /reports/academic - 학업 보고서 생성 */
export interface AcademicReportCreate {
  year: number
  month: number // 1~12
  goals: GoalCreate[] // 최소 2개
  evidence_urls?: string[] | null
}

/** PATCH /reports/academic/{report_id} - 학업 보고서 수정 (제출 전만) */
export interface AcademicReportUpdate {
  goals: GoalCreate[] // 최소 2개
  evidence_urls?: string[] | null
}

// --- 응답 ---
export interface GoalResponse {
  id: string
  category: AcademicGoalCategory
  custom_category?: string | null
  content: string
  achievement_pct?: number | null
}

export interface AcademicReportResponse {
  id: string
  user_id: string
  year: number
  month: number
  is_submitted: boolean
  created_at: string // ISO datetime
  submitted_at: string | null // ISO datetime
  evidence_urls: string[] | null
  goals: GoalResponse[]
}

/** GET /reports/academic - 내 보고서 목록 */
export interface AcademicReportListResponse {
  reports: AcademicReportResponse[]
  total: number
}

/** GET /reports/academic/{year}/{month} - 연/월 조회 */
export interface AcademicReportLookupResponse {
  exists: boolean
  report: AcademicReportResponse | null
}

// --- Admin: 유지 심사 대상 설정 ---
export interface MonitoringEnableResponse {
  user_id: string
  year: number
  enabled: boolean
}

export interface MonitoringDisableResponse {
  user_id: string
  year: number
  enabled: boolean
}

export interface UserMonitoringYearsResponse {
  user_id: string
  years: number[]
}

// --- API 타입 매핑 (선택) ---
export type AcademicApi = {
  createReport: {
    method: 'POST'
    path: () => string
    response: AcademicReportResponse
    body: AcademicReportCreate
  }
  listMyReports: {
    method: 'GET'
    path: (params?: {
      year?: number
      limit?: number
      offset?: number
    }) => string
    response: AcademicReportListResponse
    query?: { year?: number; limit?: number; offset?: number }
  }
  getReportByYearMonth: {
    method: 'GET'
    path: (year: number, month: number) => string
    response: AcademicReportLookupResponse
    params: { year: number; month: number }
  }
  updateReport: {
    method: 'PATCH'
    path: (reportId: string) => string
    response: AcademicReportResponse
    body: AcademicReportUpdate
    params: { reportId: string }
  }
  submitReport: {
    method: 'POST'
    path: (reportId: string) => string
    response: AcademicReportResponse
    params: { reportId: string }
  }
  enableMonitoring: {
    method: 'POST'
    path: (userId: string, year: number) => string
    response: MonitoringEnableResponse
    params: { userId: string; year: number }
  }
  disableMonitoring: {
    method: 'DELETE'
    path: (userId: string, year: number) => string
    response: MonitoringDisableResponse
    params: { userId: string; year: number }
  }
  getUserMonitoringYears: {
    method: 'GET'
    path: (userId: string) => string
    response: UserMonitoringYearsResponse
    params: { userId: string }
  }
  listUserReports: {
    method: 'GET'
    path: (
      userId: string,
      params?: { limit?: number; offset?: number }
    ) => string
    response: AcademicReportListResponse
    params: { userId: string }
    query?: { limit?: number; offset?: number }
  }
}
