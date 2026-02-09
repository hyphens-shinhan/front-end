'use client'

import { useRouter } from 'next/navigation'
import type { MentorMatch, DayOfWeek, TimeOfDay, MeetingFormat, MentorshipStyle, CommunicationStyle, WorkPace } from '@/types/mentor'
import { ROUTES } from '@/constants'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

const CATEGORY_LABELS: Record<string, string> = {
  career_job_search: '취업',
  academic_excellence: '학업',
  leadership_soft_skills: '리더십',
  entrepreneurship_innovation: '창업',
  mental_health_wellness: '정신 건강',
  financial_management: '재무',
  personal_development: '자기계발',
  volunteer_community_service: '봉사',
  specific_major_field: '전공',
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: '평일',
  tuesday: '평일',
  wednesday: '평일',
  thursday: '평일',
  friday: '평일',
  saturday: '주말',
  sunday: '주말',
}

const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: '아침',
  afternoon: '오후',
  evening: '저녁',
  late_night: '밤',
  flexible: '유연',
}

const FORMAT_LABELS: Record<MeetingFormat, string> = {
  zoom: '비대면',
  google_meet: '비대면',
  in_person: '대면',
  phone_call: '전화',
  any: '무관',
}

const STYLE_LABELS: Record<MentorshipStyle | CommunicationStyle | WorkPace, string> = {
  hands_on: '실습',
  advisory: '조언',
  inspirational: '영감',
  direct: '직설적',
  collaborative: '협업',
  supportive: '부드러운',
  fast_paced: '빠른',
  steady: '꾸준한',
  flexible: '유연한',
}

const MAX_TAGS = 5

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

function getMatchTags(match: MentorMatch): string[] {
  const { mentor, score } = match
  const tags: string[] = []

  tags.push(getCategoryLabel(mentor.primaryCategory))

  const days = mentor.availability.days
  const dayLabels = [...new Set(days.map((d) => DAY_LABELS[d]))]
  dayLabels.forEach((l) => {
    if (!tags.includes(l)) tags.push(l)
  })

  const times = mentor.availability.timeOfDay
  times.forEach((t) => tags.push(TIME_LABELS[t]))

  const formats = mentor.availability.preferredFormats
  const formatLabels = [...new Set(formats.map((f) => FORMAT_LABELS[f]))]
  formatLabels.forEach((l) => {
    if (!tags.includes(l)) tags.push(l)
  })

  const style = mentor.personalityTraits?.communicationStyle
  if (style && STYLE_LABELS[style]) tags.push(STYLE_LABELS[style])

  const mentorshipStyle = mentor.personalityTraits?.mentorshipStyle
  if (mentorshipStyle && STYLE_LABELS[mentorshipStyle]) tags.push(STYLE_LABELS[mentorshipStyle])
  const workPace = mentor.personalityTraits?.workPace
  if (workPace && STYLE_LABELS[workPace]) tags.push(STYLE_LABELS[workPace])

  score.reasons?.slice(0, 2).forEach((r) => {
    const value = r.includes(': ') ? r.split(': ')[1]?.trim() : r
    if (value && !tags.includes(value)) tags.push(value)
  })

  return tags
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
}

export default function MentorMatchCard({ match }: MentorMatchCardProps) {
  const router = useRouter()
  const { mentor, score } = match

  const handleOpenProfile = () => {
    router.push(`${ROUTES.MENTORS.DETAIL_PREFIX}${mentor.id}`)
  }

  const roleOrCategory = mentor.currentRole || getCategoryLabel(mentor.primaryCategory)
  const subtitle = `${roleOrCategory} • 서울`

  const avatarSrc = mentor.avatar || getFallbackAvatar(mentor.id)
  const tags = getMatchTags(match)
  const scorePercent = Math.min(score.total, 100)

  return (
    <article className={styles.card}>
      <div className={styles.headerRow}>
        <button
          type="button"
          onClick={handleOpenProfile}
          className={styles.headerButton}
        >
          <div className={styles.avatarWrap}>
            <img src={avatarSrc} alt="" className={styles.avatar} />
          </div>
          <div className={styles.headerText}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{mentor.name}</span>
              {mentor.type === 'ob' && (
                <span className={styles.obBadge} aria-hidden>
                  <Icon name="IconMBoldShieldTick" className="size-5 text-primary-secondaryroyal" />
                </span>
              )}
            </div>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <Icon name="IconLLineArrowRight" className={styles.chevron} />
        </button>
      </div>

      <div className={styles.matchSection}>
        <div className={styles.matchRow}>
          <span className={styles.matchLabel}>나와의 매칭 결과</span>
          <span className={styles.matchScore}>
            <span className={styles.scoreValue}>{score.total}</span>
            <span className={styles.scoreUnit}>%</span>
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.slice(0, MAX_TAGS).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {tags.length > MAX_TAGS && (
            <span className={styles.tagMore}>
              +{tags.length - MAX_TAGS}
            </span>
          )}
        </div>
      )}
    </article>
  )
}

const styles = {
  card: cn(
    'flex flex-col gap-4',
    'px-4 py-4',
  ),
  headerRow: 'w-full',
  headerButton: cn(
    'flex w-full items-center gap-4 text-left',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2 rounded-lg',
  ),
  avatarWrap: 'h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full bg-grey-2',
  avatar: 'h-full w-full object-cover',
  headerText: 'min-w-0 flex-1',
  nameRow: 'flex items-center gap-1',
  name: 'title-18 text-grey-11',
  obBadge: 'shrink-0',
  subtitle: 'body-7 text-grey-8 mt-0.5',
  chevron: 'shrink-0 text-grey-9',
  matchSection: 'flex flex-col gap-2.5',
  matchRow: 'flex items-center justify-between',
  matchLabel: 'body-7 text-grey-9',
  matchScore: 'text-right',
  scoreValue: 'title-18 text-grey-11',
  scoreUnit: 'body-7 text-grey-9 ml-0.5',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-grey-2',
  progressFill: cn(
    'h-full rounded-full transition-[width] duration-300',
    'bg-gradient-to-r from-primary-light to-[#6AA3FF]',
  ),
  tags: 'flex flex-wrap gap-2',
  tag: cn(
    'body-8 text-grey-9',
    'rounded-md bg-grey-1-1 px-1.5 py-0.5',
  ),
  tagMore: cn(
    'body-8 text-grey-8',
    'rounded-md bg-grey-2 px-1.5 py-0.5',
  ),
} as const
