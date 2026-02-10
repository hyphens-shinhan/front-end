'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { ROUTES } from '@/constants'
import MentorQuestionnaire from '@/components/mentor/MentorQuestionnaire'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { useMentoringSurvey } from '@/hooks/mentoring/useMentoringSurvey'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/common/Button'

export default function MentorQuestionnairePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const {
    initialData,
    isLoadingSurvey,
    surveyError,
    submitSurvey,
  } = useMentoringSurvey()

  const handleComplete = async (request: MentorshipRequest) => {
    try {
      await submitSurvey(request)
      if (typeof window !== 'undefined') {
        localStorage.setItem('mentorship_request', JSON.stringify(request))
      }
      router.push(ROUTES.MENTORS.MATCHES)
    } catch {
      toast.error('설문 제출에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  if (isLoadingSurvey) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        className="flex-1"
      />
    )
  }

  if (surveyError) {
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.ERROR.SURVEY}
        action={
          <Button
            label="새로고침"
            size="M"
            type="primary"
            onClick={() => window.location.reload()}
          />
        }
      />
    )
  }

  const stepParam = searchParams.get('step')
  const parsedStep = stepParam ? Number(stepParam) : undefined
  const initialStep =
    parsedStep && Number.isFinite(parsedStep)
      ? Math.min(7, Math.max(1, parsedStep))
      : undefined

  return (
    <MentorQuestionnaire
      initialData={initialData}
      initialStep={initialStep}
      onComplete={handleComplete}
    />
  )
}
