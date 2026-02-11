'use client'

import { MentoringHistoryView } from '@/components/mentor/MentorDetailView/MentoringHistoryView'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { useSentMentoringRequests } from '@/hooks/mentoring/useMentoring'

/**
 * 나의 멘토링 내역 - list from GET /mentoring/requests/sent (date groups, mentor rows).
 * After successfully sending a mentor request, user is navigated here to see the list including the new one.
 */
export default function MentorHistoryPage() {
  const { data, isLoading } = useSentMentoringRequests()

  if (isLoading) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        className="min-h-dvh bg-white"
      />
    )
  }

  return (
    <MentoringHistoryView sentRequests={data?.requests} />
  )
}
