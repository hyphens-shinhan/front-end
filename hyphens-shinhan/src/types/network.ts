/** 네트워크(추천/팔로잉/주변 사람) 관련 타입 */

export type Generation =
  | '1기'
  | '2기'
  | '3기'
  | '4기'
  | '5기'
  | '6기'
  | '7기'
  | '8기'
  | '9기'
  | '10기'
export type ScholarshipType = '글로벌' | '리더십' | '창의' | '봉사' | '기타'

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

/** 멘토 목록에서 표시할 역할 (YB · n기 / 멘토 · n기) */
export type MentorListRole = 'YB' | 'MENTOR'

export interface Person {
  id: string
  name: string
  avatar?: string
  bio?: string
  generation: Generation
  scholarshipType: ScholarshipType
  university?: string
  currentRole?: string
  company?: string
  location?: Location
  distance?: number
  isFollowing?: boolean
  mutualConnections?: number
  tags?: string[]
  interests?: string[]
  /** 멘토 탭에서만 사용: YB · n기 vs 멘토 · n기 */
  mentorListRole?: MentorListRole
}
