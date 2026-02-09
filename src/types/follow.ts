/**
 * 팔로우 API 타입 (plimate-server /api/v1/follows 스키마와 정렬)
 */

export type FollowStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface FollowUser {
  id: string
  name: string
  avatar_url: string | null
}

export interface FollowRequest {
  id: string
  requester: FollowUser
  created_at: string
}

export interface FollowRequestListResponse {
  requests: FollowRequest[]
  total: number
}

export interface FollowListResponse {
  followers: FollowUser[]
  total: number
}

export interface FollowStatusResponse {
  status: FollowStatus | null
  is_following: boolean
}
