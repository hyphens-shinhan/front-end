import apiClient from './apiClient'
import {
  FIELD_TO_CATEGORY,
  DAY_MAP,
  TIME_SLOT_MAP,
  METHOD_MAP,
} from './mentoring'
import type { MentorshipRequest } from '@/types/mentor'
import type {
  MentorMatchingSurveyCreate,
  MentorMatchingSurveyResponse,
  MentorField,
  MeetingFrequency,
  AvailableDay,
  TimeSlot,
  MeetingMethod,
  SurveyCommunicationStyle,
  MentoringFocus,
} from '@/types/mentoring-api'
import type {
  MentorCategory,
  GoalTimeline,
  DayOfWeek,
  TimeOfDay,
  MeetingFormat,
  CommunicationStyle,
  MentorshipStyle,
} from '@/types/mentor'

const BASE = '/mentoring'

const CATEGORY_TO_FIELD: Record<MentorCategory, MentorField> = {
  career_job_search: 'CAREER_EMPLOYMENT',
  academic_excellence: 'ACADEMICS_STUDY',
  specific_major_field: 'ACADEMICS_STUDY',
  leadership_soft_skills: 'ENTREPRENEURSHIP_LEADERSHIP',
  entrepreneurship_innovation: 'ENTREPRENEURSHIP_LEADERSHIP',
  mental_health_wellness: 'EMOTIONAL_COUNSELING',
  financial_management: 'INVESTMENT_FINANCE',
  personal_development: 'SELF_DEVELOPMENT_HOBBIES',
  volunteer_community_service: 'VOLUNTEERING_SOCIAL',
}

const TIMELINE_TO_FREQUENCY: Record<GoalTimeline, MeetingFrequency> = {
  short_term: 'ONE_TIME',
  medium_term: 'MONTHLY',
  long_term: 'LONG_TERM',
}

const DAY_TO_AVAILABLE: Record<DayOfWeek, AvailableDay> = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
}

const TIME_TO_SLOT: Record<TimeOfDay, TimeSlot[]> = {
  morning: ['MORNING'],
  afternoon: ['AFTERNOON'],
  evening: ['EVENING'],
  late_night: ['EVENING'],
  flexible: ['MORNING', 'AFTERNOON', 'LATE_AFTERNOON', 'EVENING'],
}

function formatToMethod(f: MeetingFormat): MeetingMethod {
  if (f === 'zoom' || f === 'google_meet') return 'ONLINE'
  if (f === 'in_person') return 'OFFLINE'
  return 'FLEXIBLE'
}

const COMM_STYLE_TO_SURVEY: Record<
  CommunicationStyle,
  SurveyCommunicationStyle
> = {
  direct: 'DIRECT_CLEAR',
  supportive: 'SOFT_SUPPORTIVE',
  collaborative: 'HORIZONTAL_COMFORTABLE',
}

const MENTORSHIP_STYLE_TO_FOCUS: Record<MentorshipStyle, MentoringFocus> = {
  hands_on: 'PRACTICE_ORIENTED',
  advisory: 'ADVICE_COUNSELING',
  inspirational: 'INSIGHT_INSPIRATION',
}

/**
 * 설문 제출용: MentorshipRequest -> API body
 */
export function toSurveyCreate(
  request: MentorshipRequest,
): MentorMatchingSurveyCreate {
  const categories = request.goalCategories ?? [request.goalCategory]
  const fields = [
    ...new Set(categories.map((c) => CATEGORY_TO_FIELD[c]).filter(Boolean)),
  ] as MentorField[]
  const frequency = TIMELINE_TO_FREQUENCY[request.goalTimeline]
  const goal = (request.goalDescription ?? '').trim().slice(0, 1000) || ' '
  const available_days = (request.availability.days ?? [])
    .map((d) => DAY_TO_AVAILABLE[d])
    .filter(Boolean)
  const timeSlotsSet = new Set<TimeSlot>()
  for (const t of request.availability.timeOfDay ?? []) {
    TIME_TO_SLOT[t].forEach((s) => timeSlotsSet.add(s))
  }
  const time_slots = Array.from(timeSlotsSet)
  if (time_slots.length === 0) time_slots.push('AFTERNOON')

  const methodsSet = new Set<MeetingMethod>()
  for (const f of request.availability.preferredFormats ?? []) {
    methodsSet.add(formatToMethod(f))
  }
  const methods = Array.from(methodsSet)
  if (methods.length === 0) methods.push('FLEXIBLE')

  let communication_styles: SurveyCommunicationStyle[] = []
  if (request.personalityPreferences?.communicationStyle) {
    communication_styles = [
      COMM_STYLE_TO_SURVEY[request.personalityPreferences.communicationStyle],
    ]
  }
  if (communication_styles.length === 0) communication_styles = ['DIRECT_CLEAR']

  let mentoring_focuses: MentoringFocus[] = []
  if (request.personalityPreferences?.mentorshipStyle) {
    mentoring_focuses = [
      MENTORSHIP_STYLE_TO_FOCUS[request.personalityPreferences.mentorshipStyle],
    ]
  }
  if (mentoring_focuses.length === 0) mentoring_focuses = ['PRACTICE_ORIENTED']

  return {
    fields: fields.length ? fields : ['CAREER_EMPLOYMENT'],
    frequency,
    goal,
    available_days: available_days.length ? available_days : ['MON'],
    time_slots,
    methods,
    communication_styles,
    mentoring_focuses,
  }
}

// ---------- API -> Frontend (내 설문 조회 후 폼 초기값) ----------
// FIELD_TO_CATEGORY, DAY_MAP, TIME_SLOT_MAP, METHOD_MAP 는 mentoring.ts 에서 import

const FREQUENCY_TO_TIMELINE: Record<string, GoalTimeline> = {
  ONE_TIME: 'short_term',
  MONTHLY: 'medium_term',
  LONG_TERM: 'long_term',
}

const SURVEY_TO_COMM_STYLE: Record<string, CommunicationStyle> = {
  DIRECT_CLEAR: 'direct',
  SOFT_SUPPORTIVE: 'supportive',
  HORIZONTAL_COMFORTABLE: 'collaborative',
  EXPERIENCE_GUIDE: 'direct',
}

const FOCUS_TO_MENTORSHIP_STYLE: Record<string, MentorshipStyle> = {
  PRACTICE_ORIENTED: 'hands_on',
  ADVICE_COUNSELING: 'advisory',
  INSIGHT_INSPIRATION: 'inspirational',
}

/**
 * 내 설문 조회 응답 -> 설문 폼 initialData
 */
export function fromSurveyResponse(
  res: MentorMatchingSurveyResponse,
): Partial<MentorshipRequest> {
  const goalCategories = res.fields
    .map((f) => FIELD_TO_CATEGORY[f])
    .filter(Boolean) as MentorCategory[]
  const goalCategory = goalCategories[0] ?? 'career_job_search'
  const days = res.available_days
    .map((d) => DAY_MAP[d])
    .filter(Boolean) as DayOfWeek[]
  const timeOfDay = [
    ...new Set(res.time_slots.map((t) => TIME_SLOT_MAP[t]).filter(Boolean)),
  ] as TimeOfDay[]
  const preferredFormats = res.methods
    .map((m) => METHOD_MAP[m])
    .filter(Boolean) as MeetingFormat[]
  const communicationStyle = res.communication_styles[0]
    ? SURVEY_TO_COMM_STYLE[res.communication_styles[0]]
    : undefined
  const mentorshipStyle = res.mentoring_focuses[0]
    ? FOCUS_TO_MENTORSHIP_STYLE[res.mentoring_focuses[0]]
    : undefined

  return {
    goalCategory,
    goalCategories: goalCategories.length ? goalCategories : undefined,
    goalTimeline: FREQUENCY_TO_TIMELINE[res.frequency] ?? 'medium_term',
    goalDescription: res.goal?.trim() || undefined,
    availability: {
      days: days.length ? days : [],
      timeOfDay: timeOfDay.length ? timeOfDay : [],
      preferredFormats: preferredFormats.length ? preferredFormats : ['any'],
    },
    personalityPreferences:
      communicationStyle || mentorshipStyle
        ? { communicationStyle, mentorshipStyle }
        : undefined,
  }
}

// ---------- API 호출 ----------

/**
 * GET /mentoring/survey/me - 내 최신 설문 조회 (없으면 404)
 */
export async function getMySurvey(): Promise<MentorMatchingSurveyResponse | null> {
  try {
    const { data } = await apiClient.get<MentorMatchingSurveyResponse>(
      `${BASE}/survey/me`,
    )
    return data
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status === 404) return null
    throw err
  }
}

/**
 * POST /mentoring/survey - 설문 최초 제출
 */
export async function submitSurvey(
  body: MentorMatchingSurveyCreate,
): Promise<MentorMatchingSurveyResponse> {
  const { data } = await apiClient.post<MentorMatchingSurveyResponse>(
    `${BASE}/survey`,
    body,
  )
  return data
}

/**
 * PUT /mentoring/survey/me - 설문 재작성(재제출) 시 새 레코드로 저장
 */
export async function updateMySurvey(
  body: MentorMatchingSurveyCreate,
): Promise<MentorMatchingSurveyResponse> {
  const { data } = await apiClient.put<MentorMatchingSurveyResponse>(
    `${BASE}/survey/me`,
    body,
  )
  return data
}
