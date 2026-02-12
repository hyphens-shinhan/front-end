import apiClient from './apiClient'
import type {
  FollowRequestListResponse,
  FollowListResponse,
  FollowStatusResponse,
  FollowRequest,
} from '@/types/follow'
import type { Person } from '@/types/network'

const BASE = '/follows'

/**
 * Map FollowRequest to display shape for FollowRequestsList (id, name, university?)
 */
export interface FollowRequestDisplay {
  id: string
  /** 요청자 userId */
  requesterId: string
  name: string
  avatar_url?: string | null
  university?: string
}

function mapFollowRequestToDisplay(req: FollowRequest): FollowRequestDisplay {
  return {
    id: req.id,
    requesterId: req.requester.id,
    name: req.requester.name,
    avatar_url: req.requester.avatar_url,
  }
}

/**
 * Map FollowUser to UI Person for FollowingList
 */
function mapFollowUserToPerson(user: {
  id: string
  name: string
  avatar_url?: string | null
}): Person {
  return {
    id: String(user.id),
    name: user.name,
    avatar: user.avatar_url ?? undefined,
    generation: '1기',
    scholarshipType: '글로벌',
    isFollowing: true,
    mutualConnections: 0,
  }
}

/**
 * 팔로우 API (plimate-server /api/v1/follows)
 */
export const FollowsService = {
  /**
   * GET /follows/requests - 내가 받은 팔로우 요청 목록
   */
  getRequests: async (params?: {
    limit?: number
    offset?: number
  }): Promise<{ requests: FollowRequestDisplay[]; total: number }> => {
    const { data } = await apiClient.get<FollowRequestListResponse>(
      `${BASE}/requests`,
      { params },
    )
    return {
      requests: (data.requests ?? []).map(mapFollowRequestToDisplay),
      total: data.total ?? 0,
    }
  },

  /**
   * POST /follows/requests/{request_id}/accept - 팔로우 요청 수락
   */
  acceptRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`${BASE}/requests/${requestId}/accept`)
  },

  /**
   * POST /follows/requests/{request_id}/reject - 팔로우 요청 거절
   */
  rejectRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`${BASE}/requests/${requestId}/reject`)
  },

  /**
   * POST /follows/{user_id} - 팔로우 요청 보내기
   */
  follow: async (userId: string): Promise<void> => {
    await apiClient.post(`${BASE}/${userId}`)
  },

  /**
   * DELETE /follows/{user_id} - 언팔로우
   */
  unfollow: async (userId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${userId}`)
  },

  /**
   * GET /follows/{user_id}/status - 특정 유저에 대한 팔로우 상태
   */
  getFollowStatus: async (userId: string): Promise<FollowStatusResponse> => {
    const { data } = await apiClient.get<FollowStatusResponse>(
      `${BASE}/${userId}/status`,
    )
    return data
  },

  /**
   * GET /follows/me - 내가 팔로우하는 사람 목록 (ACCEPTED만)
   */
  getMyFollowing: async (params?: {
    limit?: number
    offset?: number
  }): Promise<{ followers: Person[]; total: number }> => {
    const { data } = await apiClient.get<FollowListResponse>(`${BASE}/me`, {
      params,
    })
    return {
      followers: (data.followers ?? []).map(mapFollowUserToPerson),
      total: data.total ?? 0,
    }
  },
}
