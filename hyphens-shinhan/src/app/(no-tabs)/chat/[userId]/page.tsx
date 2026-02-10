'use client'

import { useParams } from 'next/navigation'
import { ChatView } from '@/components/chat'
import { EMPTY_CONTENT_MESSAGES } from '@/constants'
import EmptyContent from '@/components/common/EmptyContent'

export default function ChatDetailPage() {
  const params = useParams()
  const userId = params?.userId as string

  if (!userId) {
    return (
      <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
    )
  }

  return <ChatView otherUserId={userId} />
}
