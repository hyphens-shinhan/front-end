'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useUserStore, useHeaderStore, useBottomSheetStore } from '@/stores'
import { useChatRooms, useMessages, chatKeys } from '@/hooks/chat/useChat'
import { useCreateOrGetDM, useSendMessage } from '@/hooks/chat/useChatMutations'
import { useChatRealtime } from '@/hooks/chat/useChatRealtime'
import MessageInput from '@/components/common/MessageInput'
import EmptyContent from '@/components/common/EmptyContent'
import GroupChatMessageItem from '@/components/community/group/GroupChatMessageItem'
import ChatOptionsMenu from './ChatOptionsMenu'
import { INPUT_BAR_TYPE, EMPTY_CONTENT_MESSAGES, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'
import type { MessageResponse } from '@/types/chat'
import {
  convertMessageToGroupChatMessage,
  formatDateLabel,
  type GroupChatMessage,
} from '@/components/community/group/groupChatUtils'

interface ChatViewProps {
  otherUserId: string
}

export default function ChatView({ otherUserId }: ChatViewProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useUserStore((s) => s.user)
  const currentUserId = user?.id ?? null
  const { setCustomTitle, setHandlers, resetHandlers } = useHeaderStore()
  const { onOpen: openBottomSheet, onClose: closeBottomSheet } = useBottomSheetStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [roomId, setRoomId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isChatRoomReady, setIsChatRoomReady] = useState(false)
  const [otherUserName, setOtherUserName] = useState<string | null>(null)
  const isSendingRef = useRef(false)

  // 채팅방 목록에서 DM 채팅방 찾기
  const { data: chatRoomsData } = useChatRooms()
  const createOrGetDM = useCreateOrGetDM()
  const sendMessageMutation = useSendMessage()

  // DM 채팅방 찾기/생성
  useEffect(() => {
    if (!otherUserId || !currentUserId) return

    // 이미 준비됐으면 스킵
    if (isChatRoomReady && roomId) return

    if (chatRoomsData?.rooms) {
      // 기존 DM 채팅방 찾기
      const dmRoom = chatRoomsData.rooms.find(
        (room) =>
          room.type === 'DM' &&
          room.members?.some((m) => m.id === otherUserId),
      )

      if (dmRoom) {
        setRoomId(dmRoom.id)
        setIsChatRoomReady(true)
        // 상대방 이름 추출
        const otherMember = dmRoom.members?.find((m) => m.id === otherUserId)
        if (otherMember) setOtherUserName(otherMember.name)
      } else if (!createOrGetDM.isPending) {
        // DM 채팅방이 없으면 생성
        createOrGetDM.mutate(otherUserId, {
          onSuccess: (data) => {
            setRoomId(data.id)
            setIsChatRoomReady(true)
            const otherMember = data.members?.find((m) => m.id === otherUserId)
            if (otherMember) setOtherUserName(otherMember.name)
          },
          onError: () => {
            setIsChatRoomReady(false)
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomsData, otherUserId, currentUserId])

  // DM 메시지 조회 (채팅방 준비 후)
  const messageParams = {}
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
  } = useMessages(roomId, messageParams)

  // 실시간 구독
  const { sendBroadcast } = useChatRealtime(roomId, { params: messageParams })

  // 메시지 변환
  const messages: GroupChatMessage[] = messagesData?.messages
    ? messagesData.messages
      .map((msg) => convertMessageToGroupChatMessage(msg, currentUserId))
      .reverse()
    : []

  // 헤더 설정
  useEffect(() => {
    setCustomTitle(otherUserName ?? '채팅')
    return () => setCustomTitle(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserName])

  // 헤더 더보기 버튼 → 바텀시트
  useEffect(() => {
    setHandlers({
      onClick: () => {
        openBottomSheet({
          closeOnOverlayClick: true,
          content: (
            <ChatOptionsMenu
              otherUserId={otherUserId}
              onClose={closeBottomSheet}
            />
          ),
        })
      },
    })
    return () => resetHandlers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId])

  // 채팅방 진입 시·메시지 로드 시 맨 아래(최신)로 스크롤 (레이아웃 완료 후)
  useEffect(() => {
    if (messages.length === 0) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [messages])

  // 메시지 전송
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
        data: { message: messageToSend },
      },
      {
        onSuccess: (data) => {
          // 캐시에 즉시 반영
          queryClient.setQueryData(
            chatKeys.messages(roomId, messageParams),
            (old: { messages: MessageResponse[]; has_more: boolean } | undefined) => {
              if (!old) return { messages: [data], has_more: false }
              if (old.messages.some((m) => m.id === data.id)) return old
              return { ...old, messages: [data, ...old.messages] }
            },
          )
          sendBroadcast(data)
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
  }, [message, roomId, sendMessageMutation, queryClient, sendBroadcast])

  // 로딩 상태
  if (
    !currentUserId ||
    !isChatRoomReady ||
    (isMessagesLoading && isChatRoomReady) ||
    createOrGetDM.isPending
  ) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
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
  container: cn('flex flex-1 flex-col min-h-0 bg-white overflow-hidden pb-20'),
  messagesContainer: cn('flex-1 min-h-0 overflow-y-auto px-4 pb-4'),
  dateLabel: cn('py-3 text-center text-[14px] font-normal leading-5 text-grey-8'),
  messagesList: cn('flex flex-col gap-5'),
  inputWrapper: cn('flex flex-col fixed bottom-0 left-0 right-0', 'bg-white'),
  inputInner: cn('w-full max-w-md mx-auto'),
}
