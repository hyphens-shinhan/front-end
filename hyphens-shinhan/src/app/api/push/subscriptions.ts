/**
 * 푸시 구독 저장소 (백엔드 DB 연동 전 임시 인메모리)
 * 실제 서비스에서는 DB(예: Supabase)에 사용자별로 저장하는 것이 좋습니다.
 */
export interface StoredSubscription {
  subscription: PushSubscriptionJSON
  createdAt: number
  /** 나중에 사용자 ID 등으로 교체 */
  userId?: string
}

const store: StoredSubscription[] = []

export function addSubscription(subscription: PushSubscriptionJSON, userId?: string): void {
  const endpoint = subscription.endpoint
  const existing = store.findIndex((s) => s.subscription.endpoint === endpoint)
  const item: StoredSubscription = { subscription, createdAt: Date.now(), userId }
  if (existing >= 0) {
    store[existing] = item
  } else {
    store.push(item)
  }
}

export function getAllSubscriptions(): StoredSubscription[] {
  return [...store]
}

export function removeSubscription(endpoint: string): void {
  const i = store.findIndex((s) => s.subscription.endpoint === endpoint)
  if (i >= 0) store.splice(i, 1)
}
