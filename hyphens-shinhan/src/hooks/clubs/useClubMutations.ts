import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ClubService } from '@/services/clubs'
import { clubKeys } from './useClubs'
import type {
  ClubCreate,
  ClubUpdate,
  UserClubProfile,
  GalleryImageCreate,
} from '@/types/clubs'

/**
 * 소모임 생성 훅
 */
export const useCreateClub = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ClubCreate) => ClubService.createClub(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() }),
  })
}

/**
 * 소모임 수정 훅 (생성자만)
 */
export const useUpdateClub = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubId, data }: { clubId: string; data: ClubUpdate }) =>
      ClubService.updateClub(clubId, data),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) })
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() })
    },
  })
}

/**
 * 소모임 가입 훅
 */
export const useJoinClub = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clubId,
      profile,
    }: {
      clubId: string
      profile: UserClubProfile
    }) => ClubService.joinClub(clubId, profile),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) })
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() })
    },
  })
}

/**
 * 소모임 탈퇴 훅
 */
export const useLeaveClub = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubId: string) => ClubService.leaveClub(clubId),
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) })
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() })
    },
  })
}

/**
 * 갤러리 이미지 업로드 훅 (생성자만)
 */
export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clubId,
      data,
    }: {
      clubId: string
      data: GalleryImageCreate
    }) => ClubService.createGalleryImage(clubId, data),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) })
      queryClient.invalidateQueries({ queryKey: clubKeys.gallery(clubId) })
    },
  })
}

/**
 * 갤러리 이미지 삭제 훅 (생성자만)
 */
export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clubId, imageId }: { clubId: string; imageId: string }) =>
      ClubService.deleteGalleryImage(clubId, imageId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) })
      queryClient.invalidateQueries({ queryKey: clubKeys.gallery(clubId) })
    },
  })
}

/**
 * 랜덤 닉네임 생성 훅
 * 버튼 클릭 시 호출하여 리롤 가능
 */
export const useGenerateRandomNickname = () => {
  return useMutation({
    mutationFn: () => ClubService.generateClubNickname(),
  })
}
