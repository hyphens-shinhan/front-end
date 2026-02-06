import apiClient from './apiClient'
import {
  ClubCreate,
  ClubUpdate,
  ClubResponse,
  ClubListResponse,
  ClubListQuery,
  UserClubProfile,
  ClubJoinResponse,
  ClubLeaveResponse,
  GalleryImageCreate,
  GalleryImageResponse,
  GalleryListResponse,
  GalleryListQuery,
  GalleryDeleteResponse,
  ClubMemberResponse,
  ClubMemberListResponse,
} from '@/types/clubs'

const BASE = '/clubs'

/**
 * 소모임·갤러리 API 서비스
 */
export const ClubService = {
  // --- Club API ---

  /**
   * 소모임 생성
   */
  createClub: async (data: ClubCreate): Promise<ClubResponse> => {
    const response = await apiClient.post<ClubResponse>(BASE, data)
    return response.data
  },

  /**
   * 소모임 목록 조회
   */
  getClubs: async (query?: ClubListQuery): Promise<ClubListResponse> => {
    const response = await apiClient.get<ClubListResponse>(BASE, {
      params: query,
    })
    return response.data
  },

  /**
   * 소모임 상세 조회
   */
  getClub: async (clubId: string): Promise<ClubResponse> => {
    const response = await apiClient.get<ClubResponse>(`${BASE}/${clubId}`)
    return response.data
  },

  /**
   * 소모임 수정 (생성자만)
   */
  updateClub: async (
    clubId: string,
    data: ClubUpdate,
  ): Promise<ClubResponse> => {
    const response = await apiClient.patch<ClubResponse>(
      `${BASE}/${clubId}`,
      data,
    )
    return response.data
  },

  /**
   * 소모임 가입
   */
  joinClub: async (
    clubId: string,
    profile: UserClubProfile,
  ): Promise<ClubJoinResponse> => {
    const response = await apiClient.post<ClubJoinResponse>(
      `${BASE}/${clubId}/join`,
      profile,
    )
    return response.data
  },

  /**
   * 소모임 탈퇴
   */
  leaveClub: async (clubId: string): Promise<ClubLeaveResponse> => {
    const response = await apiClient.post<ClubLeaveResponse>(
      `${BASE}/${clubId}/leave`,
    )
    return response.data
  },

  // --- Gallery API ---

  /**
   * 갤러리 이미지 업로드 (생성자만)
   */
  createGalleryImage: async (
    clubId: string,
    data: GalleryImageCreate,
  ): Promise<GalleryImageResponse> => {
    const response = await apiClient.post<GalleryImageResponse>(
      `${BASE}/${clubId}/gallery`,
      data,
    )
    return response.data
  },

  /**
   * 갤러리 목록 조회
   */
  getGalleryImages: async (
    clubId: string,
    query?: GalleryListQuery,
  ): Promise<GalleryListResponse> => {
    const response = await apiClient.get<GalleryListResponse>(
      `${BASE}/${clubId}/gallery`,
      { params: query },
    )
    return response.data
  },

  /**
   * 갤러리 이미지 삭제 (생성자만)
   */
  deleteGalleryImage: async (
    clubId: string,
    imageId: string,
  ): Promise<GalleryDeleteResponse> => {
    const response = await apiClient.delete<GalleryDeleteResponse>(
      `${BASE}/${clubId}/gallery/${imageId}`,
    )
    return response.data
  },

  // --- Members API ---

  /**
   * 소모임 멤버 목록 조회
   */
  getClubMembers: async (clubId: string): Promise<ClubMemberListResponse> => {
    const response = await apiClient.get<ClubMemberListResponse>(
      `${BASE}/${clubId}/members`,
    )
    return response.data
  },
}
