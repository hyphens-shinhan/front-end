'use client'

import { useState } from 'react'
import type { Person } from '@/types/network'
import { cn } from '@/utils/cn'

interface FollowingPersonCardProps {
  person: Person
  onClick?: () => void
  onMessage?: (personId: string) => void
}

export default function FollowingPersonCard({
  person,
  onClick,
  onMessage,
}: FollowingPersonCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasAvatar = person.avatar && !imageError

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
        'flex items-center gap-4 py-4 min-h-[72px] touch-manipulation cursor-pointer',
        'active:opacity-95 transition-opacity'
      )}
    >
      <div className="w-12 h-12 rounded-full bg-grey-3 shrink-0 overflow-hidden">
        {hasAvatar ? (
          <img
            src={person.avatar}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-grey-10 tracking-tight truncate">
          {person.name}
        </h3>
        <p className="text-[13px] text-grey-7 truncate mt-1">
          {person.generation} · {person.scholarshipType}
          {person.university ? ` · ${person.university}` : ''}
        </p>
        {person.mutualConnections != null && person.mutualConnections > 0 && (
          <p className="text-xs text-grey-6 mt-0.5">
            겸친구 {person.mutualConnections}명
          </p>
        )}
      </div>
      {onMessage && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onMessage(person.id)
          }}
          className="shrink-0 py-2 px-1 min-h-[44px] flex items-center text-sm font-medium text-grey-7 active:opacity-80 transition-opacity touch-manipulation"
        >
          메시지
        </button>
      )}
    </div>
  )
}
