'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'

/** Mock: 팔로우 요청 목록. API 연동 시 plimate-server / follows 등으로 교체 */
const MOCK_REQUESTS: { id: string; name: string; university?: string }[] = []

export default function FollowRequestsList() {
  const [showAll, setShowAll] = useState(false)
  const INITIAL_DISPLAY_COUNT = 2
  const requests = MOCK_REQUESTS
  const displayedRequests = showAll ? requests : requests.slice(0, INITIAL_DISPLAY_COUNT)

  if (requests.length === 0) return null

  return (
    <section className="pt-4 pb-0">
      <p className="text-[13px] text-grey-7 tracking-tight uppercase mb-3">
        팔로우 요청
      </p>
      <div className={cn('space-y-0')}>
        {displayedRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-4 py-4 min-h-[72px] touch-manipulation"
          >
            <div className="w-12 h-12 rounded-full bg-grey-3 shrink-0 overflow-hidden" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-grey-10 tracking-tight truncate">
                {request.name}
              </h3>
              {request.university && (
                <p className="text-[13px] text-grey-7 truncate mt-1">
                  {request.university}
                </p>
              )}
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                className="min-h-[44px] min-w-[68px] px-4 py-2.5 bg-primary-shinhanblue text-white text-[15px] font-medium rounded-lg active:opacity-90 transition-opacity touch-manipulation"
              >
                수락
              </button>
              <button
                type="button"
                className="min-h-[44px] px-3 py-2.5 text-sm font-medium text-grey-7 active:opacity-80 transition-opacity touch-manipulation"
              >
                거절
              </button>
            </div>
          </div>
        ))}
      </div>
      {requests.length > INITIAL_DISPLAY_COUNT && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-sm font-medium text-grey-7 active:opacity-80 touch-manipulation"
        >
          팔로우 요청 {requests.length - INITIAL_DISPLAY_COUNT}개 더 보기
        </button>
      )}
      {showAll && requests.length > INITIAL_DISPLAY_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-sm text-grey-7 active:opacity-80 touch-manipulation"
        >
          접기
        </button>
      )}
    </section>
  )
}
