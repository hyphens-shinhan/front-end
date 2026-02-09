'use client'

import { MentorNotFoundView } from '@/components/mentor/MentorDetailView/MentorNotFoundView'
import { useSentMentoringRequests } from '@/hooks/mentoring/useMentoring'

/**
 * 나의 멘토링 내역 - list from GET /mentoring/requests/sent (date groups, mentor rows).
 * After successfully sending a mentor request, user is navigated here to see the list including the new one.
 */
export default function MentorHistoryPage() {
  const { data, isLoading } = useSentMentoringRequests()

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <p className="text-sm text-grey-8">로딩 중...</p>
      </div>
    )
  }

  return (
    <MentorNotFoundView sentRequests={data?.requests} />
  )
}
