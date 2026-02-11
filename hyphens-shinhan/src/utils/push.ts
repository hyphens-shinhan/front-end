/**
 * VAPID 공개키(base64)를 PushManager.subscribe()에 넣을 Uint8Array로 변환
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}

/**
 * 푸시 알림 지원 여부. (Safari 등은 PushManager가 window가 아니라 registration.pushManager에만 있어서
 * window 체크를 넣지 않음. 실제 구독 시 pushManager는 서비스 워커 등록 후 사용)
 * 푸시는 보안 컨텍스트(HTTPS 또는 localhost)에서만 동작합니다.
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof navigator === 'undefined') return false
  return 'serviceWorker' in navigator && 'Notification' in window
}

/** 지원 불가 시 안내용 이유 (배너 문구에 사용) */
export function getUnsupportedReason(): string | null {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return 'service_worker'
  if (!('Notification' in window)) return 'notification'
  if (typeof window.isSecureContext === 'boolean' && !window.isSecureContext) return 'secure_context'
  return null
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window))
    return 'denied'
  return Notification.permission
}
