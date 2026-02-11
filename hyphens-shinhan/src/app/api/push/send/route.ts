import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { getAllSubscriptions } from '../subscriptions'

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:support@example.com',
    vapidPublicKey,
    vapidPrivateKey
  )
}

export async function POST(request: NextRequest) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { error: 'VAPID 키가 설정되지 않았습니다.' },
      { status: 503 }
    )
  }
  try {
    const body = await request.json().catch(() => ({}))
    const title = (body.title as string) ?? 'Hyphen'
    const bodyText = (body.body as string) ?? '테스트 알림입니다.'
    const url = (body.url as string) ?? '/'
    const payload = JSON.stringify({ title, body: bodyText, url })

    const subscriptions = getAllSubscriptions()
    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: '등록된 구독이 없습니다. 앱에서 알림을 켜주세요.' },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      subscriptions.map(({ subscription }) =>
        webpush.sendNotification(subscription as webpush.PushSubscription, payload)
      )
    )
    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length
    return NextResponse.json({
      ok: true,
      sent: succeeded,
      failed,
      total: subscriptions.length,
    })
  } catch (e) {
    console.error('Push send error:', e)
    return NextResponse.json({ error: '알림 발송 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
