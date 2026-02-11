'use client'

import { useParams } from 'next/navigation'
import { EMPTY_CONTENT_MESSAGES } from '@/constants'
import { MentorDetailView, MentorDetailSkeleton } from '@/components/mentor/MentorDetailView'
import EmptyContent from '@/components/common/EmptyContent'
import { MentorDetailPageProvider, useMentorDetailPage } from './MentorDetailPageContext'

function MentorDetailContent() {
  const { mentor, loading } = useMentorDetailPage()

  if (loading) {
    return <MentorDetailSkeleton />
  }

  if (!mentor) {
    return (
      <EmptyContent
        variant="empty"
        message={EMPTY_CONTENT_MESSAGES.MENTOR.NOT_FOUND}
        className={styles.emptyWrapper}
      />
    )
  }

  return <MentorDetailView mentor={mentor} />
}

export default function MentorDetailPage() {
  const params = useParams()
  const mentorId = params.id as string

  return (
    <MentorDetailPageProvider mentorId={mentorId}>
      <MentorDetailContent />
    </MentorDetailPageProvider>
  )
}

const styles = {
  emptyWrapper: 'min-h-screen bg-white',
} as const
