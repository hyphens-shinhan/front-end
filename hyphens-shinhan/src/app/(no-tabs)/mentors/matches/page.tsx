'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { useUserStore } from '@/stores'
import MentorMatchResultsContent from '@/components/mentor/MentorMatchResultsContent'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { useMentorRecommendationMatches } from '@/hooks/mentoring/useMentoring'
import { cn } from '@/utils/cn'
import Button from '@/components/common/Button'

export default function MentorMatchResultsPage() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const { matches, isLoading, error } = useMentorRecommendationMatches({ limit: 7 })

  if (isLoading) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        className={styles.fullHeight}
      />
    )
  }

  if (error || matches.length === 0) {
    return (
      <EmptyContent
        variant="error"
        message={error ? EMPTY_CONTENT_MESSAGES.ERROR.DEFAULT : EMPTY_CONTENT_MESSAGES.MENTOR.NOT_FOUND}
        action={
          <Button
            label="다시 찾기"
            size="L"
            type="primary"
            fullWidth
            onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
          />
        }
      />
    )
  }

  return (
    <MentorMatchResultsContent
      matches={matches}
      userName={user?.name}
    />
  )
}

const styles = {
  fullHeight: 'flex-1',
  primaryButton: cn(
    'min-h-[52px] px-6 py-3 rounded-xl',
    'bg-primary-shinhanblue text-white body-5 font-semibold',
    'hover:opacity-90 transition-opacity',
  ),
} as const
