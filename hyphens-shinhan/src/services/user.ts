import apiClient from './apiClient'
import type {
  UserHomeProfile,
  UserMyProfile,
  UserPublicProfile,
  UserProfileUpdate,
  UserPrivacySettings,
  UserPrivacyUpdate,
} from '@/types'

const BASE = '/users'

/**
 * 유저 프로필·프라이버시 API 서비스
 */
export const UserService = {
  /**
   * 홈용 내 프로필 (GET /users/me)
   */
  getMe: async (): Promise<UserHomeProfile> => {
    const response = await apiClient.get<UserHomeProfile>(`${BASE}/me`)
    return response.data
  },

  /**
   * 내 프로필 상세 (GET /users/me/profile)
   */
  getMyProfile: async (): Promise<UserMyProfile> => {
    const response = await apiClient.get<UserMyProfile>(`${BASE}/me/profile`)
    return response.data
  },

  /**
   * 내 프로필 수정 (PATCH /users/me/profile)
   */
  updateMyProfile: async (
    data: UserProfileUpdate,
  ): Promise<UserMyProfile> => {
    const response = await apiClient.patch<UserMyProfile>(
      `${BASE}/me/profile`,
      data,
    )
    return response.data
  },

  /**
   * 내 개인정보 공개 설정 조회 (GET /users/me/privacy)
   */
  getMyPrivacy: async (): Promise<UserPrivacySettings> => {
    const response = await apiClient.get<UserPrivacySettings>(
      `${BASE}/me/privacy`,
    )
    return response.data
  },

  /**
   * 내 개인정보 공개 설정 수정 (PATCH /users/me/privacy)
   */
  updateMyPrivacy: async (
    data: UserPrivacyUpdate,
  ): Promise<UserPrivacySettings> => {
    const response = await apiClient.patch<UserPrivacySettings>(
      `${BASE}/me/privacy`,
      data,
    )
    return response.data
  },

  /**
   * 다른 유저 공개 프로필 조회 (GET /users/{user_id})
   */
  getPublicProfile: async (userId: string): Promise<UserPublicProfile> => {
    const response = await apiClient.get<UserPublicProfile>(
      `${BASE}/${userId}`,
    )
    return response.data
  },
}
