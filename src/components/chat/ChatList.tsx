'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore, useChatStore } from '@/stores'
import { ROUTES } from '@/constants'
import { MOCK_CURRENT_USER_ID } from '@/data/mock-chat'
import Avatar from '@/components/common/Avatar'
import { Icon } from '@/components/common/Icon'
import { formatConversationTimestamp } from '@/utils/chat-utils'
import { cn } from '@/utils/cn'

export default function ChatList() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const { conversations, isLoading, loadConversations } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')

  const currentUserId = user?.id ?? MOCK_CURRENT_USER_ID

  useEffect(() => {
    if (currentUserId) loadConversations(currentUserId)
  }, [currentUserId, loadConversations])

  const filtered = conversations
    .filter((conv) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return conv.other_user?.name?.toLowerCase().includes(q) ?? false
    })
    .sort(
      (a, b) =>
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime(),
    )

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      <div className="shrink-0 bg-white px-4 pt-3 pb-2">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="IconLLineSearchLine" className="text-grey-7" />
          </span>
          <input
            type="text"
            placeholder="대화 검색하기"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-11 pr-4 bg-grey-2 rounded-full body-8 text-grey-11 placeholder:text-grey-7 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2 pb-24">
        {!currentUserId ? (
          <div className="flex items-center justify-center py-12">
            <p className="body-8 text-grey-8">로그인이 필요합니다.</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="body-8 text-grey-8">로딩 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="body-8 text-grey-8">메시지가 없습니다.</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const other = conv.other_user
            const unread = conv.unread_count ?? 0
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => router.push(`${ROUTES.CHAT}/${conv.other_user?.id}`)}
                className={cn(
                  'w-full rounded-2xl px-3.5 py-4 text-left transition-colors',
                  'bg-grey-1-1 hover:bg-grey-2',
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    src={other?.avatar ?? undefined}
                    alt={other?.name ?? ''}
                    size={41}
                    className="rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="title-14 text-grey-11 mb-0.5 truncate">
                      {other?.name ?? '알 수 없음'}
                    </h3>
                    <p className="body-8 text-grey-8 truncate">
                      {conv.last_message_content ?? '메시지 없음'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <div className="shrink-0 bg-grey-5 rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      <span className="font-caption-caption3 text-grey-11 leading-none">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
