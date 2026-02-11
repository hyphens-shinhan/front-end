import { NextResponse } from 'next/server'

const publicKey = process.env.VAPID_PUBLIC_KEY

export async function GET() {
  if (!publicKey) {
    return NextResponse.json(
      { error: 'VAPID_PUBLIC_KEY가 설정되지 않았습니다. .env.local에 추가 후 재시작하세요.' },
      { status: 503 }
    )
  }
  return NextResponse.json({ publicKey })
}
