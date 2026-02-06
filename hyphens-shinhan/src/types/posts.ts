// MARK: - 커뮤니티 탭 타입 정의

/**
 * 게시글 종류
 */
export enum PostType {
  /** 일반 피드 게시물 */
  FEED = 'FEED',
  /** 공지사항 게시물 */
  NOTICE = 'NOTICE',
  /** 이벤트/행사 게시물 */
  EVENT = 'EVENT',
}

/**
 * 이벤트 진행 상태
 */
export enum EventStatus {
  /** 예정됨 */
  SCHEDULED = 'SCHEDULED',
  /** 모집 중 / 진행 중 */
  OPEN = 'OPEN',
  /** 종료됨 */
  CLOSED = 'CLOSED',
}

/** 신청 기간 기준 상태 (API에서 반환) */
export type ApplicationStatus = 'UPCOMING' | 'OPEN' | 'CLOSED'

/**
 * 게시글 작성자 정보
 */
export interface PostAuthor {
  /** 작성자 고유 ID (UUID) */
  id: string
  /** 작성자 이름/닉네임 */
  name: string
  /** 프로필 이미지 URL */
  avatar_url: string | null
  /** 현재 사용자가 이 작성자를 팔로우 중인지 여부 */
  is_following: boolean
}

/**
 * 모든 게시글 응답의 공통 필드
 */
interface BasePostResponse {
  /** 게시글 고유 ID (UUID) */
  id: string
  /** 생성 일시 (ISO 8601 형식) */
  created_at: string
  /** 좋아요 수 */
  like_count: number
  /** 현재 사용자가 좋아요를 눌렀는지 여부 */
  is_liked: boolean
  /** 첨부된 이미지 URL 목록 */
  image_urls?: string[] | null
}

/**
 * 피드(FEED) 게시글 응답
 */
export interface FeedPostResponse extends BasePostResponse {
  /** 게시글 타입: FEED */
  type: PostType.FEED
  /** 게시글 본문 내용 */
  content: string
  /** 익명 게시글 여부 */
  is_anonymous: boolean
  /** 스크랩 수 */
  scrap_count: number
  /** 댓글 수 */
  comment_count: number
  /** 현재 사용자가 스크랩했는지 여부 */
  is_scrapped: boolean
  /** 작성자 정보 (익명일 경우 null) */
  author: PostAuthor | null
}

/**
 * 공지사항(NOTICE) 게시글 응답
 */
export interface NoticePostResponse extends BasePostResponse {
  /** 게시글 타입: NOTICE */
  type: PostType.NOTICE
  /** 공지사항 제목 */
  title: string
  /** 공지사항 본문 내용 */
  content: string
  /** 상단 고정 여부 */
  is_pinned: boolean
  /** 조회수 */
  view_count: number
  /** 첨부 파일 URL 목록 */
  file_urls?: string[] | null
  // author 필드가 스키마에서 제외됨
}

/**
 * 이벤트(EVENT) 게시글 응답
 */
export interface EventPostResponse extends BasePostResponse {
  /** 게시글 타입: EVENT */
  type: PostType.EVENT
  /** 이벤트 제목 */
  title: string
  /** 이벤트 상세 내용 */
  content: string
  /** 신청 시작 일시 (ISO 8601) */
  application_start: string | null
  /** 신청 종료 일시 (ISO 8601) */
  application_end: string | null
  /** 이벤트 시작 일시 (ISO 8601) */
  event_start: string
  /** 이벤트 종료 일시 (ISO 8601) */
  event_end: string
  /** 이벤트 장소 */
  event_location: string
  /** 필수 참여 여부 */
  is_mandatory: boolean
  /** 현재 참여자 수 */
  participants_count: number
  /** 댓글 수 */
  comment_count: number
  /** 현재 사용자 이벤트 신청 여부 */
  is_applied: boolean
  /** 이벤트 진행 상태 */
  event_status: EventStatus
  /** 신청 기간 기준 상태 (API에서 반환) */
  application_status: ApplicationStatus
  /** 이벤트 카테고리 */
  event_category: string | null
  /** 최대 참여 가능 인원 */
  max_participants: number | null
  /** 첨부 파일 URL 목록 */
  file_urls: string[] | null
  /** 첨부 이미지 URL 목록 */
  image_urls: string[] | null
}

/**
 * 게시글 응답 유니온 타입 (타입 가드와 함께 사용 권장)
 */
export type PostResponse =
  | FeedPostResponse
  | NoticePostResponse
  | EventPostResponse

/**
 * 페이지네이션이 포함된 게시글 목록 응답 구조
 */
export interface PostListResponse<T> {
  /** 게시글 목록 배열 */
  posts: T[]
  /** 전체 게시글 수 */
  total: number
}

// --- 생성/수정 요청 타입 ---

/**
 * 피드 게시글 생성 요청 데이터
 */
export interface FeedPostCreate {
  /** 게시글 내용 */
  content: string
  /** 익명 작성 여부 */
  is_anonymous: boolean
  /** 이미지 URL 목록 (선택) */
  image_urls?: string[] | null
}

/**
 * 공지사항 생성 요청 데이터 (관리자 전용)
 */
export interface NoticePostCreate {
  /** 공지 제목 */
  title: string
  /** 공지 내용 */
  content: string
  /** 상단 고정 여부 */
  is_pinned: boolean
  /** 파일 URL 목록 (선택) */
  file_urls?: string[] | null
  /** 이미지 URL 목록 (선택) */
  image_urls?: string[] | null
}

/**
 * 이벤트 생성 요청 데이터 (관리자 전용)
 */
export interface EventPostCreate {
  /** 이벤트 제목 */
  title: string
  /** 이벤트 내용 */
  content: string
  /** 신청 시작 일시 (ISO 8601) */
  application_start: string
  /** 신청 종료 일시 (ISO 8601) */
  application_end: string
  /** 이벤트 시작 일시 (ISO 8601) */
  event_start: string
  /** 이벤트 종료 일시 (ISO 8601) */
  event_end: string
  /** 이벤트 장소 */
  event_location: string
  /** 필수 참여 여부 */
  is_mandatory: boolean
  /** 이벤트 카테고리 (선택) */
  event_category?: string | null
  /** 최대 참여 인원 (선택) */
  max_participants?: number | null
  /** 파일 URL 목록 (선택) */
  file_urls?: string[] | null
  /** 이미지 URL 목록 (선택) */
  image_urls?: string[] | null
}

// --- 수정 요청 타입 (Partial 활용) ---

/**
 * 피드 게시글 수정 요청 데이터 (익명 여부는 수정 불가)
 */
export type FeedPostUpdate = Partial<Omit<FeedPostCreate, 'is_anonymous'>>

/**
 * 공지사항 수정 요청 데이터
 */
export type NoticePostUpdate = Partial<NoticePostCreate>

/**
 * 이벤트 수정 요청 데이터 (상태 변경 가능)
 */
export interface EventPostUpdate {
  title?: string | null
  content?: string | null
  application_start?: string | null
  application_end?: string | null
  event_start?: string | null
  event_end?: string | null
  event_location?: string | null
  is_mandatory?: boolean | null
  event_status?: EventStatus | null
  event_category?: string | null
  max_participants?: number | null
  file_urls?: string[] | null
  image_urls?: string[] | null
}

// --- 이벤트 신청 / 좋아요·스크랩 응답 타입 ---

/** 이벤트 신청 성공 응답 */
export interface EventApplyResponse {
  message: 'Successfully applied for event'
}

/** 이벤트 신청 취소 응답 */
export interface EventCancelApplyResponse {
  message: 'Event application cancelled'
}

/** 좋아요 토글 응답 */
export interface ToggleLikeResponse {
  liked: boolean
  like_count: number
}

/** 스크랩 토글 응답 */
export interface ToggleScrapResponse {
  scrapped: boolean
  scrap_count: number
}

// MARK: - 내가 작성한 포스트 관련 타입

/**
 * 내가 작성한 포스트 아이템 타입
 */
export const MyPostItemType = {
  FEED: 'FEED',
  COUNCIL_REPORT: 'COUNCIL_REPORT',
} as const

export type MyPostItemType =
  (typeof MyPostItemType)[keyof typeof MyPostItemType]

/**
 * 내가 작성한 포스트 아이템 (Feed + Council Report 통합)
 * GET /posts/me
 */
export interface MyPostItem {
  id: string
  type: MyPostItemType
  created_at: string // ISO datetime
  content?: string | null
  title?: string | null // Council Report에만 있음
  image_urls?: string[] | null
  like_count: number
  comment_count: number
}

/**
 * 내가 작성한 포스트 목록 응답
 * GET /posts/me
 */
export interface MyPostsResponse {
  posts: MyPostItem[]
  total: number
}

// MARK: - 공개 리포트 피드 관련 타입

/**
 * 공개 리포트 피드용 출석 정보
 */
export interface PublicAttendanceResponse {
  name: string
}

/**
 * 공개 리포트 피드 응답
 * GET /posts/council
 */
export interface PublicReportResponse {
  id: string
  title: string
  activity_date: string | null // ISO date
  location: string | null
  content: string | null
  image_urls: string[] | null
  attendance: PublicAttendanceResponse[]
  submitted_at: string // ISO datetime
}
