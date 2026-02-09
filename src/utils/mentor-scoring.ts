import type {
  Mentor,
  MentorshipRequest,
  MatchScore,
  MentorCategory,
} from '@/types/mentor'

function getCategoryLabel(category: MentorCategory): string {
  const labels: Record<MentorCategory, string> = {
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
  return labels[category] || category
}

export function calculateCategoryScore(
  request: MentorshipRequest,
  mentor: Mentor
): { score: number; reason?: string } {
  const selectedCategories = request.goalCategories || [request.goalCategory]
  for (const category of selectedCategories) {
    if (mentor.primaryCategory === category) {
      return { score: 40, reason: `완벽한 분야 매칭: ${getCategoryLabel(category)}` }
    }
  }
  for (const category of selectedCategories) {
    if (mentor.secondaryCategories?.includes(category)) {
      return { score: 20, reason: `보조 분야 매칭: ${getCategoryLabel(category)}` }
    }
  }
  return { score: 0 }
}

export function calculateGoalAlignmentScore(
  request: MentorshipRequest,
  mentor: Mentor
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  const levelOrder: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }
  const mentorLevel = levelOrder[mentor.expertiseLevel] || 0
  const requestLevel = levelOrder[request.goalLevel] || 0
  if (mentorLevel >= requestLevel) {
    score += 10
    reasons.push(`전문성 수준 일치: ${getExpertiseLevelLabel(mentor.expertiseLevel)}`)
  }
  score += 15
  reasons.push(`목표 기간 일치: ${getTimelineLabel(request.goalTimeline)}`)
  return { score, reasons }
}

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    short_term: '단기 (3개월 이내)',
    medium_term: '중기 (6-12개월)',
    long_term: '장기 (1-2년)',
  }
  return labels[timeline] || timeline
}

function getExpertiseLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
  }
  return labels[level] || level
}

export function calculateAvailabilityScore(
  request: MentorshipRequest,
  mentor: Mentor
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  const dayOverlap = request.availability.days.filter((day) =>
    mentor.availability.days.includes(day)
  )
  const timeOverlap = request.availability.timeOfDay.filter((time) =>
    mentor.availability.timeOfDay.includes(time)
  )
  if (dayOverlap.length > 0 && timeOverlap.length > 0) {
    score += 15
    reasons.push(`가능한 시간 일치: ${dayOverlap.length}일, ${timeOverlap.length}개 시간대`)
  } else if (dayOverlap.length > 0 || timeOverlap.length > 0) {
    score += 8
    reasons.push('부분적인 시간 일치')
  }
  const formatOverlap = request.availability.preferredFormats.filter((format) =>
    mentor.availability.preferredFormats.includes(format)
  )
  if (formatOverlap.length > 0) {
    score += 5
    reasons.push(`선호하는 만남 방식 일치: ${getFormatLabel(formatOverlap[0])}`)
  }
  return { score, reasons }
}

function getFormatLabel(format: string): string {
  const labels: Record<string, string> = {
    zoom: 'Zoom',
    google_meet: 'Google Meet',
    in_person: '대면',
    phone_call: '전화',
    any: '상관없음',
  }
  return labels[format] || format
}

export function calculatePersonalityScore(
  request: MentorshipRequest,
  mentor: Mentor
): { score: number; reasons: string[] } {
  if (!request.personalityPreferences || !mentor.personalityTraits) {
    return { score: 5, reasons: ['성격 선호도 미지정'] }
  }
  let score = 0
  const reasons: string[] = []
  const requestPrefs = request.personalityPreferences
  const mentorTraits = mentor.personalityTraits
  if (requestPrefs.communicationStyle && mentorTraits.communicationStyle) {
    if (requestPrefs.communicationStyle === mentorTraits.communicationStyle) {
      score += 3
      reasons.push(
        `커뮤니케이션 스타일 일치: ${getCommunicationStyleLabel(requestPrefs.communicationStyle)}`
      )
    }
  }
  if (requestPrefs.workPace && mentorTraits.workPace) {
    if (requestPrefs.workPace === mentorTraits.workPace) {
      score += 3
      reasons.push(`작업 속도 일치: ${getWorkPaceLabel(requestPrefs.workPace)}`)
    }
  }
  if (requestPrefs.mentorshipStyle && mentorTraits.mentorshipStyle) {
    if (requestPrefs.mentorshipStyle === mentorTraits.mentorshipStyle) {
      score += 4
      reasons.push(
        `멘토링 스타일 일치: ${getMentorshipStyleLabel(requestPrefs.mentorshipStyle)}`
      )
    }
  }
  if (score === 0) {
    score = 5
    reasons.push('중립적인 성격 적합도')
  }
  return { score, reasons }
}

function getCommunicationStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    direct: '직설적이고 명확한',
    collaborative: '협력적이고 토론 중심의',
    supportive: '지지적이고 격려하는',
  }
  return labels[style] || style
}

function getWorkPaceLabel(pace: string): string {
  const labels: Record<string, string> = {
    fast_paced: '빠르고 실행 중심의',
    steady: '안정적이고 체계적인',
    flexible: '유연하고 적응적인',
  }
  return labels[pace] || pace
}

function getMentorshipStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    hands_on: '실습 중심의',
    advisory: '조언 중심의',
    inspirational: '영감을 주는',
  }
  return labels[style] || style
}

export function calculateBonusScore(
  request: MentorshipRequest,
  mentor: Mentor,
  ybProfile?: { university?: string; major?: string; cohortYear?: string }
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  if (!ybProfile) return { score: 0, reasons: [] }
  if (
    ybProfile.university &&
    mentor.university &&
    ybProfile.university === mentor.university
  ) {
    score += 2
    reasons.push(`같은 대학교: ${mentor.university}`)
  }
  if (ybProfile.major && mentor.major && ybProfile.major === mentor.major) {
    score += 2
    reasons.push(`같은 전공: ${mentor.major}`)
  }
  if (
    ybProfile.cohortYear &&
    mentor.cohortYear &&
    ybProfile.cohortYear === mentor.cohortYear
  ) {
    score += 1
    reasons.push(`같은 기수: ${mentor.cohortYear}`)
  }
  if (mentor.type === 'professional' && score < 5) {
    score = Math.min(score + 3, 5)
    reasons.push('재단 지원 전문 멘토')
  }
  score = Math.min(score, 5)
  return { score, reasons }
}

export function calculateMatchScore(
  request: MentorshipRequest,
  mentor: Mentor,
  ybProfile?: { university?: string; major?: string; cohortYear?: string }
): MatchScore {
  const category = calculateCategoryScore(request, mentor)
  const goalAlignment = calculateGoalAlignmentScore(request, mentor)
  const availability = calculateAvailabilityScore(request, mentor)
  const personality = calculatePersonalityScore(request, mentor)
  const bonus = calculateBonusScore(request, mentor, ybProfile)
  const total =
    category.score +
    goalAlignment.score +
    availability.score +
    personality.score +
    bonus.score
  const reasons = [
    ...(category.reason ? [category.reason] : []),
    ...goalAlignment.reasons,
    ...availability.reasons,
    ...personality.reasons,
    ...bonus.reasons,
  ]
  return {
    total,
    category: category.score,
    goalAlignment: goalAlignment.score,
    availability: availability.score,
    personality: personality.score,
    bonus: bonus.score,
    reasons,
  }
}
