'use client'

import { useState } from 'react'
import type { Person } from '@/types/network'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface PersonCardProps {
  person: Person
  onFollow?: (personId: string) => void
  onClick?: () => void
}

const getMutualConnectionAvatars = (count: number): string[] => {
  const avatars = [
    '/assets/images/male1.png',
    '/assets/images/male2.png',
    '/assets/images/woman1.png',
    '/assets/images/woman2.png',
  ]
  return Array.from({ length: Math.min(count, 3) }, (_, i) =>
    avatars[i % avatars.length]
  )
}

export default function PersonCard({ person, onFollow, onClick }: PersonCardProps) {
  const [imageError, setImageError] = useState(false)
  const mutualAvatars = person.mutualConnections
    ? getMutualConnectionAvatars(person.mutualConnections)
    : []

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'bg-white border border-grey-2 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center',
        'hover:bg-grey-1 hover:shadow-sm transition-all cursor-pointer shrink-0 w-[160px] sm:w-[180px]'
      )}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-grey-3 flex items-center justify-center mb-3 overflow-hidden">
        {person.avatar && !imageError ? (
          <img
            src={person.avatar}
            alt={person.name}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon name="IconLBoldProfile2user" size={24} className="text-grey-6" />
        )}
      </div>
      <h3 className="font-medium text-sm sm:text-base text-grey-10 mb-1">
        {person.name}
      </h3>
      <div className="flex flex-col items-center gap-0.5 mb-3">
        <span className="font-light text-xs text-grey-6">
          {person.generation} · {person.scholarshipType}
        </span>
      </div>
      {person.mutualConnections != null && person.mutualConnections > 0 && (
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center -space-x-2">
            {mutualAvatars.map((avatar, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-grey-3"
                style={{ zIndex: mutualAvatars.length - index }}
              >
                <img
                  src={avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {person.mutualConnections > 3 && (
              <div
                className="w-6 h-6 rounded-full border-2 border-white bg-grey-2 flex items-center justify-center"
                style={{ zIndex: 0 }}
              >
                <span className="font-medium text-[8px] text-grey-7">
                  +{person.mutualConnections - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {onFollow &&
        (person.isFollowing ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFollow(person.id)
            }}
            className="w-full px-3 py-1.5 rounded-lg bg-grey-2 text-grey-7 font-medium text-xs hover:bg-grey-3 transition-colors"
          >
            팔로잉
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFollow(person.id)
            }}
            className="w-full px-3 py-1.5 rounded-lg bg-primary-shinhanblue text-white font-medium text-xs hover:opacity-90 transition-colors"
          >
            팔로우
          </button>
        ))}
    </div>
  )
}
