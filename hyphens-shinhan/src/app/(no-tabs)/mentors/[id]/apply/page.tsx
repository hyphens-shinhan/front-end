'use client'

import { useRouter, useParams } from 'next/navigation'
import { ROUTES } from '@/constants'
import { MentorApplicationForm } from '@/components/mentor/MentorDetailView/MentorApplicationForm'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import Button from '@/components/common/Button'
import { useMentorById } from '@/hooks/mentoring/useMentoring'

export default function MentorApplyPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.id as string

  const { data: mentor, isLoading: loading } = useMentorById(mentorId)

  if (loading) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        className="min-h-dvh bg-white"
      />
    )
  }

  if (!mentor) {
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.MENTOR.NOT_FOUND}
        action={
          <Button
            label={EMPTY_CONTENT_MESSAGES.MENTOR.GO_TO_MATCHES}
            size="L"
            type="primary"
            fullWidth
            onClick={() => router.push(ROUTES.MENTORS.MATCHES)}
          />
        }
        className="min-h-dvh bg-white"
      />
    )
  }

  return (
    <div className="min-h-full px-5 pb-8 pt-2">
      <MentorApplicationForm mentor={mentor} onCancel={() => router.back()} />
    </div>
  )
}
