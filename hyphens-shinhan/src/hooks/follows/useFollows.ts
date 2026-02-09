import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FollowsService } from '@/services/follows'
import { networkKeys } from '@/hooks/network/useNetwork'

export const followKeys = {
  all: ['follows'] as const,
  requests: (params?: { limit?: number; offset?: number }) =>
    [...followKeys.all, 'requests', params ?? {}] as const,
  me: (params?: { limit?: number; offset?: number }) =>
    [...followKeys.all, 'me', params ?? {}] as const,
  status: (userId: string) => [...followKeys.all, 'status', userId] as const,
}

export const useFollowRequests = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: followKeys.requests(params),
    queryFn: () => FollowsService.getRequests(params),
  })
}

export const useMyFollowing = (params?: {
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: followKeys.me(params),
    queryFn: () => FollowsService.getMyFollowing(params),
  })
}

export const useAcceptFollowRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) =>
      FollowsService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: networkKeys.all })
    },
  })
}

export const useRejectFollowRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) =>
      FollowsService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: networkKeys.all })
    },
  })
}

export const useFollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => FollowsService.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: networkKeys.all })
    },
  })
}

export const useUnfollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => FollowsService.unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: networkKeys.all })
    },
  })
}
