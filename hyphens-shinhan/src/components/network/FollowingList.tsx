'use client'

import type { Person } from '@/types/network'
import FollowingPersonCard from './FollowingPersonCard'
import { cn } from '@/utils/cn'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants'

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
      <section className="pb-0">
        <h2 className="text-base font-medium text-grey-10 tracking-tight mb-4">
          내 친구{' '}
        </h2>
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.NETWORK.FOLLOWING_EMPTY}
        />
      </section>
    )
  }

  return (
    <section className="pb-0">
      <h2 className="title-16 text-grey-10 tracking-tight mb-4">
        내 친구{' '}
        <span className="text-grey-8 title-16">({people.length})</span>
      </h2>
      <div className={cn('space-y-4')}>
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
