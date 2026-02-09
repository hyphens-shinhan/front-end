import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CouncilsService } from '@/services/councils'
import { councilKeys } from './useCouncils'
import type {
  CouncilCreate,
  CouncilUpdate,
  CouncilMemberAddRequest,
} from '@/types/councils'

/** 회의 생성 (POST /councils) */
export const useCreateCouncil = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CouncilCreate) => CouncilsService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: councilKeys.lists() })
    },
  })
}

/** 회의 수정 (PATCH /councils/{council_id}) */
export const useUpdateCouncil = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      councilId,
      body,
    }: {
      councilId: string
      body: CouncilUpdate
    }) => CouncilsService.update(councilId, body),
    onSuccess: (_, { councilId }) => {
      queryClient.invalidateQueries({ queryKey: councilKeys.detail(councilId) })
      queryClient.invalidateQueries({ queryKey: councilKeys.lists() })
      queryClient.invalidateQueries({ queryKey: councilKeys.all })
    },
  })
}

/** 회의 삭제 (DELETE /councils/{council_id}) */
export const useDeleteCouncil = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (councilId: string) => CouncilsService.delete(councilId),
    onSuccess: (_, councilId) => {
      queryClient.invalidateQueries({ queryKey: councilKeys.detail(councilId) })
      queryClient.invalidateQueries({ queryKey: councilKeys.lists() })
      queryClient.invalidateQueries({ queryKey: councilKeys.all })
    },
  })
}

/** 회의 멤버 추가 (POST /councils/{council_id}/members) */
export const useAddCouncilMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      councilId,
      body,
    }: {
      councilId: string
      body: CouncilMemberAddRequest
    }) => CouncilsService.addMember(councilId, body),
    onSuccess: (_, { councilId }) => {
      queryClient.invalidateQueries({
        queryKey: councilKeys.members(councilId),
      })
      queryClient.invalidateQueries({ queryKey: councilKeys.detail(councilId) })
      queryClient.invalidateQueries({ queryKey: councilKeys.all })
    },
  })
}

/** 회의 멤버 제거 (DELETE /councils/{council_id}/members/{target_user_id}) */
export const useRemoveCouncilMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      councilId,
      targetUserId,
    }: {
      councilId: string
      targetUserId: string
    }) => CouncilsService.removeMember(councilId, targetUserId),
    onSuccess: (_, { councilId }) => {
      queryClient.invalidateQueries({
        queryKey: councilKeys.members(councilId),
      })
      queryClient.invalidateQueries({ queryKey: councilKeys.detail(councilId) })
      queryClient.invalidateQueries({ queryKey: councilKeys.all })
    },
  })
}
