'use client'

import type { Person } from '@/types/network'
import { cn } from '@/utils/cn'
import Avatar from '@/components/common/Avatar'
import Button from '../common/Button'
import { useFollowStatus } from '@/hooks/follows/useFollows'

interface MentorCardProps {
  person: Person
  onFollowRequest?: (personId: string) => void
  onUnfollowRequest?: (personId: string) => void
  onClick?: () => void
}

export default function MentorCard({
  person,
  onFollowRequest,
  onUnfollowRequest,
  onClick,
}: MentorCardProps) {
  const { data: followStatus } = useFollowStatus(person.id)
  const isFollowing = followStatus?.is_following ?? false
  const isRequestPending = followStatus?.status === 'PENDING'
  const showFollowArea = onFollowRequest != null || onUnfollowRequest != null

  const getButtonLabel = () => {
    if (isFollowing) return '팔로우 취소'
    if (isRequestPending) return '팔로우 요청됨'
    return '팔로우 요청'
  }

  const handleButtonClick = () => {
    if (isFollowing || isRequestPending) {
      onUnfollowRequest?.(person.id)
    } else {
      onFollowRequest?.(person.id)
    }
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
      {showFollowArea && (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="secondary"
            size="S"
            label={getButtonLabel()}
            disabled={false}
            className={isRequestPending ? 'opacity-90' : undefined}
            onClick={handleButtonClick}
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

