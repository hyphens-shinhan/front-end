'use client'

import { useState } from 'react'
import type { Person } from '@/types/network'
import { cn } from '@/utils/cn'
import Avatar from '@/components/common/Avatar'
import Button from '../common/Button'

interface MentorCardProps {
  person: Person
  onFollowRequest?: (personId: string) => void
  onClick?: () => void
}

export default function MentorCard({
  person,
  onFollowRequest,
  onClick,
}: MentorCardProps) {
  const [followRequested, setFollowRequested] = useState(false)

  const handleFollowRequest = () => {
    if (followRequested) return
    setFollowRequested(true)
    onFollowRequest?.(person.id)
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
      className={styles.container}
    >
      <Avatar
        src={person.avatar}
        alt={person.name}
        size={46}
      />
      <div className={styles.infoWrapper}>
        <h3 className={styles.name}>
          {person.name}
        </h3>
        <p className={styles.subtitle}>
          {person.university}
        </p>
      </div>
      {onFollowRequest && (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="secondary"
            size="S"
            label={followRequested ? '팔로우 요청됨' : '팔로우 요청'}
            disabled={followRequested}
            onClick={handleFollowRequest}
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  container: cn(
    'flex items-center gap-4 cursor-pointer',
    'active:opacity-95 transition-opacity',
  ),
  infoWrapper: cn('flex-1 min-w-0'),
  name: cn('body-5 text-grey-11'),
  subtitle: cn('body-7 text-grey-8'),
  followButton: cn(
    'shrink-0',
  ),
}

