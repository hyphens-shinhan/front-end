import apiClient from './apiClient'
import type {
  ReportCreate,
  ReportResponse,
  AttendanceResponse,
} from '@/types/reports'

/** 회의(council) 활동 보고서 API 베이스 경로 */
const BASE = '/api/v1/reports/council'

/**
 * 활동 보고서 월 값.
 * API 경로 제약: 4월~12월만 유효 (4–12).
 */
export type ReportMonth = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/**
 * Reports(활동 보고서) API 서비스
 *
 * 엔드포인트 ↔ 타입 매핑:
 * POST   /api/v1/reports/council/{council_id}/{year}/{month}     → ReportCreate  → ReportResponse
 * GET    /api/v1/reports/council/{council_id}/{year}/{month}     → ReportResponse
 * PATCH  /api/v1/reports/council/{report_id}/attendance/confirm  → AttendanceResponse
 * PATCH  /api/v1/reports/council/{report_id}/attendance/reject   → AttendanceResponse
 *
 * 경로 제약: month는 4–12 (4월~12월).
 */
export const ReportsService = {
  /**
   * 해당 회의의 지정 연·월 활동 보고서를 생성합니다.
   * @param councilId - 회의 ID (UUID)
   * @param year - 연도
   * @param month - 월 (4–12)
   * @param body - 보고서 생성 요청 (제목, 일자, 장소, 내용, 영수증, 출석 등)
   * @returns 생성된 보고서
   */
  createReport: async (
    councilId: string,
    year: number,
    month: ReportMonth,
    body: ReportCreate
  ): Promise<ReportResponse> => {
    const { data } = await apiClient.post<ReportResponse>(
      `${BASE}/${councilId}/${year}/${month}`,
      body
    )
    return data
  },

  /**
   * 해당 회의의 지정 연·월 활동 보고서를 조회합니다.
   * @param councilId - 회의 ID (UUID)
   * @param year - 연도
   * @param month - 월 (4–12)
   * @returns 해당 연·월 보고서
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
   * 보고서 출석을 확인(승인)합니다.
   * @param reportId - 보고서 ID (UUID)
   * @returns 처리된 출석 정보
   */
  confirmAttendance: async (
    reportId: string
  ): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      `${BASE}/${reportId}/attendance/confirm`
    )
    return data
  },

  /**
   * 보고서 출석을 거부합니다.
   * @param reportId - 보고서 ID (UUID)
   * @returns 처리된 출석 정보
   */
  rejectAttendance: async (
    reportId: string
  ): Promise<AttendanceResponse> => {
    const { data } = await apiClient.patch<AttendanceResponse>(
      `${BASE}/${reportId}/attendance/reject`
    )
    return data
  },
}
