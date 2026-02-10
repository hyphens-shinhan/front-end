/** 멘토 매칭 시스템 타입 */

export type MentorType = 'ob' | 'professional'

export type MentorCategory =
  | 'career_job_search'
  | 'academic_excellence'
  | 'leadership_soft_skills'
  | 'entrepreneurship_innovation'
  | 'mental_health_wellness'
  | 'financial_management'
  | 'personal_development'
  | 'volunteer_community_service'
  | 'specific_major_field'

export type GoalTimeline = 'short_term' | 'medium_term' | 'long_term'
export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CommunicationStyle = 'direct' | 'collaborative' | 'supportive'
export type WorkPace = 'fast_paced' | 'steady' | 'flexible'
export type MentorshipStyle = 'hands_on' | 'advisory' | 'inspirational'

export type MeetingFormat =
  | 'zoom'
  | 'google_meet'
  | 'in_person'
  | 'phone_call'
  | 'any'

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
export type TimeOfDay =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'late_night'
  | 'flexible'

export interface MentorAvailability {
  days: DayOfWeek[]
  timeOfDay: TimeOfDay[]
  hoursPerWeek: number
  preferredFormats: MeetingFormat[]
  timezone?: string
}

export interface PersonalityTraits {
  /** 단일 선택(레거시) */
  communicationStyle?: CommunicationStyle
  /** 복수 선택(신규) */
  communicationStyles?: CommunicationStyle[]
  workPace?: WorkPace
  /** 단일 선택(레거시) */
  mentorshipStyle?: MentorshipStyle
  /** 복수 선택(신규) */
  mentorshipStyles?: MentorshipStyle[]
}

export interface Mentor {
  id: string
  name: string
  avatar?: string
  type: MentorType
  email?: string
  university?: string
  major?: string
  cohortYear?: string
  /** Short location label for tag (e.g. "서울") */
  location?: string
  /** Full address for profile card (e.g. "서울시 강남구 역삼로21") */
  address?: string
  bio?: string
  currentRole?: string
  company?: string
  primaryCategory: MentorCategory
  secondaryCategories?: MentorCategory[]
  expertiseLevel: ExpertiseLevel
  specificField?: string
  availability: MentorAvailability
  personalityTraits?: PersonalityTraits
  rating: number
  menteeCount: number
  reviewCount: number
  status: 'active' | 'inactive'
  badges?: MentorBadge[]
  experience?: string[]
  achievements?: string[]
  createdAt: string
  updatedAt: string
}

export interface MentorBadge {
  id: string
  name: string
  description: string
  icon?: string
  earnedAt: string
}

export interface MentorshipRequest {
  id?: string
  ybId: string
  goalCategory: MentorCategory
  goalCategories?: MentorCategory[]
  goalTimeline: GoalTimeline
  goalDescription?: string
  goalLevel: ExpertiseLevel
  availability: {
    days: DayOfWeek[]
    timeOfDay: TimeOfDay[]
    preferredFormats: MeetingFormat[]
  }
  personalityPreferences?: PersonalityTraits
  createdAt?: string
}

export interface MatchScore {
  total: number
  category: number
  goalAlignment: number
  availability: number
  personality: number
  bonus: number
  reasons: string[]
}

export interface MentorMatch {
  mentor: Mentor
  score: MatchScore
}

export interface MentorRequestItem {
  id: string
  mentorId: string
  mentor?: Mentor
  date: string
  time: string
  format: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  createdAt: string
}
