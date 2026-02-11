import type { ReportMonth } from '@/services/reports'
import type { AttendanceResponse } from '@/types/reports'

/** 캘린더/폼 표시용 placeholder */
export const ACTIVITY_DATE_PLACEHOLDER = 'YYYY.MM.DD'

/**
 * API 날짜(YYYY-MM-DD) → 캘린더/폼 표시용(YYYY.MM.DD).
 * GET 응답으로 폼에 채울 때 사용.
 */
export function activityDateToDisplay(apiDate: string | null | undefined): string {
  if (!apiDate || apiDate === ACTIVITY_DATE_PLACEHOLDER) return ACTIVITY_DATE_PLACEHOLDER
  const normalized = apiDate.trim().replace(/-/g, '.')
  return normalized.includes('.') ? normalized : ACTIVITY_DATE_PLACEHOLDER
}

/**
 * 캘린더/폼 값(YYYY.MM.DD) → API용(YYYY-MM-DD).
 * PATCH/POST body의 activity_date에 사용. 빈 값·placeholder면 null.
 */
export function activityDateToApi(displayDate: string | null | undefined): string | null {
  if (!displayDate || displayDate === ACTIVITY_DATE_PLACEHOLDER) return null
  const normalized = displayDate.trim().replace(/\./g, '-')
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null
}

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
