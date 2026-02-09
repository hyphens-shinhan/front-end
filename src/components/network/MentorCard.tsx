'use client'

import { useState } from 'react'
import type { Person, MentorListRole } from '@/types/network'
import { cn } from '@/utils/cn'

interface MentorCardProps {
  person: Person
  onFollowRequest?: (personId: string) => void
  onClick?: () => void
}

function subtitle(role: MentorListRole | undefined, generation: string): string {
  if (role === 'MENTOR') return `멘토 · ${generation}`
  return `YB · ${generation}`
}

export default function MentorCard({
  person,
  onFollowRequest,
  onClick,
}: MentorCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasAvatar = person.avatar && !imageError
  const role = person.mentorListRole ?? 'YB'

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
        'flex items-center gap-4 py-4 min-h-[80px] touch-manipulation cursor-pointer',
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
          {subtitle(role, person.generation)}
        </p>
      </div>
      {onFollowRequest && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onFollowRequest(person.id)
          }}
          className="shrink-0 min-h-[38px] py-2 px-4 rounded-lg border border-grey-3 text-sm font-medium text-grey-7 active:opacity-80 transition-opacity touch-manipulation"
        >
          팔로우 요청
        </button>
      )}
    </div>
  )
}
