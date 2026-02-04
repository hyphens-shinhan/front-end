import { useQuery } from '@tanstack/react-query'
import { AcademicService } from '@/services/academic'

/**
 * Academic(월별 학업 보고서) 쿼리 키 관리 객체
 */
export const academicKeys = {
  all: ['academic'] as const,
  /** 내 보고서 목록 */
  reports: () => [...academicKeys.all, 'reports'] as const,
  /** 특정 연·월 보고서 조회 */
  reportLookup: (year: number, month: number) =>
    [...academicKeys.all, 'report', year, month] as const,
  /** [Admin] 특정 사용자 모니터링 연도 목록 */
  adminMonitoringYears: (userId: string) =>
    [...academicKeys.all, 'admin', 'monitoring', userId] as const,
  /** [Admin] 특정 사용자 보고서 목록 */
  adminUserReports: (userId: string) =>
    [...academicKeys.all, 'admin', 'userReports', userId] as const,
}

/**
 * 월별 학업 보고서 목록 (내 보고서)
 */
export const useAcademicReports = () => {
  return useQuery({
    queryKey: academicKeys.reports(),
    queryFn: () => AcademicService.getReports(),
  })
}

/**
 * 특정 연·월 보고서 조회 (있으면 report, 없으면 exists false)
 */
export const useAcademicReportLookup = (year: number, month: number) => {
  return useQuery({
    queryKey: academicKeys.reportLookup(year, month),
    queryFn: () => AcademicService.getReportLookup(year, month),
    enabled: !!year && !!month && month >= 1 && month <= 12,
  })
}

/**
 * [Admin] 특정 사용자의 모니터링 대상 연도 목록
 */
export const useAdminAcademicMonitoringYears = (userId: string) => {
  return useQuery({
    queryKey: academicKeys.adminMonitoringYears(userId),
    queryFn: () => AcademicService.adminGetMonitoringYears(userId),
    enabled: !!userId,
  })
}

/**
 * [Admin] 특정 사용자의 월별 학업 보고서 목록
 */
export const useAdminAcademicUserReports = (userId: string) => {
  return useQuery({
    queryKey: academicKeys.adminUserReports(userId),
    queryFn: () => AcademicService.adminGetUserReports(userId),
    enabled: !!userId,
  })
}
