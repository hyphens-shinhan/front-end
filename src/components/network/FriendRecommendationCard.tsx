'use client'

import { cn } from '@/utils/cn'

interface FriendRecommendationCardProps {
  userId: string
  name: string
  generation: string
  category: string
  mutualFriends?: number
  imageUrl?: string
  onFollow?: () => void
  onClick?: () => void
}

export default function FriendRecommendationCard({
  name,
  generation,
  category,
  mutualFriends = 0,
  imageUrl,
  onFollow,
  onClick,
}: FriendRecommendationCardProps) {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFollow?.()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'shrink-0 w-[152px] min-h-[200px] flex flex-col items-center cursor-pointer touch-manipulation pt-5'
      )}
    >
      <div className="w-16 h-16 rounded-full bg-grey-3 mb-4 overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <h3 className="text-[15px] font-medium text-grey-10 tracking-tight text-center mb-0.5 leading-tight">
        {name}
      </h3>
      <p className="text-[13px] text-grey-7 text-center mb-3 leading-snug">
        {generation} · {category}
      </p>
      {mutualFriends > 0 && (
        <p className="text-xs text-grey-6 text-center mb-4">
          겸친구 {mutualFriends}명
        </p>
      )}
      {mutualFriends <= 0 && <div className="mb-4" />}
      <button
        type="button"
        onClick={handleFollowClick}
        className="w-full min-h-[44px] px-4 py-2.5 bg-primary-shinhanblue text-white text-sm font-medium rounded-lg active:opacity-90 transition-opacity touch-manipulation"
      >
        팔로우
      </button>
    </div>
  )
}
