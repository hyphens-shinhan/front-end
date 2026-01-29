/**
 * 댓글 작성자 정보
 */
export interface CommentAuthor {
  /** 작성자 고유 ID (UUID) */
  id: string
  /** 작성자 이름/닉네임 */
  name: string
  /** 작성자 프로필 이미지 URL */
  avatar_url?: string | null
}

/**
 * 댓글 생성 요청 데이터
 */
export interface CommentCreate {
  /** 댓글 내용 */
  content: string
  /** 익명 작성 여부 */
  is_anonymous: boolean
  /** 부모 댓글 ID (대댓글인 경우 필수, UUID) */
  parent_id?: string | null
}

/**
 * 댓글 수정 요청 데이터
 */
export interface CommentUpdate {
  /** 수정할 댓글 내용 */
  content: string
}

/**
 * 댓글 응답 데이터 구조
 */
export interface CommentResponse {
  /** 댓글 고유 ID (UUID) */
  id: string
  /** 게시글 ID (UUID) */
  post_id: string
  /** 댓글 내용 */
  content: string
  /** 익명 여부 */
  is_anonymous: boolean
  /** 삭제 여부 (삭제된 댓글은 "삭제된 댓글입니다" 등으로 표시) */
  is_deleted: boolean
  /** 생성 일시 (ISO 8601) */
  created_at: string
  /** 작성자 정보 (익명/삭제 시 null) */
  author: CommentAuthor | null
  /** 부모 댓글 ID (대댓글인 경우, UUID) */
  parent_id?: string | null
  /** 대댓글 목록 */
  replies: CommentResponse[]
}

/**
 * 댓글 목록 응답 구조
 */
export interface CommentListResponse {
  /** 댓글 목록 배열 */
  comments: CommentResponse[]
  /** 전체 댓글 수 */
  total: number
}
