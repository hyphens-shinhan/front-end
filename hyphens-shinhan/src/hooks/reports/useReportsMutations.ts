import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReportsService, type ReportMonth } from '@/services/reports'
import { reportKeys } from './useReports'
import type { ReportUpdate } from '@/types/reports'

// ---------- 보고서 초안 생성/수정 ----------

/**
 * 해당 회의·연·월 활동 보고서 초안 생성 또는 수정 (리더만, PATCH)
 */
export const useUpdateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      councilId,
      year,
      month,
      body,
    }: {
      councilId: string
      year: number
      month: ReportMonth
      body: ReportUpdate
    }) => ReportsService.updateReport(councilId, year, month, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.report(data.council_id, data.year, data.month),
      })
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

// ---------- 보고서 제출 ----------

/**
 * 리포트 제출 (리더만, POST)
 */
export const useSubmitReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => ReportsService.submitReport(reportId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.report(data.council_id, data.year, data.month),
      })
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

// ---------- 출석 승인/거부 ----------

/**
 * 보고서 출석 확인(승인)
 */
export const useConfirmAttendance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) =>
      ReportsService.confirmAttendance(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

/**
 * 보고서 출석 거부
 */
export const useRejectAttendance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => ReportsService.rejectAttendance(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}
