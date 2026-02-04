import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AcademicService } from '@/services/academic'
import { academicKeys } from './useAcademic'
import type {
  AcademicReportCreate,
  AcademicReportUpdate,
} from '@/types/academic'

// ---------- 보고서 생성/수정/제출 ----------

/**
 * 월별 학업 보고서 생성
 */
export const useCreateAcademicReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AcademicReportCreate) =>
      AcademicService.createReport(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.reports() })
      queryClient.invalidateQueries({ queryKey: academicKeys.all })
    },
  })
}

/**
 * 월별 학업 보고서 수정
 */
export const useUpdateAcademicReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      reportId,
      body,
    }: {
      reportId: string
      body: AcademicReportUpdate
    }) => AcademicService.updateReport(reportId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: academicKeys.reportLookup(data.year, data.month),
      })
      queryClient.invalidateQueries({ queryKey: academicKeys.reports() })
      queryClient.invalidateQueries({ queryKey: academicKeys.all })
    },
  })
}

/**
 * 월별 학업 보고서 제출
 */
export const useSubmitAcademicReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => AcademicService.submitReport(reportId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: academicKeys.reportLookup(data.year, data.month),
      })
      queryClient.invalidateQueries({ queryKey: academicKeys.reports() })
      queryClient.invalidateQueries({ queryKey: academicKeys.all })
    },
  })
}

// ---------- Admin: Monitoring ----------

/**
 * [Admin] 특정 사용자·연도 학업 모니터링 활성화
 */
export const useAdminEnableAcademicMonitoring = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, year }: { userId: string; year: number }) =>
      AcademicService.adminEnableMonitoring(userId, year),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: academicKeys.adminMonitoringYears(userId),
      })
      queryClient.invalidateQueries({
        queryKey: academicKeys.adminUserReports(userId),
      })
      queryClient.invalidateQueries({ queryKey: academicKeys.all })
    },
  })
}

/**
 * [Admin] 특정 사용자·연도 학업 모니터링 비활성화
 */
export const useAdminDisableAcademicMonitoring = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, year }: { userId: string; year: number }) =>
      AcademicService.adminDisableMonitoring(userId, year),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: academicKeys.adminMonitoringYears(userId),
      })
      queryClient.invalidateQueries({
        queryKey: academicKeys.adminUserReports(userId),
      })
      queryClient.invalidateQueries({ queryKey: academicKeys.all })
    },
  })
}
