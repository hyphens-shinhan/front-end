import { useQuery } from '@tanstack/react-query'
import { NetworkingService } from '@/services/networking'

export const networkKeys = {
  all: ['network'] as const,
  recommendations: (params?: { limit?: number; offset?: number }) =>
    [...networkKeys.all, 'recommendations', params ?? {}] as const,
  friends: (params?: { limit?: number; offset?: number; search?: string }) =>
    [...networkKeys.all, 'friends', params ?? {}] as const,
  nearby: (params?: {
    radius_km?: number
    limit?: number
    offset?: number
  }) => [...networkKeys.all, 'nearby', params ?? {}] as const,
}

export const useRecommendations = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: networkKeys.recommendations(params),
    queryFn: () => NetworkingService.getRecommendations(params),
  })
}

export const useFriends = (params?: {
  limit?: number
  offset?: number
  search?: string
}) => {
  return useQuery({
    queryKey: networkKeys.friends(params),
    queryFn: () => NetworkingService.getFriends(params),
  })
}

export const useNearby = (params?: {
  radius_km?: number
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: networkKeys.nearby(params),
    queryFn: () => NetworkingService.getNearby(params),
  })
}
