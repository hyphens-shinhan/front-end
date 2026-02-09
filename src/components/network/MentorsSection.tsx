'use client'

import { useState } from 'react'
import type { Person } from '@/types/network'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import MentorCard from './MentorCard'

const MENTOR_FILTER_CHIPS = [
  { id: 'design', label: '디자인', className: 'bg-[#E8F4FD] text-[#1E88E5]' },
  { id: 'seoul', label: '서울', className: 'bg-[#E8F5E9] text-[#43A047]' },
  { id: 'ob', label: 'OB', className: 'bg-[#FFF3E0] text-[#FB8C00]' },
] as const

interface MentorsSectionProps {
  mentors: Person[]
  onFollowRequest?: (personId: string) => void
  onPersonClick?: (person: Person) => void
}

export default function MentorsSection({
  mentors,
  onFollowRequest,
  onPersonClick,
}: MentorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="pt-2 pb-6 space-y-4">
      <div className="relative">
        <Icon
          name="IconLLineSearchLine"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-6 pointer-events-none"
        />
        <input
          type="search"
          placeholder="Q 멘토 검색하기"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full h-11 pl-12 pr-4 rounded-full border border-grey-2 bg-grey-1-1',
            'text-sm text-grey-10 placeholder:text-grey-6',
            'focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue/20 focus:border-primary-shinhanblue focus:bg-white'
          )}
          aria-label="멘토 검색"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {MENTOR_FILTER_CHIPS.map((chip) => (
          <span
            key={chip.id}
            className={cn(
              'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
              chip.className
            )}
          >
            {chip.label}
          </span>
        ))}
        <button
          type="button"
          className="ml-auto p-2 rounded-lg text-grey-6 hover:bg-grey-1 active:opacity-80 transition-opacity touch-manipulation"
          aria-label="정렬"
        >
          <Icon name="IconLLineSort" size={24} />
        </button>
      </div>

      <section className="space-y-0">
        {mentors.map((person) => (
          <MentorCard
            key={person.id}
            person={person}
            onFollowRequest={onFollowRequest}
            onClick={() => onPersonClick?.(person)}
          />
        ))}
      </section>
    </div>
  )
}
