import { useQuery } from '@tanstack/react-query'
import { ReportsService, type ReportMonth } from '@/services/reports'
import { isValidReportMonth } from '@/utils/reports'

/** Reports(활동 보고서) 쿼리 키 관리 객체 */
export const reportKeys = {
  all: ['reports'] as const,
  /** 특정 회의·연·월 보고서 조회 */
  report: (councilId: string, year: number, month: number) =>
    [...reportKeys.all, 'report', councilId, year, month] as const,
}

/** 보고서 캐시 유효 시간: 5분 (재진입 시 불필요한 refetch 감소) */
const REPORT_STALE_TIME_MS = 5 * 60 * 1000
/** 캐시 유지 시간: 10분 */
const REPORT_GC_TIME_MS = 10 * 60 * 1000

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
      !!councilId && !!year && !!month && isValidReportMonth(month),
    staleTime: REPORT_STALE_TIME_MS,
    gcTime: REPORT_GC_TIME_MS,
  })
}
