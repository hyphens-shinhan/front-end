'use client'

import { useRouter } from 'next/navigation'
import type { MentorMatch } from '@/types/mentor'
import { getMajorLabel } from '@/services/mentor-matching'
import { ROUTES } from '@/constants'
import MatchScoreBar from './MatchScoreBar'
import MatchReasons from './MatchReasons'
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

const FALLBACK_AVATARS = [
  '/assets/images/male1.png',
  '/assets/images/male2.png',
  '/assets/images/woman1.png',
  '/assets/images/woman2.png',
] as const

function getFallbackAvatar(mentorId: string): string {
  const index =
    mentorId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    FALLBACK_AVATARS.length
  return FALLBACK_AVATARS[index]
}

interface MentorMatchCardProps {
  match: MentorMatch
  onSkip?: () => void
}

export default function MentorMatchCard({ match, onSkip }: MentorMatchCardProps) {
  const router = useRouter()
  const { mentor, score } = match

  const handleViewProfile = () => {
    router.push(`${ROUTES.MENTORS.DETAIL_PREFIX}${mentor.id}`)
  }

  const metaParts = [
    mentor.university,
    mentor.major && getMajorLabel(mentor.major),
    mentor.cohortYear,
  ].filter(Boolean)

  const avatarSrc = mentor.avatar || getFallbackAvatar(mentor.id)

  return (
    <article className="pt-6 pb-6 border-b border-grey-2 last:border-b-0">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-grey-3 shrink-0 overflow-hidden">
          <img
            src={avatarSrc}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[16px] font-semibold text-grey-11 tracking-[-0.02em]">
              {mentor.name}
            </h2>
            <span className="text-[12px] text-grey-7">
              {mentor.type === 'professional' ? '전문' : 'OB'}
            </span>
          </div>
          {metaParts.length > 0 && (
            <p className="text-[13px] text-grey-7 truncate">
              {metaParts.join(' · ')}
            </p>
          )}
          <p className="text-[12px] text-grey-6 mt-0.5">
            {getCategoryLabel(mentor.primaryCategory)}
            {mentor.menteeCount >= 0 && ` · 멘티 ${mentor.menteeCount}명`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <MatchScoreBar score={score} />
      </div>

      {score.reasons && score.reasons.length > 0 && (
        <div className="mb-5">
          <MatchReasons reasons={score.reasons} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleViewProfile}
          className={cn(
            'w-full min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg',
            'hover:opacity-90 transition-opacity'
          )}
        >
          프로필 보기
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2.5 text-sm font-semibold text-grey-7 hover:opacity-80 transition-opacity"
          >
            건너뛰기
          </button>
        )}
      </div>
    </article>
  )
}
