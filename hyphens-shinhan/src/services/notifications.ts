import apiClient from './apiClient'
import type {
  NotificationListResponse,
  MarkAllReadResponse,
  NotificationMessageResponse,
  PushSubscriptionCreate,
  VapidKeyResponse,
  PushSubscriptionMessageResponse,
} from '@/types/notification'

/**
 * 알림 API (Base: /api/v1/notifications | 인증: Bearer)
 * - 목록: created_at 내림차순
 * - unread_only=true 시 읽지 않은 알림만 조회
 * - read/delete는 recipient가 현재 유저인 것만 처리
 */
const BASE = '/notifications'

export const NotificationService = {
  /**
   * GET /notifications - 알림 목록 조회
   * @param limit 1~100, 기본 20
   * @param offset 기본 0
   * @param unreadOnly true면 미읽음만
   */
  getNotifications: async (
    limit = 20,
    offset = 0,
    unreadOnly = false,
  ): Promise<NotificationListResponse> => {
    const response = await apiClient.get<NotificationListResponse>(BASE, {
      params: {
        limit: Math.min(100, Math.max(1, limit)),
        offset,
        unread_only: unreadOnly,
      },
    })
    return response.data
  },

  /**
   * PATCH /notifications/read-all - 전체 읽음 처리
   */
  markAllRead: async (): Promise<MarkAllReadResponse> => {
    const response = await apiClient.patch<MarkAllReadResponse>(
      `${BASE}/read-all`,
    )
    return response.data
  },

  /**
   * PATCH /notifications/:id/read - 단건 읽음 처리
   */
  markNotificationRead: async (
    id: string,
  ): Promise<NotificationMessageResponse> => {
    const response = await apiClient.patch<NotificationMessageResponse>(
      `${BASE}/${id}/read`,
    )
    return response.data
  },

  /**
   * DELETE /notifications/:id - 알림 삭제
   */
  deleteNotification: async (
    id: string,
  ): Promise<NotificationMessageResponse> => {
    const response = await apiClient.delete<NotificationMessageResponse>(
      `${BASE}/${id}`,
    )
    return response.data
  },

  // ---------- 웹 푸시 (Web Push) ----------

  /**
   * GET /notifications/push/vapid-key - VAPID 공개키 조회
   * 클라이언트에서 pushManager.subscribe() 할 때 사용
   */
  getVapidPublicKey: async (): Promise<VapidKeyResponse> => {
    const response = await apiClient.get<VapidKeyResponse>(
      `${BASE}/push/vapid-key`,
    )
    return response.data
  },

  /**
   * POST /notifications/push/subscribe - 푸시 구독 등록
   * endpoint 기준 upsert (같은 endpoint면 갱신)
   */
  subscribeToPush: async (
    body: PushSubscriptionCreate,
  ): Promise<PushSubscriptionMessageResponse> => {
    const response = await apiClient.post<PushSubscriptionMessageResponse>(
      `${BASE}/push/subscribe`,
      body,
    )
    return response.data
  },

  /**
   * DELETE /notifications/push/subscribe - 푸시 구독 해제
   * body: PushSubscriptionCreate (endpoint로 구독 식별)
   */
  unsubscribeFromPush: async (
    body: PushSubscriptionCreate,
  ): Promise<PushSubscriptionMessageResponse> => {
    const response = await apiClient.delete<PushSubscriptionMessageResponse>(
      `${BASE}/push/subscribe`,
      { data: body },
    )
    return response.data
  },
}
