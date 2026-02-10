import apiClient from './apiClient'
import type {
  MentorSearchResponse,
  MentorProfileResponse,
  MentorRecommendationsResponse,
  MentorRecommendationCard,
  MentoringRequestListResponse,
  MentoringRequestResponse,
} from '@/types/mentoring-api'
import type {
  Mentor,
  MentorCategory,
  DayOfWeek,
  TimeOfDay,
  MeetingFormat,
} from '@/types/mentor'
import type { Person } from '@/types/network'

const BASE = '/mentoring'

/** Backend day enum -> frontend DayOfWeek (설문·프로필 공용) */
export const DAY_MAP: Record<string, DayOfWeek> = {
  MON: 'monday',
  TUE: 'tuesday',
  WED: 'wednesday',
  THU: 'thursday',
  FRI: 'friday',
  SAT: 'saturday',
  SUN: 'sunday',
}

/** Backend time_slot -> frontend TimeOfDay (설문·프로필 공용) */
export const TIME_SLOT_MAP: Record<string, TimeOfDay> = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  LATE_AFTERNOON: 'afternoon',
  EVENING: 'evening',
}

/** Backend method -> frontend MeetingFormat (설문·프로필 공용) */
export const METHOD_MAP: Record<string, MeetingFormat> = {
  ONLINE: 'zoom',
  OFFLINE: 'in_person',
  FLEXIBLE: 'any',
}

/** Backend MentorField -> frontend MentorCategory (설문·프로필 공용) */
export const FIELD_TO_CATEGORY: Record<string, MentorCategory> = {
  CAREER_EMPLOYMENT: 'career_job_search',
  ACADEMICS_STUDY: 'academic_excellence',
  ENTREPRENEURSHIP_LEADERSHIP: 'leadership_soft_skills',
  SELF_DEVELOPMENT_HOBBIES: 'personal_development',
  VOLUNTEERING_SOCIAL: 'volunteer_community_service',
  EMOTIONAL_COUNSELING: 'mental_health_wellness',
  INVESTMENT_FINANCE: 'financial_management',
}

const DEFAULT_CATEGORY: MentorCategory = 'career_job_search'

function mapProfileToMentor(profile: MentorProfileResponse): Mentor {
  const fields = profile.fields ?? []
  const primaryCategory =
    fields.length > 0 && FIELD_TO_CATEGORY[fields[0]]
      ? FIELD_TO_CATEGORY[fields[0]]
      : DEFAULT_CATEGORY

  const available_days = profile.available_days ?? []
  const days: DayOfWeek[] = available_days
    .map((d) => DAY_MAP[d])
    .filter(Boolean) as DayOfWeek[]
  const time_slots = profile.time_slots ?? []
  const timeOfDay: TimeOfDay[] = time_slots
    .map((t) => TIME_SLOT_MAP[t])
    .filter(Boolean) as TimeOfDay[]
  const methods = profile.methods ?? []
  const preferredFormats: MeetingFormat[] = methods
    .map((m) => METHOD_MAP[m])
    .filter(Boolean)
  if (preferredFormats.length === 0) preferredFormats.push('any')

  return {
    id: profile.user_id,
    name: profile.name,
    avatar: profile.avatar_url ?? undefined,
    type: 'professional',
    primaryCategory,
    secondaryCategories: (fields.slice(1) ?? [])
      .map((f) => FIELD_TO_CATEGORY[f])
      .filter(Boolean) as MentorCategory[],
    bio: profile.introduction ?? undefined,
    university: profile.affiliation ?? undefined,
    expertiseLevel: 'intermediate',
    availability: {
      days: days.length ? days : (['monday'] as DayOfWeek[]),
      timeOfDay: timeOfDay.length ? timeOfDay : (['afternoon'] as TimeOfDay[]),
      hoursPerWeek: 2,
      preferredFormats,
    },
    rating: 0,
    menteeCount: 0,
    reviewCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/** MentorSearchCard -> Person for MentorsSection list */
function mapSearchCardToPerson(card: {
  mentor_id: string
  name: string
  avatar_url: string | null
  introduction?: string | null
  affiliation?: string | null
  fields?: string[] | null
}): Person {
  const category =
    card.fields?.length && FIELD_TO_CATEGORY[card.fields[0]]
      ? FIELD_TO_CATEGORY[card.fields[0]]
      : undefined
  return {
    id: card.mentor_id,
    name: card.name,
    avatar: card.avatar_url ?? undefined,
    generation: '1기',
    scholarshipType: '글로벌',
    tags: card.fields ?? undefined,
    ...(card.affiliation && { university: card.affiliation }),
    ...(category && { tags: [category, ...(card.fields ?? [])] }),
  }
}

/**
 * 멘토링 API (plimate-server /api/v1/mentoring)
 */
export const MentoringService = {
  /**
   * GET /mentoring/mentors - 멘토 목록 (검색/필터)
   */
  getMentors: async (params?: {
    field?: string
    method?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<{ mentors: Person[]; total: number }> => {
    const { data } = await apiClient.get<MentorSearchResponse>(
      `${BASE}/mentors`,
      { params },
    )
    return {
      mentors: (data.mentors ?? []).map(mapSearchCardToPerson),
      total: data.total ?? 0,
    }
  },

  /**
   * GET /mentoring/mentors/{mentor_id} - 멘토 상세 프로필
   */
  getMentorById: async (mentorId: string): Promise<Mentor | null> => {
    try {
      const { data } = await apiClient.get<MentorProfileResponse>(
        `${BASE}/mentors/${mentorId}`,
      )
      return mapProfileToMentor(data)
    } catch {
      return null
    }
  },

  /**
   * GET /mentoring/recommendations - 설문 기반 멘토 추천
   */
  getRecommendations: async (params?: {
    limit?: number
    offset?: number
  }): Promise<{ recommendations: Person[]; total: number }> => {
    const { data } = await apiClient.get<MentorRecommendationsResponse>(
      `${BASE}/recommendations`,
      { params },
    )
    const mentors = (data.recommendations ?? []).map((rec) =>
      mapSearchCardToPerson({
        mentor_id: rec.mentor_id,
        name: rec.name,
        avatar_url: rec.avatar_url,
        introduction: rec.introduction,
        affiliation: rec.affiliation,
        fields: rec.expertise ?? undefined,
      }),
    )
    return { recommendations: mentors, total: data.total ?? 0 }
  },

  /**
   * GET /mentoring/recommendations - 원본 카드(점수 포함) 조회
   * matches 화면에서 match_score를 쓰기 위해 사용
   */
  getRecommendationCards: async (params?: {
    limit?: number
    offset?: number
  }): Promise<{ recommendations: MentorRecommendationCard[]; total: number }> => {
    const { data } = await apiClient.get<MentorRecommendationsResponse>(
      `${BASE}/recommendations`,
      { params },
    )
    return {
      recommendations: data.recommendations ?? [],
      total: data.total ?? 0,
    }
  },

  /**
   * POST /mentoring/requests - 멘토링 신청
   */
  createRequest: async (body: {
    mentor_id: string
    message?: string | null
  }): Promise<MentoringRequestResponse> => {
    const { data } = await apiClient.post<MentoringRequestResponse>(
      `${BASE}/requests`,
      body,
    )
    return data
  },

  /**
   * GET /mentoring/requests/sent - 내가 보낸 멘토링 요청 (나의 멘토링 내역)
   */
  getSentRequests: async (params?: {
    limit?: number
    offset?: number
  }): Promise<MentoringRequestListResponse> => {
    const { data } = await apiClient.get<MentoringRequestListResponse>(
      `${BASE}/requests/sent`,
      { params },
    )
    return data
  },

  /**
   * GET /mentoring/requests/received - 멘토가 받은 요청
   */
  getReceivedRequests: async (params?: {
    limit?: number
    offset?: number
  }): Promise<MentoringRequestListResponse> => {
    const { data } = await apiClient.get<MentoringRequestListResponse>(
      `${BASE}/requests/received`,
      { params },
    )
    return data
  },
}
