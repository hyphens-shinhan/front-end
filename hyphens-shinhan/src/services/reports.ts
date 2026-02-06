import apiClient from './apiClient'
import type {
  ReportUpdate,
  ReportResponse,
  AttendanceResponse,
  ToggleVisibilityResponse,
} from '@/types/reports'

/** Report API 베이스 경로 (apiClient baseURL 뒤에 붙음) */
const BASE_COUNCIL = '/reports/council'
const BASE_REPORTS = '/reports'

/**
 * 활동 보고서 월 값.
 * API 경로 제약: 4월~12월만 유효 (4–12).
 */
export type ReportMonth = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/**
 * 엔드포인트 경로만 반환 (method/body 없음).
 * - Base: /api/v1/reports
 * - month: 4~12
 */
export const reportEndpoints = {
  /** GET 리포트 조회 (council 멤버만) */
  getReport: (councilId: string, year: number, month: number) =>
    `${BASE_COUNCIL}/${councilId}/${year}/${month}`,
  /** PATCH 리포트 초안 생성/수정 (리더만) */
  updateReport: (councilId: string, year: number, month: number) =>
    `${BASE_COUNCIL}/${councilId}/${year}/${month}`,
  /** PATCH 내 출석 확인 (제출된 리포트에만) */
  confirmAttendance: (reportId: string) =>
    `${BASE_COUNCIL}/${reportId}/confirm`,
  /** PATCH 내 출석 확인 취소 */
  rejectAttendance: (reportId: string) => `${BASE_COUNCIL}/${reportId}/reject`,
  /** POST 리포트 제출 (리더만) */
  submitReport: (reportId: string) => `${BASE_COUNCIL}/${reportId}/submit`,
  /** POST 공개/비공개 전환 (리더만) */
  toggleVisibility: (reportId: string) =>
    `${BASE_REPORTS}/${reportId}/toggle-visibility`,
}

/**
 * Reports(활동 보고서) API 서비스
 *
 * 엔드포인트:
 * GET    /reports/council/{council_id}/{year}/{month}     → ReportResponse (회원만)
 * PATCH  /reports/council/{council_id}/{year}/{month}     → ReportUpdate → ReportResponse (리더만)
 * PATCH  /reports/council/{report_id}/confirm             → AttendanceResponse
 * PATCH  /reports/council/{report_id}/reject               → AttendanceResponse
 * POST   /reports/council/{report_id}/submit              → ReportResponse (리더만)
 * POST   /reports/{report_id}/toggle-visibility           → ToggleVisibilityResponse (리더만)
 */
export const ReportsService = {
  /**
   * 해당 회의의 지정 연·월 활동 보고서를 조회합니다.
   */
  getReport: async (
    councilId: string,
    year: number,
    month: ReportMonth,
  ): Promise<ReportResponse> => {
    const { data } = await apiClient.get<ReportResponse>(
      reportEndpoints.getReport(councilId, year, month),
    )
    return data
  },

  /**
   * 해당 회의의 지정 연·월 활동 보고서 초안을 생성하거나 수정합니다. (리더만)
   */
  updateReport: async (
    councilId: string,
    year: number,
    month: ReportMonth,
    body: ReportUpdate,
  ): Promise<ReportResponse> => {
    const { data } = await apiClient.patch<ReportResponse>(
      reportEndpoints.updateReport(councilId, year, month),
      body,
    )
    return data
  },

  /**
   * 내 출석 확인 (제출된 리포트에만 가능)
   */
  confirmAttendance: async (reportId: string): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      reportEndpoints.confirmAttendance(reportId),
    )
    return data
  },

  /**
   * 내 출석 확인 취소
   */
  rejectAttendance: async (reportId: string): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      reportEndpoints.rejectAttendance(reportId),
    )
    return data
  },

  /**
   * 리포트 제출 (리더만)
   */
  submitReport: async (reportId: string): Promise<ReportResponse> => {
    const { data } = await apiClient.post<ReportResponse>(
      reportEndpoints.submitReport(reportId),
    )
    return data
  },

  /**
   * 리포트 공개/비공개 전환 (리더만). 공개 시 회원에게 REPORT_EXPORT 알림 전송.
   */
  toggleVisibility: async (
    reportId: string,
  ): Promise<ToggleVisibilityResponse> => {
    const { data } = await apiClient.post<ToggleVisibilityResponse>(
      reportEndpoints.toggleVisibility(reportId),
    )
    return data
  },
}
