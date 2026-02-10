'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'
import type { Person } from '@/types/network'
import { ROUTES } from '@/constants'
import NetworkingTabs from '@/components/network/NetworkingTabs'
import NetworkingTabContent from '@/components/network/NetworkingTabContent'
import MentorsTabContent from '@/components/network/MentorsTabContent'
import FriendsTabContent from '@/components/network/FriendsTabContent'
import {
  useFollowRequests,
  useMyFollowing,
  useAcceptFollowRequest,
  useRejectFollowRequest,
  useFollow,
} from '@/hooks/follows/useFollows'
import { useMentors } from '@/hooks/mentoring/useMentoring'

export default function NetworkPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'networking' | 'mentors' | 'friends'>('networking')

  const { data: followRequestsData, isLoading: followRequestsLoading } = useFollowRequests()
  const { data: myFollowingData, isLoading: myFollowingLoading } = useMyFollowing()
  const { data: mentorsData, isLoading: mentorsLoading } = useMentors()

  const acceptRequest = useAcceptFollowRequest()
  const rejectRequest = useRejectFollowRequest()
  const followMutation = useFollow()

  const followRequests = followRequestsData?.requests ?? []
  const myFollowing = myFollowingData?.followers ?? []
  const mentors = mentorsData?.mentors ?? []

  const handlePersonClick = (_person: Person) => {
    // TODO: 프로필 또는 채팅으로 이동
  }

  const handleFollow = (personId: string) => {
    followMutation.mutate(personId)
  }

  const handleMessage = (personId: string) => {
    router.push(`${ROUTES.CHAT}/${personId}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <NetworkingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className={styles.content}>
          {activeTab === 'networking' && <NetworkingTabContent />}
          {activeTab === 'mentors' && (
            <MentorsTabContent
              mentors={mentors}
              isLoading={mentorsLoading}
              onFollowRequest={handleFollow}
              onPersonClick={handlePersonClick}
            />
          )}
          {activeTab === 'friends' && (
            <FriendsTabContent
              followRequests={followRequests}
              followRequestsLoading={followRequestsLoading}
              myFollowing={myFollowing}
              myFollowingLoading={myFollowingLoading}
              onAcceptRequest={(id) => acceptRequest.mutate(id)}
              onRejectRequest={(id) => rejectRequest.mutate(id)}
              onPersonClick={handlePersonClick}
              onMessage={handleMessage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: cn('flex flex-col h-full bg-white'),
  main: cn('flex-1 min-h-0'),
  content: cn('px-4 space-y-6 max-w-[800px] mx-auto pb-12'),
}
