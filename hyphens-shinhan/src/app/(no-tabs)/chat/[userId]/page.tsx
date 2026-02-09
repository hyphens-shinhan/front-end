'use client'

import { useParams } from 'next/navigation'
import { ChatView } from '@/components/chat'

export default function ChatDetailPage() {
  const params = useParams()
  const userId = params?.userId as string

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="body-8 text-grey-8">로딩 중...</p>
      </div>
    )
  }

  return <ChatView otherUserId={userId} />
}
