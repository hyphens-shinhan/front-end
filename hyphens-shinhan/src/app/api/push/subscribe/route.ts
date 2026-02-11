import { NextRequest, NextResponse } from 'next/server'
import { addSubscription } from '../subscriptions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const subscription = body as PushSubscriptionJSON
    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json(
        { error: '유효한 PushSubscription이 필요합니다.' },
        { status: 400 }
      )
    }
    const userId = typeof body.userId === 'string' ? body.userId : undefined
    addSubscription(subscription, userId)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '구독 저장 실패' }, { status: 500 })
  }
}
