import apiClient from './apiClient'
import type {
  AcademicReportCreate,
  AcademicReportUpdate,
  AcademicReportResponse,
  AcademicReportListResponse,
  AcademicReportLookupResponse,
  AcademicMonitoringEnableResponse,
  AcademicMonitoringDisableResponse,
  AcademicMonitoringYearsResponse,
} from '@/types/academic'

const BASE = '/reports/academic'

/**
 * Academic(월별 학업 보고서) API 서비스
 *
 * 엔드포인트 ↔ 타입 매핑:
 * POST   /api/v1/reports/academic                              → AcademicReportCreate  → AcademicReportResponse
 * GET    /api/v1/reports/academic                              → AcademicReportListResponse
 * GET    /api/v1/reports/academic/{year}/{month}                → AcademicReportLookupResponse
 * PATCH  /api/v1/reports/academic/{report_id}                  → AcademicReportUpdate  → AcademicReportResponse
 * POST   /api/v1/reports/academic/{report_id}/submit           → AcademicReportResponse
 * POST   .../admin/users/{user_id}/monitoring/{year}           → AcademicMonitoringEnableResponse
 * DELETE .../admin/users/{user_id}/monitoring/{year}           → AcademicMonitoringDisableResponse
 * GET    .../admin/users/{user_id}/monitoring                  → AcademicMonitoringYearsResponse
 * GET    .../admin/users/{user_id}                             → AcademicReportListResponse
 */
export const AcademicService = {
  /** 월별 학업 보고서 생성 */
  createReport: async (
    body: AcademicReportCreate
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.post<AcademicReportResponse>(BASE, body)
    return data
  },

  /** 월별 학업 보고서 목록 (내 보고서) */
  getReports: async (): Promise<AcademicReportListResponse> => {
    const { data } = await apiClient.get<AcademicReportListResponse>(BASE)
    return data
  },

  /** 특정 연·월 보고서 조회 (있으면 report, 없으면 exists false) */
  getReportLookup: async (
    year: number,
    month: number
  ): Promise<AcademicReportLookupResponse> => {
    const { data } = await apiClient.get<AcademicReportLookupResponse>(
      `${BASE}/${year}/${month}`
    )
    return data
  },

  /** 월별 학업 보고서 수정 */
  updateReport: async (
    reportId: string,
    body: AcademicReportUpdate
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.patch<AcademicReportResponse>(
      `${BASE}/${reportId}`,
      body
    )
    return data
  },

  /** 월별 학업 보고서 제출 */
  submitReport: async (
    reportId: string
  ): Promise<AcademicReportResponse> => {
    const { data } = await apiClient.post<AcademicReportResponse>(
      `${BASE}/${reportId}/submit`
    )
    return data
  },

  // ---------- Admin: Monitoring / 사용자별 보고서 ----------

  /** [Admin] 특정 사용자·연도 학업 모니터링 활성화 */
  adminEnableMonitoring: async (
    userId: string,
    year: number
  ): Promise<AcademicMonitoringEnableResponse> => {
    const { data } = await apiClient.post<AcademicMonitoringEnableResponse>(
      `${BASE}/admin/users/${userId}/monitoring/${year}`
    )
    return data
  },

  /** [Admin] 특정 사용자·연도 학업 모니터링 비활성화 */
  adminDisableMonitoring: async (
    userId: string,
    year: number
  ): Promise<AcademicMonitoringDisableResponse> => {
    const { data } = await apiClient.delete<AcademicMonitoringDisableResponse>(
      `${BASE}/admin/users/${userId}/monitoring/${year}`
    )
    return data
  },

  /** [Admin] 특정 사용자의 모니터링 대상 연도 목록 */
  adminGetMonitoringYears: async (
    userId: string
  ): Promise<AcademicMonitoringYearsResponse> => {
    const { data } = await apiClient.get<AcademicMonitoringYearsResponse>(
      `${BASE}/admin/users/${userId}/monitoring`
    )
    return data
  },

  /** [Admin] 특정 사용자의 월별 학업 보고서 목록 */
  adminGetUserReports: async (
    userId: string
  ): Promise<AcademicReportListResponse> => {
    const { data } = await apiClient.get<AcademicReportListResponse>(
      `${BASE}/admin/users/${userId}`
    )
    return data
  },
}
