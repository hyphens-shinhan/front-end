import apiClient from './apiClient'
import type {
  CouncilCreate,
  CouncilUpdate,
  CouncilMemberAddRequest,
  CouncilResponse,
  CouncilListResponse,
  CouncilMemberResponse,
  CouncilActivityResponse,
  CouncilMessageResponse,
} from '@/types/councils'

const BASE = '/councils'

/** GET /councils 쿼리 파라미터 */
export interface CouncilListParams {
  year?: number
  region?: string
}

/** GET /councils/me/{year} 쿼리 파라미터 (admin: user_id) */
export interface CouncilMeParams {
  user_id?: string
}

/**
 * Councils API 서비스
 *
 * POST   /councils                          → CouncilCreate → CouncilResponse
 * GET    /councils                          → CouncilListResponse (query: year?, region?)
 * GET    /councils/{council_id}              → CouncilResponse
 * PATCH  /councils/{council_id}              → CouncilUpdate → CouncilResponse
 * DELETE /councils/{council_id}             → CouncilMessageResponse
 * POST   /councils/{council_id}/members      → { target_user_id } → CouncilMessageResponse
 * DELETE /councils/{council_id}/members/{target_user_id} → CouncilMessageResponse
 * GET    /councils/{council_id}/members      → CouncilMemberResponse[]
 * GET    /councils/me/{year}                 → CouncilActivityResponse (query: user_id? admin용)
 */
export const CouncilsService = {
  /** POST /councils - 회의 생성 */
  create: async (body: CouncilCreate): Promise<CouncilResponse> => {
    const { data } = await apiClient.post<CouncilResponse>(BASE, body)
    return data
  },

  /** GET /councils - 회의 목록 (year?, region?) */
  getList: async (
    params?: CouncilListParams
  ): Promise<CouncilListResponse> => {
    const { data } = await apiClient.get<CouncilListResponse>(BASE, {
      params,
    })
    return data
  },

  /** GET /councils/{council_id} - 회의 단건 조회 */
  getById: async (councilId: string): Promise<CouncilResponse> => {
    const { data } = await apiClient.get<CouncilResponse>(
      `${BASE}/${councilId}`
    )
    return data
  },

  /** PATCH /councils/{council_id} - 회의 수정 */
  update: async (
    councilId: string,
    body: CouncilUpdate
  ): Promise<CouncilResponse> => {
    const { data } = await apiClient.patch<CouncilResponse>(
      `${BASE}/${councilId}`,
      body
    )
    return data
  },

  /** DELETE /councils/{council_id} - 회의 삭제 */
  delete: async (councilId: string): Promise<CouncilMessageResponse> => {
    const { data } = await apiClient.delete<CouncilMessageResponse>(
      `${BASE}/${councilId}`
    )
    return data
  },

  /** POST /councils/{council_id}/members - 멤버 추가 */
  addMember: async (
    councilId: string,
    body: CouncilMemberAddRequest
  ): Promise<CouncilMessageResponse> => {
    const { data } = await apiClient.post<CouncilMessageResponse>(
      `${BASE}/${councilId}/members`,
      body
    )
    return data
  },

  /** DELETE /councils/{council_id}/members/{target_user_id} - 멤버 제거 */
  removeMember: async (
    councilId: string,
    targetUserId: string
  ): Promise<CouncilMessageResponse> => {
    const { data } = await apiClient.delete<CouncilMessageResponse>(
      `${BASE}/${councilId}/members/${targetUserId}`
    )
    return data
  },

  /** GET /councils/{council_id}/members - 멤버 목록 */
  getMembers: async (
    councilId: string
  ): Promise<CouncilMemberResponse[]> => {
    const { data } = await apiClient.get<CouncilMemberResponse[]>(
      `${BASE}/${councilId}/members`
    )
    return data
  },

  /** GET /councils/me/{year} - 내 회의 + 활동 상태 (admin: user_id 쿼리) */
  getMyCouncils: async (
    year: number,
    params?: CouncilMeParams
  ): Promise<CouncilActivityResponse> => {
    const { data } = await apiClient.get<CouncilActivityResponse>(
      `${BASE}/me/${year}`,
      { params }
    )
    return data
  },
}
