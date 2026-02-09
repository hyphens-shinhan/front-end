/**
 * 유저 프로필 API 타입 정의 (서버 app/schemas/user.py 와 동기화)
 * Base: /api/v1/users
 */

/** 앱 내 사용자 역할 (역할 코드 → 라벨 매핑 시 이 객체 사용) */
export const AppRole = {
  YB: 'YB',
  YB_LEADER: 'YB_LEADER',
  OB: 'OB',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const

export type AppRole = (typeof AppRole)[keyof typeof AppRole]

/** 장학금 유형 (일반/국가유공자자녀/자립/로스쿨/교환학생/리더십 등) */
export const ScholarshipType = {
  GENERAL: 'GENERAL',
  VETERAN_CHILD: 'VETERAN_CHILD',
  SELF_RELIANCE: 'SELF_RELIANCE',
  LAW_SCHOOL: 'LAW_SCHOOL',
  EXCHANGE_STUDENT: 'EXCHANGE_STUDENT',
  LEADER_DEVELOPMENT: 'LEADER_DEVELOPMENT',
} as const

export type ScholarshipType =
  (typeof ScholarshipType)[keyof typeof ScholarshipType]

/**
 * 홈용 내 프로필 (GET /users/me)
 * - 메인/홈 화면 등에서 표시할 최소 정보
 */
export interface UserHomeProfile {
  /** 사용자 UUID */
  id: string
  /** 이름 */
  name: string
  /** 앱 역할 */
  role: AppRole
  /** 프로필 이미지 URL */
  avatar_url: string | null
  /** 소속 (단과대/학과 등) */
  affiliation: string | null
  /** 전공 */
  major: string | null
  /** 장학 유형 */
  scholarship_type: ScholarshipType | null
  /** 장학 기수 */
  scholarship_batch: number | null
}

/**
 * 내 상세 프로필 (GET /users/me/profile)
 * - 설정/프로필 편집 화면용 전체 필드
 */
export interface UserMyProfile {
  id: string
  /** 장학생 번호 */
  scholar_number: string
  name: string
  email: string
  role: AppRole
  avatar_url: string | null
  affiliation: string | null
  major: string | null
  scholarship_type: ScholarshipType | null
  scholarship_batch: number | null
  /** 한줄 소개 */
  bio: string | null
  /** 관심 분야 목록 */
  interests: string[] | null
  /** 취미 목록 */
  hobbies: string[] | null
  /** 지역/위치 (공개 설정에 따라 노출) */
  location: string | null
}

/**
 * 다른 사용자 공개 프로필 (GET /users/{user_id})
 * - 공개 설정에 따라 email, location 등 일부 필드가 null로 내려옴
 */
export interface UserPublicProfile {
  id: string
  name: string
  role: AppRole
  avatar_url: string | null
  email: string | null
  affiliation: string | null
  major: string | null
  scholarship_type: ScholarshipType | null
  scholarship_batch: number | null
  bio: string | null
  interests: string[] | null
  hobbies: string[] | null
  location: string | null
}

/**
 * 프로필 수정 요청 (PATCH /users/me/profile)
 * - 전송하는 필드만 갱신, 모두 optional
 */
export interface UserProfileUpdate {
  avatar_url?: string | null
  email?: string | null
  affiliation?: string | null
  major?: string | null
  bio?: string | null
  interests?: string[] | null
  hobbies?: string[] | null
  location?: string | null
  /** 위도 (위치 공개 시) */
  latitude?: number | null
  /** 경도 (위치 공개 시) */
  longitude?: number | null
}

/**
 * 프라이버시 설정 (GET /users/me/privacy)
 * - 각 항목별 공개 여부
 */
export interface UserPrivacySettings {
  /** 위치 공개 여부 */
  is_location_public: boolean
  /** 연락처(이메일 등) 공개 여부 */
  is_contact_public: boolean
  /** 장학 정보 공개 여부 */
  is_scholarship_public: boolean
  /** 팔로워 목록 공개 여부 */
  is_follower_public: boolean
}

/**
 * 프라이버시 수정 요청 (PATCH /users/me/privacy)
 * - 변경할 항목만 보내면 됨, 모두 optional
 */
export interface UserPrivacyUpdate {
  is_location_public?: boolean | null
  is_contact_public?: boolean | null
  is_scholarship_public?: boolean | null
  is_follower_public?: boolean | null
}

/**
 * 장학 유지 요건 요약 (GET /users/me/scholarship-eligibility)
 * - 홈화면 유지 심사 관련 요약 정보
 */
export interface ScholarshipEligibilityResponse {
  /** 기준 연도 */
  current_year: number
  /** 해당 연도 평균 학점 */
  gpa: number
  /** 총 이수 학점 */
  total_credits: number
  /** 학기별 breakdown (서버에서 내려주는 dict 배열) */
  semester_breakdown: Record<string, unknown>[]
  /** 봉사 시간 */
  volunteer_hours: number
  /** 해당 연도 필수 활동 개수 */
  mandatory_total: number
  /** 완료한 필수 활동 개수 */
  mandatory_completed: number
}
