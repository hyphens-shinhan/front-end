/**
 * 멘토링 API 타입 (plimate-server /api/v1/mentoring 스키마와 정렬)
 */

export interface MentorSearchCard {
  mentor_id: string
  name: string
  avatar_url: string | null
  introduction: string | null
  affiliation: string | null
  expertise: string[] | null
  fields: string[] | null
}

export interface MentorSearchResponse {
  mentors: MentorSearchCard[]
  total: number
}

export interface MentorProfileResponse {
  user_id: string
  name: string
  avatar_url: string | null
  introduction: string | null
  affiliation: string | null
  expertise: string[] | null
  fields: string[] | null
  frequency: string[] | null
  available_days: string[] | null
  time_slots: string[] | null
  methods: string[] | null
  communication_styles: string[] | null
  mentoring_focuses: string[] | null
}

/** PATCH /mentoring/profile body */
export interface MentorProfileUpdate {
  introduction?: string | null
  affiliation?: string | null
  expertise?: string[] | null
  fields?: string[] | null
  frequency?: string[] | null
  available_days?: string[] | null
  time_slots?: string[] | null
  methods?: string[] | null
  communication_styles?: string[] | null
  mentoring_focuses?: string[] | null
}

export interface MentorRecommendationCard {
  mentor_id: string
  name: string
  avatar_url: string | null
  introduction?: string | null
  affiliation?: string | null
  expertise?: string[] | null
  match_score: number
  score_breakdown?: Record<string, number>
}

export interface MentorRecommendationsResponse {
  recommendations: MentorRecommendationCard[]
  total: number
}

export interface MentoringRequestCreateBody {
  mentor_id: string
  message?: string | null
}

/** 스펙 명칭 alias */
export type MentoringRequestCreate = MentoringRequestCreateBody

export interface RequestUserInfo {
  id: string
  name: string
  avatar_url: string | null
}

export type MentoringRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELED'

export interface MentoringRequestResponse {
  id: string
  mentee: RequestUserInfo
  mentor: RequestUserInfo
  message?: string | null
  status: MentoringRequestStatus
  created_at: string
  preferred_date?: string | null
  preferred_time?: string | null
  preferred_meeting_method?: string | null
  scheduled_at?: string | null
  meeting_method?: string | null
}

/** Body for PATCH /mentoring/requests/{id} (mentor sets/edits schedule) */
export interface MentoringRequestScheduleUpdate {
  scheduled_at?: string | null
  meeting_method?: string | null
}

export interface MentoringRequestListResponse {
  requests: MentoringRequestResponse[]
  total: number
}

/** GET /mentoring/stats - 멘토 대시보드 통계 (다가오는 미팅, 총 멘토링 시간, 응답률) */
export interface MentorStatsResponse {
  upcoming_meetings: number
  total_hours: number
  response_rate: number
}

// ========== Mentoring 설문조사 API (survey) ==========

export type MentorField =
  | 'CAREER_EMPLOYMENT'
  | 'ACADEMICS_STUDY'
  | 'ENTREPRENEURSHIP_LEADERSHIP'
  | 'SELF_DEVELOPMENT_HOBBIES'
  | 'VOLUNTEERING_SOCIAL'
  | 'EMOTIONAL_COUNSELING'
  | 'INVESTMENT_FINANCE'

export type MeetingFrequency = 'ONE_TIME' | 'MONTHLY' | 'LONG_TERM'

export type AvailableDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'LATE_AFTERNOON' | 'EVENING'

export type MeetingMethod = 'ONLINE' | 'OFFLINE' | 'FLEXIBLE'

export type SurveyCommunicationStyle =
  | 'DIRECT_CLEAR'
  | 'SOFT_SUPPORTIVE'
  | 'HORIZONTAL_COMFORTABLE'
  | 'EXPERIENCE_GUIDE'

export type MentoringFocus =
  | 'PRACTICE_ORIENTED'
  | 'ADVICE_COUNSELING'
  | 'INSIGHT_INSPIRATION'

export interface MentorMatchingSurveyCreate {
  fields: MentorField[]
  frequency: MeetingFrequency
  goal: string
  available_days: AvailableDay[]
  time_slots: TimeSlot[]
  methods: MeetingMethod[]
  communication_styles: SurveyCommunicationStyle[]
  mentoring_focuses: MentoringFocus[]
}

export interface MentorMatchingSurveyResponse {
  id: string
  user_id: string
  fields: MentorField[]
  frequency: MeetingFrequency
  goal: string
  available_days: AvailableDay[]
  time_slots: TimeSlot[]
  methods: MeetingMethod[]
  communication_styles: SurveyCommunicationStyle[]
  mentoring_focuses: MentoringFocus[]
  created_at: string
  updated_at: string
}
