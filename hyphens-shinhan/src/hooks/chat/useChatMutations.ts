import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChatService } from '@/services/chat'
import { chatKeys } from './useChat'
import type { MessageCreate } from '@/types/chat'

/**
 * 클럽 채팅방 입장/생성 (POST /clubs/{club_id}/join)
 */
export const useJoinClubChat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubId: string) => ChatService.joinClubChat(clubId),
    onSuccess: (data) => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
      // 새로 생성된 채팅방의 메시지도 갱신
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(data.id),
        })
      }
    },
  })
}

/**
 * 클럽 채팅방 나가기 (POST /clubs/{club_id}/leave)
 */
export const useLeaveClubChat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubId: string) => ChatService.leaveClubChat(clubId),
    onSuccess: () => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    },
  })
}

/**
 * 메시지 전송 (POST /{room_id}/messages)
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string
      data: MessageCreate
    }) => ChatService.sendMessage(roomId, data),
    onSuccess: (_, { roomId }) => {
      // 해당 채팅방 메시지 갱신
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) })
      // 채팅방 목록도 갱신 (최신 메시지 업데이트)
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    },
  })
}

/**
 * DM 생성/조회 (POST /message/{user_id})
 * 상호 팔로우 필요
 */
export const useCreateOrGetDM = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => ChatService.createOrGetDM(userId),
    onSuccess: (data) => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
      // 새로 생성된 DM의 메시지도 갱신
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(data.id),
        })
      }
    },
  })
}
