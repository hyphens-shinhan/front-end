'use client'

import type { Person } from '@/types/network'
import PersonCard from './PersonCard'
import { cn } from '@/utils/cn'

interface RecommendedPeopleListProps {
  people: Person[]
  onPersonClick?: (person: Person) => void
  onFollow?: (personId: string) => void
}

export default function RecommendedPeopleList({
  people,
  onPersonClick,
  onFollow,
}: RecommendedPeopleListProps) {
  if (people.length === 0) return null

  return (
    <div className={cn('space-y-3 sm:space-y-4')}>
      <div>
        <h2 className="font-semibold text-lg sm:text-xl text-grey-10">
          추천 네트워크
        </h2>
      </div>
      <div
        className={cn(
          'flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide',
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        )}
      >
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onFollow={onFollow}
            onClick={() => onPersonClick?.(person)}
          />
        ))}
      </div>
    </div>
  )
}
