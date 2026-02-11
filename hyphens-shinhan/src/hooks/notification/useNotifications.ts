import { useQuery } from '@tanstack/react-query'
import { NotificationService } from '@/services/notifications'

/**
 * 알림 쿼리 키
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: { limit?: number; offset?: number; unreadOnly?: boolean }) =>
    [...notificationKeys.lists(), params] as const,
}

export interface UseNotificationsParams {
  limit?: number
  offset?: number
  unreadOnly?: boolean
}

/**
 * 알림 목록 조회 (created_at 내림차순)
 */
export function useNotifications(params: UseNotificationsParams = {}) {
  const { limit = 20, offset = 0, unreadOnly = false } = params

  return useQuery({
    queryKey: notificationKeys.list({ limit, offset, unreadOnly }),
    queryFn: () =>
      NotificationService.getNotifications(limit, offset, unreadOnly),
  })
}
