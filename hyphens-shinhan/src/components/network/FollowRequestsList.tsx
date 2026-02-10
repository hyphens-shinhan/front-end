'use client'

import { cn } from '@/utils/cn'
import type { FollowRequestDisplay } from '@/services/follows'
import Button from '@/components/common/Button'
import FollowingPersonCard from './FollowingPersonCard'

interface FollowRequestsListProps {
  requests?: FollowRequestDisplay[]
  onAccept?: (requestId: string) => void
  onReject?: (requestId: string) => void
  isLoading?: boolean
}

export default function FollowRequestsList({
  requests: requestsProp = [],
  onAccept,
  onReject,
  isLoading = false,
}: FollowRequestsListProps) {

  if (isLoading || requestsProp.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        팔로우 요청{' '}
        <span className={styles.sectionCount}>({requestsProp.length})</span>
      </h2>
      <div className={styles.list}>
        {requestsProp.map((request) => (
          <FollowingPersonCard
            key={request.id}
            person={{
              id: request.id,
              name: request.name,
              avatar: request.avatar_url ?? undefined,
            }}
            subtitle={request.university ?? '소속 없음'}
            actions={
              <div className={styles.actions}>
                <Button
                  type="warning"
                  size="S"
                  label="거절"
                  onClick={() => onReject?.(request.id)}
                />
                <Button
                  type="primary"
                  size="S"
                  label="수락"
                  onClick={() => onAccept?.(request.id)}
                />
              </div>
            }
          />
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: cn('pt-6 pb-6'),
  sectionTitle: cn('title-16 text-grey-10 tracking-tight mb-4'),
  sectionCount: cn('text-grey-8 title-16'),
  list: cn('space-y-4'),
  actions: cn('flex gap-3 shrink-0'),
  showMoreButton: cn(
    'w-full py-3 text-sm font-medium text-grey-7',
    'active:opacity-80 touch-manipulation',
  ),
  collapseButton: cn(
    'w-full py-2 text-sm text-grey-7',
    'active:opacity-80 touch-manipulation',
  ),
}
