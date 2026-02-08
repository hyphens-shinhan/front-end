'use client'

import MessagesHub from '@/components/chat/MessagesHub'

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <MessagesHub />
    </div>
  )
}
