'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'
import type { Person } from '@/types/network'
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
import { useRecommendations, useNearby } from '@/hooks/network/useNetwork'
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

  const { data: recommendationsData } = useRecommendations()
  const { data: nearbyData, isLoading: nearbyLoading } = useNearby()
  const { data: followRequestsData, isLoading: followRequestsLoading } = useFollowRequests()
  const { data: myFollowingData, isLoading: myFollowingLoading } = useMyFollowing()
  const { data: mentorsData, isLoading: mentorsLoading } = useMentors()

  const acceptRequest = useAcceptFollowRequest()
  const rejectRequest = useRejectFollowRequest()
  const followMutation = useFollow()

  const recommendedPeople = recommendationsData?.users ?? []
  const nearbyPeople = nearbyData?.users ?? []
  const nearbyCenter = nearbyData
    ? { latitude: nearbyData.center_lat, longitude: nearbyData.center_lng }
    : undefined
  const followRequests = followRequestsData?.requests ?? []
  const myFollowing = myFollowingData?.followers ?? []
  const mentors = mentorsData?.mentors ?? []

  const commonFriendsForSection = useMemo(
    () =>
      recommendedPeople.map((p) => ({
        userId: p.id,
        name: p.name,
        generation: p.generation ?? '1기',
        category: p.scholarshipType ?? '글로벌',
        mutualFriends: p.mutualConnections,
        imageUrl: p.avatar,
      })),
    [recommendedPeople]
  )

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
                <NearbyFriendsSection
                  people={nearbyLoading ? undefined : nearbyPeople}
                  currentLocation={nearbyCenter}
                />
              </div>
              <div className="lg:hidden">
                <CommonFriendsSection friends={commonFriendsForSection} />
              </div>
              <div className="space-y-6">
                <div className="hidden lg:block">
                  <ActivitiesMentorBanner />
                </div>
                <FollowRequestsList
                  requests={followRequests}
                  onAccept={(id) => acceptRequest.mutate(id)}
                  onReject={(id) => rejectRequest.mutate(id)}
                  isLoading={followRequestsLoading}
                />
                <RecommendedPeopleList
                  people={recommendedPeople}
                  onPersonClick={handlePersonClick}
                  onFollow={handleFollow}
                />
              </div>
            </>
          )}
          {activeTab === 'mentors' && (
            <MentorsSection
              mentors={mentorsLoading ? [] : mentors}
              onFollowRequest={handleFollow}
              onPersonClick={handlePersonClick}
            />
          )}
          {activeTab === 'friends' && (
            <div className="pt-2 pb-6">
              <FollowRequestsList
                requests={followRequests}
                onAccept={(id) => acceptRequest.mutate(id)}
                onReject={(id) => rejectRequest.mutate(id)}
                isLoading={followRequestsLoading}
              />
              <FollowingList
                people={myFollowingLoading ? [] : myFollowing}
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
