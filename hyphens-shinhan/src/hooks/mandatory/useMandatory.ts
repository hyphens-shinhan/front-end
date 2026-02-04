import { useQuery } from '@tanstack/react-query'
import { MandatoryService } from '@/services/mandatory'

/**
 * Mandatory(필수 활동) 쿼리 키 관리 객체
 */
export const mandatoryKeys = {
  all: ['mandatory'] as const,
  /** 연도별 목록 */
  byYear: (year: number) => [...mandatoryKeys.all, 'year', year] as const,
  /** 활동 + 제출 조회 */
  activityLookup: (activityId: string) =>
    [...mandatoryKeys.all, 'activity', activityId] as const,
  /** [Admin] 활동 목록 */
  adminActivities: () => [...mandatoryKeys.all, 'admin', 'activities'] as const,
  /** [Admin] 활동 단건 */
  adminActivity: (activityId: string) =>
    [...mandatoryKeys.all, 'admin', 'activity', activityId] as const,
  /** [Admin] 특정 활동 제출 목록 */
  adminSubmissions: (activityId: string) =>
    [...mandatoryKeys.all, 'admin', 'submissions', activityId] as const,
}

/**
 * 연도별 필수 활동 목록 조회
 */
export const useMandatoryByYear = (year: number) => {
  return useQuery({
    queryKey: mandatoryKeys.byYear(year),
    queryFn: () => MandatoryService.getByYear(year),
    enabled: !!year,
  })
}

/**
 * 활동 + 내 제출 조회
 */
export const useMandatoryActivityLookup = (activityId: string) => {
  return useQuery({
    queryKey: mandatoryKeys.activityLookup(activityId),
    queryFn: () => MandatoryService.getActivityLookup(activityId),
    enabled: !!activityId,
  })
}

/**
 * [Admin] 필수 활동 목록 조회
 */
export const useAdminMandatoryActivities = () => {
  return useQuery({
    queryKey: mandatoryKeys.adminActivities(),
    queryFn: () => MandatoryService.adminListActivities(),
  })
}

/**
 * [Admin] 필수 활동 단건 조회
 */
export const useAdminMandatoryActivity = (activityId: string) => {
  return useQuery({
    queryKey: mandatoryKeys.adminActivity(activityId),
    queryFn: () => MandatoryService.adminGetActivity(activityId),
    enabled: !!activityId,
  })
}

/**
 * [Admin] 특정 활동의 제출 목록 조회
 */
export const useAdminMandatorySubmissions = (activityId: string) => {
  return useQuery({
    queryKey: mandatoryKeys.adminSubmissions(activityId),
    queryFn: () => MandatoryService.adminListSubmissions(activityId),
    enabled: !!activityId,
  })
}
