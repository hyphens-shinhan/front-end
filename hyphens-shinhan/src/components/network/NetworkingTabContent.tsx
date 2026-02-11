'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import MentoringApplicationCard from '@/components/network/MentoringApplicationCard'
import NearbyFriendsSection from '@/components/network/NearbyFriendsSection'
import CommonFriendsSection from '@/components/network/CommonFriendsSection'
import { useRecommendations, useNearby } from '@/hooks/network/useNetwork'
import { useFollow, useUnfollow } from '@/hooks/follows/useFollows'
import type { Person, Location } from '@/types/network'

export interface CommonFriendForSection {
  userId: string
  name: string
  generation: string
  category: string
  mutualFriends?: number
  imageUrl?: string
  mutualFriendAvatarUrls?: (string | null)[]
  isFollowing?: boolean
}

/** 네트워킹 탭 – 컴포넌트 내부에서 API 호출 */
interface NetworkingTabContentProps {
  // 필요 시 나중에 오버라이드용 props 추가
}

export default function NetworkingTabContent(_props: NetworkingTabContentProps) {
  const router = useRouter()
  const followMutation = useFollow()
  const unfollowMutation = useUnfollow()
  const [followedIds, setFollowedIds] = useState<Set<string>>(() => new Set())
  const [unfollowedIds, setUnfollowedIds] = useState<Set<string>>(() => new Set())

  const { data: recommendationsData } = useRecommendations()
  const { data: nearbyData, isLoading: nearbyLoading } = useNearby()

  const recommendedPeople: Person[] = recommendationsData?.users ?? []
  const nearbyPeople: Person[] = nearbyData?.users ?? []
  const nearbyCenter: Location | undefined = nearbyData
    ? { latitude: nearbyData.center_lat, longitude: nearbyData.center_lng }
    : undefined

  const handleProfileClick = useCallback((userId: string) => {
    router.push(ROUTES.MYPAGE.PUBLIC_PROFILE(userId))
  }, [router])

  const handleFollow = useCallback(
    (userId: string) => {
      followMutation.mutate(userId, {
        onSuccess: () => {
          setFollowedIds((prev) => new Set(prev).add(userId))
          setUnfollowedIds((prev) => {
            const next = new Set(prev)
            next.delete(userId)
            return next
          })
        },
      })
    },
    [followMutation]
  )

  const handleUnfollow = useCallback(
    (userId: string) => {
      unfollowMutation.mutate(userId, {
        onSuccess: () => {
          setUnfollowedIds((prev) => new Set(prev).add(userId))
          setFollowedIds((prev) => {
            const next = new Set(prev)
            next.delete(userId)
            return next
          })
        },
      })
    },
    [unfollowMutation]
  )

  const commonFriends = useMemo<CommonFriendForSection[]>(
    () =>
      recommendedPeople.map((p) => {
        const apiFollowing = p.isFollowing ?? false
        const effectiveFollowing =
          (apiFollowing || followedIds.has(p.id)) && !unfollowedIds.has(p.id)
        return {
          userId: p.id,
          name: p.name,
          generation: p.generation,
          category: p.scholarshipType,
          mutualFriends: p.mutualConnections,
          imageUrl: p.avatar,
          isFollowing: effectiveFollowing,
        }
      }),
    [recommendedPeople, followedIds, unfollowedIds]
  )

  return (
    <>
      <MentoringApplicationCard />
      <NearbyFriendsSection
        people={nearbyLoading ? undefined : nearbyPeople}
        currentLocation={nearbyCenter}
        onPersonClick={(person) => handleProfileClick(person.id)}
      />
      <CommonFriendsSection
        friends={commonFriends}
        onClick={handleProfileClick}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
    </>
  )
}
