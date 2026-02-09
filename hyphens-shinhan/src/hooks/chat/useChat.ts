import { useQuery } from '@tanstack/react-query'
import { ChatService } from '@/services/chat'

/**
 * 채팅 쿼리 키 관리 객체
 */
export const chatKeys = {
  all: ['chat'] as const,
  /** 채팅방 목록 */
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  /** 특정 채팅방 메시지 */
  messages: (roomId: string, params?: { cursor?: string; limit?: number }) =>
    [...chatKeys.all, 'messages', roomId, params ?? {}] as const,
  /** 클럽 채팅 메시지 */
  clubMessages: (
    clubId: string,
    params?: { cursor?: string; limit?: number },
  ) => [...chatKeys.all, 'club-messages', clubId, params ?? {}] as const,
}

/**
 * 채팅방 목록 조회 (GET /)
 * 내가 속한 모든 채팅방 목록, 최신 메시지순
 */
export const useChatRooms = () => {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () => ChatService.getChatRooms(),
  })
}

/**
 * 특정 채팅방 메시지 조회 (GET /{room_id}/messages)
 * @param roomId 채팅방 ID
 * @param cursor 마지막 메시지 ID (페이징용)
 * @param limit 기본값 없음
 */
export const useMessages = (
  roomId: string | null,
  params?: { cursor?: string; limit?: number },
) => {
  return useQuery({
    queryKey: chatKeys.messages(roomId ?? '', params),
    queryFn: () =>
      roomId ? ChatService.getMessages(roomId, params) : Promise.resolve(null),
    enabled: !!roomId,
  })
}

/**
 * 클럽 채팅 메시지 조회 (GET /clubs/{club_id}/messages)
 * @param clubId 클럽 ID
 * @param cursor 마지막 메시지 ID (페이징용)
 * @param limit 기본 30
 */
export const useClubChatMessages = (
  clubId: string | null,
  params?: { cursor?: string; limit?: number },
) => {
  return useQuery({
    queryKey: chatKeys.clubMessages(clubId ?? '', params),
    queryFn: () =>
      clubId
        ? ChatService.getClubChatMessages(clubId, params)
        : Promise.resolve(null),
    enabled: !!clubId,
  })
}
