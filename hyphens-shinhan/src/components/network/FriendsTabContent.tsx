'use client'

import { cn } from '@/utils/cn'
import FollowingList from '@/components/network/FollowingList'
import FollowRequestsList from '@/components/network/FollowRequestsList'
import type { Person } from '@/types/network'
import type { FollowRequestDisplay } from '@/services/follows'

interface FriendsTabContentProps {
  followRequests?: FollowRequestDisplay[]
  followRequestsLoading?: boolean
  myFollowing?: Person[]
  myFollowingLoading?: boolean
  onAcceptRequest?: (requestId: string) => void
  onRejectRequest?: (requestId: string) => void
  onPersonClick?: (person: Person) => void
  onMessage?: (personId: string) => void
}

const styles = {
  content: cn('pt-2 pb-6'),
}

export default function FriendsTabContent({
  followRequests = [],
  followRequestsLoading = false,
  myFollowing = [],
  myFollowingLoading = false,
  onAcceptRequest,
  onRejectRequest,
  onPersonClick,
  onMessage,
}: FriendsTabContentProps) {
  return (
    <div className={styles.content}>
      <FollowRequestsList
        requests={followRequests}
        onAccept={onAcceptRequest}
        onReject={onRejectRequest}
        isLoading={followRequestsLoading}
      />
      <FollowingList
        people={myFollowingLoading ? [] : myFollowing}
        onPersonClick={onPersonClick}
        onMessage={onMessage}
      />
    </div>
  )
}
