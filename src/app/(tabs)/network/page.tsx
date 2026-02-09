'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'
import type { Person } from '@/types/network'
import {
  MOCK_RECOMMENDED_PEOPLE,
  MOCK_FOLLOWING,
  MOCK_MENTORS,
} from '@/data/mock-network'
import { ROUTES } from '@/constants'
import RecommendedPeopleList from '@/components/network/RecommendedPeopleList'
import FollowingList from '@/components/network/FollowingList'
import FollowRequestsList from '@/components/network/FollowRequestsList'
import ActivitiesMentorBanner from '@/components/network/ActivitiesMentorBanner'
import MentoringApplicationCard from '@/components/network/MentoringApplicationCard'
import NetworkingTabs from '@/components/network/NetworkingTabs'
import MentorsSection from '@/components/network/MentorsSection'
import NearbyFriendsSection from '@/components/network/NearbyFriendsSection'
import CommonFriendsSection from '@/components/network/CommonFriendsSection'

export default function NetworkPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'networking' | 'mentors' | 'friends'>('networking')

  const handlePersonClick = (_person: Person) => {
    // TODO: 프로필 또는 채팅으로 이동
  }

  const handleFollow = (_personId: string) => {
    // TODO: 팔로우 API
  }

  const handleMessage = (personId: string) => {
    router.push(`${ROUTES.CHAT}/${personId}`)
  }

  return (
    <div className={cn('flex flex-col h-full bg-white')}>
      <div className={cn('flex-1 pb-8 min-h-0')}>
        <NetworkingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="px-4 space-y-6 max-w-[800px] mx-auto">
          {activeTab === 'networking' && (
            <>
              <div className="lg:hidden">
                <MentoringApplicationCard />
              </div>
              <div className="lg:hidden">
                <NearbyFriendsSection />
              </div>
              <div className="lg:hidden">
                <CommonFriendsSection />
              </div>
              <div className="space-y-6">
                <div className="hidden lg:block">
                  <ActivitiesMentorBanner />
                </div>
                <FollowRequestsList />
                <RecommendedPeopleList
                  people={MOCK_RECOMMENDED_PEOPLE}
                  onPersonClick={handlePersonClick}
                  onFollow={handleFollow}
                />
                <FollowingList
                  people={MOCK_FOLLOWING}
                  onPersonClick={handlePersonClick}
                  onMessage={handleMessage}
                />
              </div>
            </>
          )}
          {activeTab === 'mentors' && (
            <MentorsSection
              mentors={MOCK_MENTORS}
              onFollowRequest={handleFollow}
              onPersonClick={handlePersonClick}
            />
          )}
          {activeTab === 'friends' && (
            <div className="pt-2 pb-6">
              <FollowRequestsList />
              <FollowingList
                people={MOCK_FOLLOWING}
                onPersonClick={handlePersonClick}
                onMessage={handleMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
