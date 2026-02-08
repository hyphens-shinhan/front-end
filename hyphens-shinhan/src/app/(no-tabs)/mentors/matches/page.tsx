'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest, MentorMatch } from '@/types/mentor'
import { findTopMentors } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import MentorMatchCard from '@/components/mentor/MentorMatchCard'
import { cn } from '@/utils/cn'

const CATEGORY_LABELS: Record<string, string> = {
  career_job_search: '커리어 및 취업',
  academic_excellence: '학업 우수성',
  leadership_soft_skills: '리더십 및 소프트 스킬',
  entrepreneurship_innovation: '창업 및 혁신',
  mental_health_wellness: '정신 건강 및 웰빙',
  financial_management: '재무 관리',
  personal_development: '자기계발',
  volunteer_community_service: '봉사 및 지역사회',
  specific_major_field: '전공 분야',
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

const DEFAULT_YB = {
  university: '서울대학교',
  major: '소프트웨어학과',
  cohortYear: '1기',
}

export default function MentorMatchResultsPage() {
  const router = useRouter()
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

  const handleSkip = (index: number) => {
    setMatches((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[600px] mx-auto px-5 py-10">
          <p className="text-sm text-grey-7">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!request || matches.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[600px] mx-auto px-5 py-10">
          <p className="text-sm text-grey-7 mb-6">멘토를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
            className={cn(
              'min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg',
              'hover:opacity-90 transition-opacity'
            )}
          >
            다시 찾기
          </button>
        </div>
      </div>
    )
  }

  const criteriaText =
    request.goalCategories && request.goalCategories.length > 1
      ? request.goalCategories.map(getCategoryLabel).join(', ')
      : getCategoryLabel(request.goalCategory)

  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="max-w-[600px] mx-auto px-5 pt-6 pb-20">
          <h1 className="text-[20px] font-semibold text-grey-11 tracking-[-0.02em] mb-2">
            {matches.length}명의 멘토
          </h1>
          <p className="text-sm text-grey-7 mb-8">
            {criteriaText}
            {request.goalDescription ? ` · ${request.goalDescription}` : ''}
          </p>

          <div className="space-y-6">
            {matches.map((match, index) => (
              <MentorMatchCard
                key={match.mentor.id}
                match={match}
                onSkip={() => handleSkip(index)}
              />
            ))}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
              className="w-full py-3 text-sm font-semibold text-grey-7 hover:opacity-80 transition-opacity"
            >
              다시 찾기
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
