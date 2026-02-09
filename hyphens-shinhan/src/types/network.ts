/**
 * 네트워크(추천/팔로잉/주변 사람) 관련 타입
 * API 타입은 plimate-server /api/v1/networking 스키마와 정렬
 */

/** API: GET /networking/recommendations, /friends, /nearby 응답용 */
export interface NetworkingUserCard {
  id: string
  name: string
  avatar_url: string | null
  affiliation?: string | null
}

export interface NearbyUserCard extends NetworkingUserCard {
  latitude: number
  longitude: number
  distance_km: number
}

export interface RecommendedUserCard extends NetworkingUserCard {
  mutual_friends_count: number
  mutual_friends?: string[] | null
  mutual_friends_avatars?: string[] | null
}

export interface FriendCard extends NetworkingUserCard {
  role?: string | null
  scholarship_batch?: number | null
  connected_at: string
}

export interface NearbyUsersResponse {
  users: NearbyUserCard[]
  total: number
  center_lat: number
  center_lng: number
  radius_km: number
}

export interface RecommendationsResponse {
  users: RecommendedUserCard[]
  total: number
}

export interface MyFriendsResponse {
  friends: FriendCard[]
  total: number
}

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
