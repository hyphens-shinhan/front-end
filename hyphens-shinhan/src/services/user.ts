import apiClient from './apiClient'
import type {
  UserHomeProfile,
  UserMyProfile,
  UserPublicProfile,
  UserProfileUpdate,
  UserPrivacySettings,
  UserPrivacyUpdate,
  ScholarshipEligibilityResponse,
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
    const response = await apiClient.get<any>(`${BASE}/me/profile`)
    const data = response.data
    // API 응답의 address 필드를 location으로 매핑
    return {
      ...data,
      location: data.address || data.location || null,
    } as UserMyProfile
  },

  /**
   * 내 프로필 수정 (PATCH /users/me/profile)
   */
  updateMyProfile: async (
    data: UserProfileUpdate,
  ): Promise<UserMyProfile> => {
    // location을 address로 변환하여 요청
    const requestData: any = { ...data }
    if ('location' in requestData) {
      requestData.address = requestData.location
      delete requestData.location
    }
    
    const response = await apiClient.patch<any>(
      `${BASE}/me/profile`,
      requestData,
    )
    const responseData = response.data
    // API 응답의 address 필드를 location으로 매핑
    return {
      ...responseData,
      location: responseData.address || responseData.location || null,
    } as UserMyProfile
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
   * 장학 유지 요건 요약 조회 (GET /users/me/scholarship-eligibility)
   * @param year - 조회 연도 (2000~2100, 미입력 시 현재 연도)
   */
  getScholarshipEligibility: async (
    year?: number,
  ): Promise<ScholarshipEligibilityResponse> => {
    const params = year != null ? { year } : undefined
    const response = await apiClient.get<ScholarshipEligibilityResponse>(
      `${BASE}/me/scholarship-eligibility`,
      { params },
    )
    return response.data
  },

  /**
   * 다른 유저 공개 프로필 조회 (GET /users/{user_id})
   */
  getPublicProfile: async (userId: string): Promise<UserPublicProfile> => {
    const response = await apiClient.get<any>(`${BASE}/${userId}`)
    const data = response.data
    // API 응답의 address 필드를 location으로 매핑
    return {
      ...data,
      location: data.address || data.location || null,
    } as UserPublicProfile
  },
}
