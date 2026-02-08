import { useQuery } from '@tanstack/react-query'
import { ActivityService } from '@/services/activities'

/**
 * 활동(Activities) 쿼리 키 관리 객체
 */
export const activityKeys = {
  all: ['activities'] as const,
  /** 활동 요약 조회 쿼리 키 */
  summary: () => [...activityKeys.all, 'summary'] as const,
}

/**
 * 활동 요약 조회 (연도별 활동 현황)
 */
export const useActivitiesSummary = () => {
  return useQuery({
    queryKey: activityKeys.summary(),
    queryFn: () => ActivityService.getSummary(),
  })
}
