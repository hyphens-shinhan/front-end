'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { Mentor, MentorshipRequest } from '@/types/mentor'
import { getMentorByIdSync, getMentorMatch } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import MentorProfile from '@/components/mentor/MentorProfile'
import { cn } from '@/utils/cn'

const DEFAULT_YB = {
  university: '서울대학교',
  major: '소프트웨어학과',
  cohortYear: '1기',
}

export default function MentorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.id as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [matchScore, setMatchScore] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mentorData = getMentorByIdSync(mentorId)
    if (mentorData) {
      setMentor(mentorData)
      const stored =
        typeof window !== 'undefined'
          ? localStorage.getItem('mentorship_request')
          : null
      if (stored) {
        try {
          const request: MentorshipRequest = JSON.parse(stored)
          getMentorMatch(mentorId, request, DEFAULT_YB).then((match) => {
            if (match) setMatchScore(match.score.total)
          })
        } catch {
          // ignore
        }
      }
    }
    setLoading(false)
  }, [mentorId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[800px] mx-auto px-5 md:px-6 py-8">
          <div className="text-center text-grey-7">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[800px] mx-auto px-5 md:px-6 py-8">
          <div className="text-center">
            <p className="text-grey-7 mb-4">멘토를 찾을 수 없습니다</p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.MENTORS.MATCHES)}
              className={cn(
                'px-6 py-3 bg-primary-shinhanblue text-white font-semibold rounded-lg',
                'hover:opacity-90 transition-opacity'
              )}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-px pb-20">
        <div className="max-w-[800px] mx-auto px-5 md:px-6 py-4 sm:py-6">
          <MentorProfile
            mentor={mentor}
            matchScore={matchScore}
          />
        </div>
      </div>
    </div>
  )
}
