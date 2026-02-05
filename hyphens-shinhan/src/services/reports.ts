import apiClient from './apiClient'
import type {
  ReportUpdate,
  ReportResponse,
  AttendanceResponse,
} from '@/types/reports'

/** Report API 베이스 경로 (apiClient baseURL 뒤에 붙음) */
const BASE = '/reports/council'

/**
 * 활동 보고서 월 값.
 * API 경로 제약: 4월~12월만 유효 (4–12).
 */
export type ReportMonth = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/**
 * Reports(활동 보고서) API 서비스
 *
 * 엔드포인트:
 * GET    /api/v1/reports/council/{council_id}/{year}/{month}  → ReportResponse (회원만)
 * PATCH  /api/v1/reports/council/{council_id}/{year}/{month}  → ReportUpdate → ReportResponse (리더만, 초안 생성/수정)
 * PATCH  /api/v1/reports/council/{report_id}/confirm          → 내 출석 확인
 * PATCH  /api/v1/reports/council/{report_id}/reject          → 내 출석 확인 취소
 * POST   /api/v1/reports/council/{report_id}/submit          → 리포트 제출 (리더만)
 *
 * 경로 제약: month는 4–12 (4월~12월).
 */
export const ReportsService = {
  /**
   * 해당 회의의 지정 연·월 활동 보고서를 조회합니다.
   */
  getReport: async (
    councilId: string,
    year: number,
    month: ReportMonth
  ): Promise<ReportResponse> => {
    const { data } = await apiClient.get<ReportResponse>(
      `${BASE}/${councilId}/${year}/${month}`
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
    body: ReportUpdate
  ): Promise<ReportResponse> => {
    const { data } = await apiClient.patch<ReportResponse>(
      `${BASE}/${councilId}/${year}/${month}`,
      body
    )
    return data
  },

  /**
   * 내 출석 확인 (제출된 리포트에만 가능)
   */
  confirmAttendance: async (
    reportId: string
  ): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      `${BASE}/${reportId}/confirm`
    )
    return data
  },

  /**
   * 내 출석 확인 취소
   */
  rejectAttendance: async (
    reportId: string
  ): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      `${BASE}/${reportId}/reject`
    )
    return data
  },

  /**
   * 리포트 제출 (리더만)
   */
  submitReport: async (reportId: string): Promise<ReportResponse> => {
    const { data } = await apiClient.post<ReportResponse>(
      `${BASE}/${reportId}/submit`
    )
    return data
  },
}
