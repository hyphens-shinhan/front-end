// ========== Club ==========

/** 소모임 카테고리 */
export type ClubCategory = 'GLOBAL' | 'VOLUNTEER' | 'STUDY'

/** 소모임 익명 설정 (공개/비공개/둘 다) */
export type ClubAnonymity = 'PUBLIC' | 'PRIVATE' | 'BOTH'

/** 소모임 생성 요청 데이터 */
export interface ClubCreate {
  name: string
  description: string
  /** 이미지(커버) URL (선택, 업로드 후 전달) */
  image_url?: string | null
  category: ClubCategory
  anonymity: ClubAnonymity
}

/** 소모임 수정 요청 데이터 */
export interface ClubUpdate {
  name?: string | null
  description?: string | null
  image_url?: string | null
  category?: ClubCategory | null
  anonymity?: ClubAnonymity | null
}

/**
 * 소모임 내 내 프로필 (가입 시 Request Body)
 * - anonymity: PUBLIC=실명만, PRIVATE=익명만, BOTH=둘 다. 익명일 때 nickname 필수
 */
export interface UserClubProfile {
  is_anonymous?: boolean | null
  nickname?: string | null
  avatar_url?: string | null
}

/** 소모임 응답 */
export interface ClubResponse {
  id: string
  creator_id: string
  name: string
  description: string
  image_url: string | null
  category: ClubCategory
  anonymity: ClubAnonymity
  member_count: number
  created_at: string
  is_member: boolean
  user_profile: UserClubProfile | null
  recent_member_images: string[] | null
}

/** 소모임 목록 응답 */
export interface ClubListResponse {
  clubs: ClubResponse[]
  total: number
}

/** 소모임 목록 조회 쿼리 (GET /clubs) */
export interface ClubListQuery {
  category?: ClubCategory
  limit?: number
  offset?: number
}

// ========== Gallery ==========

/** 갤러리 이미지 업로드 요청 데이터 */
export interface GalleryImageCreate {
  /** 이미지 URL */
  image_url: string
  /** 캡션 (선택) */
  caption?: string | null
}

/** 갤러리 이미지 응답 */
export interface GalleryImageResponse {
  id: string
  /** 소속 소모임 ID */
  club_id: string
  /** 이미지 URL */
  image_url: string
  /** 캡션 */
  caption: string | null
  /** 업로드한 사용자 ID */
  uploaded_by: string | null
  /** 업로드 일시 (ISO 8601) */
  created_at: string
}

/** 갤러리 이미지 목록 응답 */
export interface GalleryListResponse {
  images: GalleryImageResponse[]
  total: number
}

/** 갤러리 목록 조회 쿼리 (GET /clubs/{club_id}/gallery) */
export interface GalleryListQuery {
  limit?: number
  offset?: number
}

// ========== API 응답 메시지 ==========

/** 소모임 가입 성공 응답 */
export interface ClubJoinResponse {
  message: 'Successfully joined the club'
}

/** 소모임 탈퇴 성공 응답 */
export interface ClubLeaveResponse {
  message: 'Successfully left the club'
}

/** 갤러리 이미지 삭제 성공 응답 */
export interface GalleryDeleteResponse {
  message: 'Gallery image deleted'
}

// ========== Members ==========

/** 소모임 멤버 응답 (GET /clubs/{club_id}/members) */
export interface ClubMemberResponse {
  id: string
  name: string
  avatar_url: string | null
}

/** 소모임 멤버 목록 응답 */
export interface ClubMemberListResponse {
  members: ClubMemberResponse[]
  total: number
}

// ========== Random Nickname ==========

/** 랜덤 닉네임 생성 응답 */
export interface RandomNicknameResponse {
  /** 랜덤 닉네임 (예: "행복한 쏠", "귀여운 몰리" 등 형용사 + 명사 조합) */
  nickname: string
  /** 익명 아바타 이미지 URL (예: "https://...supabase.co/storage/.../anony_1.png") */
  avatar_url: string
}
