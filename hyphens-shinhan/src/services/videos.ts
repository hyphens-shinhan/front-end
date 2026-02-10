/**
 * Videos API 서비스
 * Base: /api/v1/videos | 인증: Bearer
 * - 목록: 모든 인증 사용자
 * - 생성/삭제: ADMIN 전용
 */
import apiClient from './apiClient'
import type { VideoCreate, VideoResponse, VideoListResponse } from '@/types/videos'

const BASE = '/videos'

export const VideoService = {
  /**
   * 비디오 목록 조회 (최신순)
   * GET /videos → VideoListResponse
   */
  getVideos: async (): Promise<VideoListResponse> => {
    const { data } = await apiClient.get<VideoListResponse>(BASE)
    return data
  },

  /**
   * 비디오 생성 (ADMIN 전용)
   * POST /videos body: VideoCreate → VideoResponse
   */
  createVideo: async (body: VideoCreate): Promise<VideoResponse> => {
    const { data } = await apiClient.post<VideoResponse>(BASE, body)
    return data
  },

  /**
   * 비디오 삭제 (ADMIN 전용)
   * DELETE /videos/{video_id} → { message: string }
   */
  deleteVideo: async (videoId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `${BASE}/${videoId}`,
    )
    return data
  },
}
