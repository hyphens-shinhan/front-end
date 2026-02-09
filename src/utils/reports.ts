import type { ReportMonth } from '@/services/reports'
import type { AttendanceResponse } from '@/types/reports'

/** 활동 보고서 월: 4–12만 유효 */
const REPORT_MONTH_MIN = 4
const REPORT_MONTH_MAX = 12

/**
 * 숫자 월을 ReportMonth로 보정 (4–12 범위 클램프)
 */
export function toReportMonth(month: number): ReportMonth {
  const m = Math.min(REPORT_MONTH_MAX, Math.max(REPORT_MONTH_MIN, month))
  return m as ReportMonth
}

/**
 * 활동 보고서 유효 월 여부 (4–12)
 */
export function isValidReportMonth(month: number): month is ReportMonth {
  return (
    Number.isInteger(month) && month >= REPORT_MONTH_MIN && month <= REPORT_MONTH_MAX
  )
}

export type AttendanceDisplayStatus = '출석' | '대기 중' | '불참'

/**
 * API 출석 응답을 UI 표시용 상태로 변환
 */
export function attendanceToDisplayStatus(
  a: AttendanceResponse
): AttendanceDisplayStatus {
  if (a.confirmation === 'CONFIRMED')
    return a.status === 'PRESENT' ? '출석' : '불참'
  return '대기 중'
}
