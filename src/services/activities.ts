import apiClient from './apiClient'
import type { ActivitiesSummaryResponse } from '@/types/activities'

const BASE = '/activities'

/**
 * 활동(Activities) API 서비스
 */
export const ActivityService = {
  /**
   * 활동 요약 조회 (연도별 활동 현황)
   */
  getSummary: async (): Promise<ActivitiesSummaryResponse> => {
    const response = await apiClient.get<ActivitiesSummaryResponse>(BASE)
    return response.data
  },
}
