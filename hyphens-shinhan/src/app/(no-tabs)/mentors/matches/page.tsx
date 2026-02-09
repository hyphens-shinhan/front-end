'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest, MentorMatch } from '@/types/mentor'
import { findTopMentors } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import { useUserStore } from '@/stores'
import MentorMatchResultsContent from '@/components/mentor/MentorMatchResultsContent'
import { cn } from '@/utils/cn'

const DEFAULT_YB = {
  university: '서울대학교',
  major: '소프트웨어학과',
  cohortYear: '1기',
}

export default function MentorMatchResultsPage() {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const [matches, setMatches] = useState<MentorMatch[]>([])
  const [request, setRequest] = useState<MentorshipRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mentorship_request') : null
    if (stored) {
      try {
        const parsed: MentorshipRequest = JSON.parse(stored)
        setRequest(parsed)
        findTopMentors(parsed, DEFAULT_YB, 7)
          .then((top) => {
            setMatches(top)
            setLoading(false)
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
          })
        return
      } catch {
        router.push(ROUTES.MENTORS.QUESTIONNAIRE)
        setLoading(false)
        return
      }
    }
    router.push(ROUTES.MENTORS.QUESTIONNAIRE)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className={styles.centerBlock}>
        <p className="body-8 text-grey-7">로딩 중...</p>
      </div>
    )
  }

  if (!request || matches.length === 0) {
    return (
      <div className={styles.centerBlock}>
        <p className="body-8 text-grey-7 mb-6">멘토를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
          className={styles.primaryButton}
        >
          다시 찾기
        </button>
      </div>
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
  centerBlock: cn(
    'flex flex-col items-center justify-center min-h-[200px]',
    'px-4 py-10',
  ),
  primaryButton: cn(
    'min-h-[52px] px-6 py-3 rounded-xl',
    'bg-primary-shinhanblue text-white body-5 font-semibold',
    'hover:opacity-90 transition-opacity',
  ),
} as const
