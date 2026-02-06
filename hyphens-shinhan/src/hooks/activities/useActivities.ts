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

/** 활동 요약 캐시 유효 시간: 5분 (불필요한 refetch 감소) */
const SUMMARY_STALE_TIME_MS = 5 * 60 * 1000;
/** 캐시 유지 시간: 10분 */
const SUMMARY_GC_TIME_MS = 10 * 60 * 1000;

/**
 * 활동 요약 조회 (연도별 활동 현황)
 */
export const useActivitiesSummary = () => {
  return useQuery({
    queryKey: activityKeys.summary(),
    queryFn: () => ActivityService.getSummary(),
    staleTime: SUMMARY_STALE_TIME_MS,
    gcTime: SUMMARY_GC_TIME_MS,
  })
}
