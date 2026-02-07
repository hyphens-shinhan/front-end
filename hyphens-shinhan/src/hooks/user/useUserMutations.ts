import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService } from '@/services/user'
import { userKeys } from './useUser'
import { postKeys } from '@/hooks/posts/usePosts'
import type { UserProfileUpdate, UserPrivacyUpdate } from '@/types'

/**
 * 내 프로필 수정 훅 (PATCH /users/me/profile)
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProfileUpdate) =>
      UserService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
      // 프로필 이미지 업데이트 시 피드 목록도 갱신하여 최신 프로필 이미지 반영
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() })
    },
  })
}

/**
 * 내 프라이버시 설정 수정 훅 (PATCH /users/me/privacy)
 */
export const useUpdateMyPrivacy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserPrivacyUpdate) =>
      UserService.updateMyPrivacy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.myPrivacy() })
    },
  })
}
