import { useQuery } from '@tanstack/react-query'
import { AcademicService } from '@/services/academic'

/** 내 보고서 목록 쿼리 파라미터 */
export interface AcademicReportsQueryParams {
  year?: number
  limit?: number
  offset?: number
}

/** [Admin] 특정 사용자 보고서 목록 쿼리 파라미터 */
export interface AdminUserReportsQueryParams {
  limit?: number
  offset?: number
}

/**
 * Academic(유지 심사/월별 학업 보고서) 쿼리 키 관리 객체
 */
export const academicKeys = {
  all: ['academic'] as const,
  /** 내 보고서 목록 (params 포함 시 캐시 키에 반영) */
  reports: (params?: AcademicReportsQueryParams) =>
    [...academicKeys.all, 'reports', params ?? {}] as const,
  /** 특정 연·월 보고서 조회 */
  reportLookup: (year: number, month: number) =>
    [...academicKeys.all, 'report', year, month] as const,
  /** [Admin] 특정 사용자 모니터링 연도 목록 */
  adminMonitoringYears: (userId: string) =>
    [...academicKeys.all, 'admin', 'monitoring', userId] as const,
  /** [Admin] 특정 사용자 보고서 목록 (params 포함 시 캐시 키에 반영) */
  adminUserReports: (userId: string, params?: AdminUserReportsQueryParams) =>
    [...academicKeys.all, 'admin', 'userReports', userId, params ?? {}] as const,
}

/**
 * 월별 학업 보고서 목록 (내 보고서). year, limit, offset 선택
 */
export const useAcademicReports = (params?: AcademicReportsQueryParams) => {
  return useQuery({
    queryKey: academicKeys.reports(params),
    queryFn: () => AcademicService.getReports(params),
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
 * [Admin] 특정 사용자의 월별 학업 보고서 목록. limit, offset 선택
 */
export const useAdminAcademicUserReports = (
  userId: string,
  params?: AdminUserReportsQueryParams
) => {
  return useQuery({
    queryKey: academicKeys.adminUserReports(userId, params),
    queryFn: () => AcademicService.adminGetUserReports(userId, params),
    enabled: !!userId,
  })
}
