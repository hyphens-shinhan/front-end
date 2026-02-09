import apiClient from './apiClient'
import type {
  NearbyUsersResponse,
  RecommendationsResponse,
  MyFriendsResponse,
  RecommendedUserCard,
  FriendCard,
  NearbyUserCard,
} from '@/types/network'
import type { Person, Location } from '@/types/network'

const BASE = '/networking'

/**
 * Map backend RecommendedUserCard to UI Person (추천/함께 아는 친구)
 */
function mapRecommendedToPerson(card: RecommendedUserCard): Person {
  return {
    id: String(card.id),
    name: card.name,
    avatar: card.avatar_url ?? undefined,
    generation: '1기',
    scholarshipType: '글로벌',
    mutualConnections: card.mutual_friends_count,
    ...(card.affiliation && { university: card.affiliation }),
  }
}

/**
 * Map backend FriendCard to UI Person (내가 팔로우하는 사람)
 */
function mapFriendToPerson(card: FriendCard): Person {
  return {
    id: String(card.id),
    name: card.name,
    avatar: card.avatar_url ?? undefined,
    generation: card.scholarship_batch ? `${card.scholarship_batch}기` : '1기',
    scholarshipType: '글로벌',
    isFollowing: true,
    mutualConnections: 0,
    ...(card.affiliation && { university: card.affiliation }),
    ...(card.role && { tags: [card.role] }),
  }
}

/**
 * Map backend NearbyUserCard to UI Person (나와 가까운)
 */
function mapNearbyToPerson(card: NearbyUserCard): Person {
  const location: Location = {
    latitude: card.latitude,
    longitude: card.longitude,
  }
  return {
    id: String(card.id),
    name: card.name,
    avatar: card.avatar_url ?? undefined,
    generation: '1기',
    scholarshipType: '글로벌',
    location,
    distance: card.distance_km,
    mutualConnections: 0,
    ...(card.affiliation && { university: card.affiliation }),
  }
}

/**
 * 네트워킹 API (plimate-server /api/v1/networking)
 */
export const NetworkingService = {
  /**
   * GET /networking/recommendations - 친구 추천 / 함께 아는 친구
   */
  getRecommendations: async (params?: {
    limit?: number
    offset?: number
  }): Promise<{ users: Person[]; total: number }> => {
    const { data } = await apiClient.get<RecommendationsResponse>(
      `${BASE}/recommendations`,
      { params }
    )
    return {
      users: (data.users ?? []).map(mapRecommendedToPerson),
      total: data.total ?? 0,
    }
  },

  /**
   * GET /networking/friends - 내 친구 목록 (팔로우 수락된 사람)
   */
  getFriends: async (params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<{ friends: Person[]; total: number }> => {
    const { data } = await apiClient.get<MyFriendsResponse>(`${BASE}/friends`, {
      params,
    })
    return {
      friends: (data.friends ?? []).map(mapFriendToPerson),
      total: data.total ?? 0,
    }
  },

  /**
   * GET /networking/nearby - 나와 가까운 사람 (지도용)
   */
  getNearby: async (params?: {
    radius_km?: number
    limit?: number
    offset?: number
  }): Promise<{
    users: Person[]
    total: number
    center_lat: number
    center_lng: number
    radius_km: number
  }> => {
    const { data } = await apiClient.get<NearbyUsersResponse>(
      `${BASE}/nearby`,
      { params }
    )
    return {
      users: (data.users ?? []).map(mapNearbyToPerson),
      total: data.total ?? 0,
      center_lat: data.center_lat,
      center_lng: data.center_lng,
      radius_km: data.radius_km,
    }
  },
}
