import { useQuery } from '@tanstack/react-query'
import { ReportsService, type ReportMonth } from '@/services/reports'

/** Reports(활동 보고서) 쿼리 키 관리 객체 */
export const reportKeys = {
  all: ['reports'] as const,
  /** 특정 회의·연·월 보고서 조회 */
  report: (councilId: string, year: number, month: number) =>
    [...reportKeys.all, 'report', councilId, year, month] as const,
}

const isValidMonth = (month: number): month is ReportMonth =>
  Number.isInteger(month) && month >= 4 && month <= 12

/**
 * 해당 회의의 지정 연·월 활동 보고서를 조회합니다.
 * @param councilId - 회의 ID (UUID)
 * @param year - 연도
 * @param month - 월 (4–12)
 */
export const useReport = (
  councilId: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: reportKeys.report(councilId, year, month),
    queryFn: () =>
      ReportsService.getReport(councilId, year, month as ReportMonth),
    enabled:
      !!councilId && !!year && !!month && isValidMonth(month),
  })
}
