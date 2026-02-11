'use client'

import { ChatList } from '@/components/chat'

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <ChatList />
    </div>
  )
}
