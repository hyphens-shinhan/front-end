'use client'

import type { Person } from '@/types/network'
import FollowingPersonCard from './FollowingPersonCard'
import { cn } from '@/utils/cn'

interface FollowingListProps {
  people: Person[]
  onPersonClick?: (person: Person) => void
  onMessage?: (personId: string) => void
}

export default function FollowingList({
  people,
  onPersonClick,
  onMessage,
}: FollowingListProps) {
  if (people.length === 0) {
    return (
      <section className="pt-6 pb-0">
        <h2 className="text-base font-medium text-grey-10 tracking-tight mb-4">
          내가 팔로우하는 사람
        </h2>
        <p className="text-sm text-grey-7 py-8">팔로우하는 사람이 없습니다.</p>
      </section>
    )
  }

  return (
    <section className="pt-6 pb-0">
      <h2 className="text-base font-medium text-grey-10 tracking-tight mb-4">
        내가 팔로우하는 사람{' '}
        <span className="text-grey-7 font-normal">({people.length})</span>
      </h2>
      <div className={cn('space-y-0')}>
        {people.map((person) => (
          <FollowingPersonCard
            key={person.id}
            person={person}
            onClick={() => onPersonClick?.(person)}
            onMessage={onMessage}
          />
        ))}
      </div>
    </section>
  )
}
