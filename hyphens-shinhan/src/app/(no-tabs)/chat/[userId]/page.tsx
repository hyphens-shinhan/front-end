import { use } from 'react'
import ChatView from '@/components/chat/ChatView'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default function ChatConversationPage({ params }: PageProps) {
  const { userId } = use(params)

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-grey-6">로딩 중...</p>
      </div>
    )
  }

  return <ChatView otherUserId={userId} />
}
