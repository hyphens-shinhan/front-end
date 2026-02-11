/**
 * Videos API 타입
 * Base: /api/v1/videos | 인증: Bearer
 */

/** 비디오 생성 요청 (POST /videos, ADMIN 전용) */
export interface VideoCreate {
  /** 1~300자 */
  title: string
  /** 1자 이상 (YouTube 등) */
  url: string
}

/** 비디오 단건 응답 */
export interface VideoResponse {
  id: string
  title: string
  url: string
  /** YouTube면 자동 생성 (img.youtube.com/vi/{id}/hqdefault.jpg) */
  thumbnail_url: string | null
  /** ISO datetime */
  created_at: string
}

/** 비디오 목록 응답 (최신순) */
export interface VideoListResponse {
  videos: VideoResponse[]
  total: number
}
