import apiClient from './apiClient'
import type {
  AcademicReportCreate,
  AcademicReportUpdate,
  AcademicReportResponse,
  AcademicReportListResponse,
  AcademicReportLookupResponse,
  MonitoringEnableResponse,
  MonitoringDisableResponse,
  UserMonitoringYearsResponse,
} from '@/types/academic'

const BASE = '/reports/academic' as const

/**
 * 유지 심사(학업 보고) API 엔드포인트 경로 빌더
 * - baseURL 기준 상대 경로 (예: /api/v1 은 baseURL에 포함)
 */
export const academicEndpoints = {
  /** POST - 학업 보고서 생성 */
  createReport: () => BASE,

  /** GET - 내 학업 보고서 목록 (year?, limit?, offset?) */
  listMyReports: (params?: {
    year?: number
    limit?: number
    offset?: number
  }) => {
    const search = new URLSearchParams()
    if (params?.year != null) search.set('year', String(params.year))
    if (params?.limit != null) search.set('limit', String(params.limit))
    if (params?.offset != null) search.set('offset', String(params.offset))
    const q = search.toString()
    return q ? `${BASE}?${q}` : BASE
  },

  /** GET - 특정 연/월 보고서 조회 */
  getReportByYearMonth: (year: number, month: number) =>
    `${BASE}/${year}/${month}`,

  /** PATCH - 학업 보고서 수정 (제출 전만) */
  updateReport: (reportId: string) => `${BASE}/${reportId}`,

  /** POST - 학업 보고서 제출 (확정, 취소 불가) */
  submitReport: (reportId: string) => `${BASE}/${reportId}/submit`,

  // --- Admin ---
  /** POST - 특정 유저 특정 연도 유지 심사(학업 모니터링) 활성화 */
  enableMonitoring: (userId: string, year: number) =>
    `${BASE}/admin/users/${userId}/monitoring/${year}`,

  /** DELETE - 유지 심사(학업 모니터링) 비활성화 */
  disableMonitoring: (userId: string, year: number) =>
    `${BASE}/admin/users/${userId}/monitoring/${year}`,

  /** GET - 특정 유저의 모니터링 대상 연도 목록 */
  getUserMonitoringYears: (userId: string) =>
    `${BASE}/admin/users/${userId}/monitoring`,

  /** GET - 특정 유저의 학업 보고서 목록 (Admin) */
  listUserReports: (
    userId: string,
    params?: { limit?: number; offset?: number }
  ) => {
    const search = new URLSearchParams()
    if (params?.limit != null) search.set('limit', String(params.limit))
    if (params?.offset != null) search.set('offset', String(params.offset))
    const q = search.toString()
    return q
      ? `${BASE}/admin/users/${userId}?${q}`
      : `${BASE}/admin/users/${userId}`
  },
}

/**
 * Academic(월별 학업 보고서 / 유지 심사) API 서비스
 *
 * 엔드포인트 ↔ 타입 매핑:
 * POST   /reports/academic                              → AcademicReportCreate  → AcademicReportResponse
 * GET    /reports/academic                              → AcademicReportListResponse
 * GET    /reports/academic/{year}/{month}                → AcademicReportLookupResponse
 * PATCH  /reports/academic/{report_id}                  → AcademicReportUpdate → AcademicReportResponse
 * POST   /reports/academic/{report_id}/submit            → AcademicReportResponse
 * POST   .../admin/users/{user_id}/monitoring/{year}     → MonitoringEnableResponse
 * DELETE .../admin/users/{user_id}/monitoring/{year}     → MonitoringDisableResponse
 * GET    .../admin/users/{user_id}/monitoring            → UserMonitoringYearsResponse
 * GET    .../admin/users/{user_id}                       → AcademicReportListResponse
 */
export const AcademicService = {
  /** 월별 학업 보고서 생성 */
  createReport: async (
    body: AcademicReportCreate
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.post<AcademicReportResponse>(
      academicEndpoints.createReport(),
      body
    )
    return data
  },

  /** 월별 학업 보고서 목록 (내 보고서). year, limit, offset 선택 */
  getReports: async (params?: {
    year?: number
    limit?: number
    offset?: number
  }): Promise<AcademicReportListResponse> => {
    const { data } = await apiClient.get<AcademicReportListResponse>(
      academicEndpoints.listMyReports(params)
    )
    return data
  },

  /** 특정 연·월 보고서 조회 (있으면 report, 없으면 exists false) */
  getReportLookup: async (
    year: number,
    month: number
  ): Promise<AcademicReportLookupResponse> => {
    const { data } = await apiClient.get<AcademicReportLookupResponse>(
      academicEndpoints.getReportByYearMonth(year, month)
    )
    return data
  },

  /** 월별 학업 보고서 수정 */
  updateReport: async (
    reportId: string,
    body: AcademicReportUpdate
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.patch<AcademicReportResponse>(
      academicEndpoints.updateReport(reportId),
      body
    )
    return data
  },

  /** 월별 학업 보고서 제출 */
  submitReport: async (
    reportId: string
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.post<AcademicReportResponse>(
      academicEndpoints.submitReport(reportId)
    )
    return data
  },

  // ---------- Admin: Monitoring / 사용자별 보고서 ----------

  /** [Admin] 특정 사용자·연도 학업 모니터링 활성화 */
  adminEnableMonitoring: async (
    userId: string,
    year: number
  ): Promise<MonitoringEnableResponse> => {
    const { data } = await apiClient.post<MonitoringEnableResponse>(
      academicEndpoints.enableMonitoring(userId, year)
    )
    return data
  },

  /** [Admin] 특정 사용자·연도 학업 모니터링 비활성화 */
  adminDisableMonitoring: async (
    userId: string,
    year: number
  ): Promise<MonitoringDisableResponse> => {
    const { data } = await apiClient.delete<MonitoringDisableResponse>(
      academicEndpoints.disableMonitoring(userId, year)
    )
    return data
  },

  /** [Admin] 특정 사용자의 모니터링 대상 연도 목록 */
  adminGetMonitoringYears: async (
    userId: string
  ): Promise<UserMonitoringYearsResponse> => {
    const { data } = await apiClient.get<UserMonitoringYearsResponse>(
      academicEndpoints.getUserMonitoringYears(userId)
    )
    return data
  },

  /** [Admin] 특정 사용자의 월별 학업 보고서 목록. limit, offset 선택 */
  adminGetUserReports: async (
    userId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<AcademicReportListResponse> => {
    const { data } = await apiClient.get<AcademicReportListResponse>(
      academicEndpoints.listUserReports(userId, params)
    )
    return data
  },
}
