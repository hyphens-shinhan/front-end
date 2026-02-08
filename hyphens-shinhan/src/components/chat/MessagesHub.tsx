'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/common/Icon'
import { useChat } from '@/contexts/ChatContext'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

export default function MessagesHub() {
  const router = useRouter()
  const { listItems, isLoadingRooms } = useChat()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = searchQuery.trim()
    ? listItems.filter((item) => {
        const q = searchQuery.toLowerCase()
        return (
          item.otherUserName.toLowerCase().includes(q) ||
          (item.lastMessageContent?.toLowerCase().includes(q) ?? false)
        )
      })
    : listItems

  const sorted = [...filtered].sort((a, b) => {
    const tA = new Date(a.lastMessageAt).getTime()
    const tB = new Date(b.lastMessageAt).getTime()
    return tB - tA
  })

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="shrink-0 z-10 bg-white px-4 pt-3 pb-2">
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-grey-5">
            <Icon name="IconLLineSearchLine" size={20} />
          </span>
          <input
            type="text"
            placeholder="대화 검색하기"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-[42px] pl-11 pr-4 bg-grey-2 rounded-full text-sm text-grey-10',
              'placeholder:text-grey-5 focus:outline-none border border-transparent focus:border-grey-3'
            )}
            aria-label="대화 검색"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2 pb-6">
        {isLoadingRooms ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-grey-6">로딩 중...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-grey-6">
              {searchQuery.trim() ? '검색 결과가 없습니다.' : '메시지가 없습니다.'}
            </p>
          </div>
        ) : (
          sorted.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(`${ROUTES.CHAT}/${item.otherUserId}`)}
              className={cn(
                'w-full text-left bg-grey-2 rounded-2xl px-3.5 py-4',
                'hover:bg-grey-3 transition-colors border border-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-[41px] h-[41px] rounded-full bg-grey-3 shrink-0 overflow-hidden">
                  {item.otherUserAvatar ? (
                    <img
                      src={item.otherUserAvatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-grey-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-grey-10 mb-0.5 truncate">
                    {item.otherUserName}
                  </h3>
                  <p className="text-sm text-grey-6 truncate leading-5">
                    {item.lastMessageContent ?? '메시지 없음'}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
