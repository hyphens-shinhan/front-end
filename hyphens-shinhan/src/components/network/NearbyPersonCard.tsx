'use client'

import { useState } from 'react'
import type { Person } from '@/types/network'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface NearbyPersonCardProps {
  person: Person
  onClick?: () => void
}

export default function NearbyPersonCard({ person, onClick }: NearbyPersonCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    if (distance < 5) return '5km 이내'
    return `${distance.toFixed(1)}km`
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
        'bg-grey-1 rounded-xl p-4 hover:bg-grey-2 hover:shadow-sm transition-all cursor-pointer w-full'
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-grey-3 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {person.avatar && !imageError ? (
              <img
                src={person.avatar}
                alt={person.name}
                className="w-full h-full rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon name="IconLBoldProfile2user" size={20} className="text-grey-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-grey-10 truncate mb-0.5">
              {person.name}
            </h3>
            {person.distance !== undefined && (
              <p className="font-light text-xs text-grey-7">
                {formatDistance(person.distance)} 거리
              </p>
            )}
          </div>
        </div>
        <div className="mb-2">
          <p className="font-light text-xs text-grey-6 mb-1">
            {person.generation} · {person.scholarshipType}
          </p>
          {person.university && (
            <p className="font-light text-xs text-grey-6">{person.university}</p>
          )}
        </div>
      </div>
    </div>
  )
}
