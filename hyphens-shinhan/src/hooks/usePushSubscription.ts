'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  urlBase64ToUint8Array,
  isPushSupported,
  getNotificationPermission,
} from '@/utils/push'
import { NotificationService } from '@/services/notifications'
import type { PushSubscriptionCreate } from '@/types/notification'

export type PushStatus =
  | 'unsupported'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'subscribed'
  | 'error'
  | 'default'

export interface UsePushSubscriptionReturn {
  status: PushStatus
  subscribe: () => Promise<void>
  errorMessage: string | null
  isSupported: boolean
  recheckSupport: () => void
}

export function usePushSubscription(): UsePushSubscriptionReturn {
  const [status, setStatus] = useState<PushStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const runCheck = useCallback(() => {
    if (typeof window === 'undefined') return
    setStatus('loading')
    const supported = isPushSupported()
    setIsSupported(supported)
    if (!supported) {
      setStatus('unsupported')
      return
    }
    const perm = getNotificationPermission()
    if (perm === 'denied') {
      setStatus('denied')
      return
    }
    if (perm === 'granted') {
      let cancelled = false
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (!cancelled) setStatus(sub ? 'subscribed' : 'granted')
        })
      return () => {
        cancelled = true
      }
    }
    setStatus('default')
  }, [])

  // 클라이언트 마운트 후 지원 여부 확인 (SSR 시 'loading'만 나오는 문제 방지)
  useEffect(() => {
    if (typeof window === 'undefined') return
    runCheck()
  }, [runCheck])

  const recheckSupport = useCallback(() => {
    runCheck()
  }, [runCheck])

  const subscribe = useCallback(async () => {
    if (!isPushSupported()) {
      setStatus('unsupported')
      return
    }
    setStatus('loading')
    setErrorMessage(null)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setStatus('denied')
        setErrorMessage('알림 권한이 거부되었습니다.')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const { vapid_public_key } = await NotificationService.getVapidPublicKey()
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid_public_key) as BufferSource,
      })
      const subJson = sub.toJSON()
      const keys = subJson.keys
      if (!keys?.p256dh || !keys?.auth) {
        throw new Error('구독 정보를 읽을 수 없습니다.')
      }
      const body: PushSubscriptionCreate = {
        endpoint: subJson.endpoint ?? '',
        p256dh: keys.p256dh,
        auth: keys.auth,
      }
      await NotificationService.subscribeToPush(body)
      setStatus('subscribed')
    } catch (e) {
      setStatus('error')
      setErrorMessage(
        e instanceof Error ? e.message : '알림 구독에 실패했습니다.',
      )
    }
  }, [])

  return { status, subscribe, errorMessage, isSupported, recheckSupport }
}
