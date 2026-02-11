'use client'

import { Suspense, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import type { Person } from '@/types/network'
import type { NetworkTab } from '@/components/network/NetworkingTabs'
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

const TAB_PARAM = 'tab'
const VALID_TABS: NetworkTab[] = ['networking', 'mentors', 'friends']

function parseTabFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): NetworkTab {
  const tab = searchParams.get(TAB_PARAM)
  if (tab && VALID_TABS.includes(tab as NetworkTab)) return tab as NetworkTab
  return 'networking'
}

function NetworkPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = useMemo(
    () => parseTabFromSearchParams(searchParams),
    [searchParams],
  )

  const setActiveTab = useCallback(
    (tab: NetworkTab) => {
      const next = new URLSearchParams(searchParams.toString())
      next.set(TAB_PARAM, tab)
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

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
    router.push(ROUTES.MYPAGE.PUBLIC_PROFILE(_person.id))
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

function NetworkPageFallback() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={cn(styles.content, 'flex items-center justify-center min-h-[200px]')}>
          <span className="text-grey-8">로딩 중...</span>
        </div>
      </div>
    </div>
  )
}

export default function NetworkPage() {
  return (
    <Suspense fallback={<NetworkPageFallback />}>
      <NetworkPageContent />
    </Suspense>
  )
}
