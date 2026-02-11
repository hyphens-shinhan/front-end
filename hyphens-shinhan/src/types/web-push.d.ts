declare module 'web-push' {
  export interface PushSubscription {
    endpoint: string
    keys: { p256dh: string; auth: string }
    expirationTime?: number
  }

  export function setVapidDetails(
    mailto: string,
    publicKey: string,
    privateKey: string
  ): void

  export function sendNotification(
    subscription: PushSubscription,
    payload: string | Buffer,
    options?: Record<string, unknown>
  ): Promise<unknown>
}
