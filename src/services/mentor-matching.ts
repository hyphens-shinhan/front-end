import type { MentorshipRequest, Mentor, MentorMatch } from '@/types/mentor'
import { calculateMatchScore } from '@/utils/mentor-scoring'
import { getActiveMentors, getMentorById } from '@/data/mock-mentors'

const DEFAULT_YB_PROFILE = {
  university: '서울대학교',
  major: '소프트웨어학과',
  cohortYear: '1기',
}

export async function findTopMentors(
  request: MentorshipRequest,
  ybProfile?: { university?: string; major?: string; cohortYear?: string },
  limit: number = 7
): Promise<MentorMatch[]> {
  const allMentors = getActiveMentors()
  const profile = ybProfile || DEFAULT_YB_PROFILE
  const selectedCategories = request.goalCategories || [request.goalCategory]
  const categoryFiltered = allMentors.filter((mentor) => {
    const hasPrimary = selectedCategories.some((cat) => mentor.primaryCategory === cat)
    const hasSecondary = selectedCategories.some((cat) =>
      mentor.secondaryCategories?.includes(cat)
    )
    return hasPrimary || hasSecondary
  })
  const mentorScores: MentorMatch[] = categoryFiltered.map((mentor) => {
    const score = calculateMatchScore(request, mentor, profile)
    return { mentor, score }
  })
  const qualified = mentorScores.filter((m) => m.score.total >= 40)
  qualified.sort((a, b) => b.score.total - a.score.total)
  return qualified.slice(0, limit)
}

export function getMentorByIdSync(mentorId: string): Mentor | null {
  return getMentorById(mentorId) ?? null
}

export async function getMentorMatch(
  mentorId: string,
  request: MentorshipRequest,
  ybProfile?: { university?: string; major?: string; cohortYear?: string }
): Promise<MentorMatch | null> {
  const mentor = getMentorById(mentorId) ?? null
  if (!mentor) return null
  const profile = ybProfile || DEFAULT_YB_PROFILE
  const score = calculateMatchScore(request, mentor, profile)
  return { mentor, score }
}

export function getMatchQualityLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: '완벽', color: '#10B981' }
  if (score >= 70) return { label: '훌륭', color: '#3B82F6' }
  if (score >= 60) return { label: '좋음', color: '#8B5CF6' }
  if (score >= 50) return { label: '보통', color: '#F59E0B' }
  return { label: '잠재적', color: '#6B7280' }
}

export function getMajorLabel(major: string): string {
  const labels: Record<string, string> = {
    '소프트웨어학과': '컴퓨터학과',
    'Computer Science': '컴퓨터학과',
    'Business Administration': '경영학',
    'Education': '교육학',
    'Psychology': '심리학',
    'Economics': '경제학',
  }
  return labels[major] || major
}
