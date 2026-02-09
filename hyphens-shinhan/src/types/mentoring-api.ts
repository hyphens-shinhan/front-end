/**
 * 멘토링 API 타입 (plimate-server /api/v1/mentoring 스키마와 정렬)
 */

export interface MentorSearchCard {
  mentor_id: string
  name: string
  avatar_url: string | null
  introduction?: string | null
  affiliation?: string | null
  expertise?: string[] | null
  fields?: string[] | null
}

export interface MentorSearchResponse {
  mentors: MentorSearchCard[]
  total: number
}

export interface MentorProfileResponse {
  user_id: string
  name: string
  avatar_url: string | null
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
}

export interface MentoringRequestListResponse {
  requests: MentoringRequestResponse[]
  total: number
}
