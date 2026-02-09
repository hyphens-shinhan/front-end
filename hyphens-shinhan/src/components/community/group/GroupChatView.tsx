'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useClub } from '@/hooks/clubs/useClubs'
import { useHeaderStore, useUserStore, useBottomSheetStore } from '@/stores'
import { useClubChatMessages, useChatRooms, chatKeys } from '@/hooks/chat/useChat'
import { useJoinClubChat, useSendMessage, useLeaveClubChat } from '@/hooks/chat/useChatMutations'
import { useLeaveClub } from '@/hooks/clubs/useClubMutations'
import MessageInput from '@/components/common/MessageInput'
import EmptyContent from '@/components/common/EmptyContent'
import GroupChatMessageItem from './GroupChatMessageItem'
import GroupMoreOptionsMenu from './GroupMoreOptionsMenu'
import { INPUT_BAR_TYPE, EMPTY_CONTENT_MESSAGES, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'
import {
  convertMessageToGroupChatMessage,
  formatDateLabel,
  type GroupChatMessage,
} from './groupChatUtils'

interface GroupChatViewProps {
  clubId: string
}

/**
 * 소모임 채팅 화면.
 * 디자인: 헤더(뒤로, 그룹명, 더보기), 날짜 구분, 수신/발신 말풍선, 하단 입력창.
 */
export default function GroupChatView({ clubId }: GroupChatViewProps) {
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const currentUserId = user?.id ?? null
  const { data: club, isLoading: isClubLoading } = useClub(clubId)
  const { setCustomTitle, setHandlers, resetHandlers } = useHeaderStore()
  const { onOpen: openBottomSheet, onClose: closeBottomSheet } = useBottomSheetStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [roomId, setRoomId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isChatRoomReady, setIsChatRoomReady] = useState(false)
  const isSendingRef = useRef(false)

  // 채팅방 목록에서 클럽 채팅방 찾기 (메시지 전송을 위한 roomId 필요)
  const { data: chatRoomsData } = useChatRooms()
  const joinClubChat = useJoinClubChat()
  const sendMessageMutation = useSendMessage()
  const leaveClubChat = useLeaveClubChat()
  const leaveClub = useLeaveClub()

  // 채팅방 ID 찾기 및 생성 (메시지 조회 전에 채팅방이 준비되어야 함)
  useEffect(() => {
    if (!clubId || !club) return

    if (chatRoomsData?.rooms) {
      const clubRoom = chatRoomsData.rooms.find(
        (room) => room.type === 'GROUP' && room.club_id === clubId,
      )

      if (clubRoom) {
        setRoomId(clubRoom.id)
        setIsChatRoomReady(true)
      } else if (!joinClubChat.isPending) {
        // 채팅방이 없으면 입장 시도 (생성/입장)
        joinClubChat.mutate(clubId, {
          onSuccess: (data) => {
            setRoomId(data.id)
            setIsChatRoomReady(true)
          },
          onError: () => {
            setIsChatRoomReady(false)
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomsData, clubId, club])

  // 클럽 채팅 메시지 조회 (채팅방이 준비된 후에만 조회)
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
  } = useClubChatMessages(clubId, {}, isChatRoomReady)

  // 메시지 데이터 변환
  const messages: GroupChatMessage[] = messagesData?.messages
    ? messagesData.messages
      .map((msg) => convertMessageToGroupChatMessage(msg, currentUserId))
      .reverse() // API는 최신순이므로 역순으로 정렬
    : []

  useEffect(() => {
    setCustomTitle(club?.name ?? '채팅')
    return () => setCustomTitle(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club?.name])


  useEffect(() => {
    setHandlers({
      onClick: () => {
        openBottomSheet({
          closeOnOverlayClick: true,
          content: (
            <GroupMoreOptionsMenu
              onLeaveClub={() => {
                closeBottomSheet()
                // 소모임 나가기
                leaveClub.mutate(clubId, {
                  onSuccess: () => {
                    // 소모임 나가기 성공 후 채팅방도 나가기
                    leaveClubChat.mutate(clubId, {
                      onSuccess: () => {
                        router.push(ROUTES.COMMUNITY.GROUP.MAIN)
                      },
                      onError: () => {
                        // 채팅방 나가기 실패해도 소모임은 나갔으므로 이동
                        router.push(ROUTES.COMMUNITY.GROUP.MAIN)
                      },
                    })
                  },
                })
              }}
              isMember={true}
            />
          ),
        })
      },
    })
    return () => resetHandlers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(() => {
    if (
      !message.trim() ||
      !roomId ||
      sendMessageMutation.isPending ||
      isSendingRef.current
    )
      return

    isSendingRef.current = true
    const messageToSend = message.trim()

    sendMessageMutation.mutate(
      {
        roomId,
        data: {
          message: messageToSend,
        },
        clubId, // 클럽 채팅 메시지 쿼리 갱신을 위해 전달
      },
      {
        onSuccess: () => {
          setMessage('')
          isSendingRef.current = false
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        },
        onError: () => {
          isSendingRef.current = false
        },
      },
    )
  }, [message, roomId, clubId, sendMessageMutation])

  if (
    isClubLoading ||
    !isChatRoomReady ||
    (isMessagesLoading && isChatRoomReady) ||
    joinClubChat.isPending
  ) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
      />
    )
  }

  if (!club) {
    return (
      <EmptyContent
        variant="error"
        message="소모임을 찾을 수 없습니다."
      />
    )
  }

  const dateLabel = messages.length > 0 ? formatDateLabel(messages[0].created_at) : ''

  return (
    <div className={styles.container}>
      {/* 메시지 목록 */}
      <div className={styles.messagesContainer}>
        {dateLabel && (
          <p className={styles.dateLabel}>
            {dateLabel}
          </p>
        )}
        <div className={styles.messagesList}>
          {messages.length === 0 ? (
            <EmptyContent
              variant="empty"
              message="아직 메시지가 없습니다."
            />
          ) : (
            messages.map((msg, idx) => (
              <GroupChatMessageItem
                key={msg.id}
                message={msg}
                prevMessage={idx > 0 ? messages[idx - 1] : null}
              />
            ))
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className={styles.inputWrapper}>
        <div className={styles.inputInner}>
          <MessageInput
            type={INPUT_BAR_TYPE.CHAT}
            value={message}
            onChange={(value) => setMessage(value)}
            onSend={handleSend}
            isSubmitting={!roomId || sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-1 flex-col min-h-0 bg-white overflow-hidden'),
  messagesContainer: cn('flex-1 min-h-0 overflow-y-auto px-4 pb-4'),
  dateLabel: cn('py-3 text-center text-[14px] font-normal leading-5 text-grey-8'),
  messagesList: cn('flex flex-col gap-5'),
  inputWrapper: cn('flex flex-col fixed bottom-0 left-0 right-0', 'bg-white'),
  inputInner: cn('w-full max-w-md mx-auto'),
}
