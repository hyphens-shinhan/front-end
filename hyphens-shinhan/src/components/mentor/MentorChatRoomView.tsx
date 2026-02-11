'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import { useChatRooms, useMessages, chatKeys } from '@/hooks/chat/useChat';
import { useSendMessage } from '@/hooks/chat/useChatMutations';
import { useChatRealtime } from '@/hooks/chat/useChatRealtime';
import MessageInput from '@/components/common/MessageInput';
import EmptyContent from '@/components/common/EmptyContent';
import GroupChatMessageItem from '@/components/community/group/GroupChatMessageItem';
import { Icon } from '@/components/common/Icon';
import { INPUT_BAR_TYPE } from '@/constants';
import { cn } from '@/utils/cn';
import type { MessageResponse } from '@/types/chat';
import {
  convertMessageToGroupChatMessage,
  formatDateLabel,
  type GroupChatMessage,
} from '@/components/community/group/groupChatUtils';

interface MentorChatRoomViewProps {
  roomId: string;
  backHref: string;
}

export default function MentorChatRoomView({ roomId, backHref }: MentorChatRoomViewProps) {
  const queryClient = useQueryClient();
  const user = useUserStore((s) => s.user);
  const currentUserId = user?.id ?? null;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const isSendingRef = useRef(false);

  const { data: chatRoomsData } = useChatRooms();
  const messageParams = { limit: 50 };
  const { data: messagesData, isLoading: isMessagesLoading } = useMessages(
    roomId,
    messageParams
  );
  const sendMessageMutation = useSendMessage();
  const { sendBroadcast } = useChatRealtime(roomId, {
    params: messageParams,
    currentUserId,
  });

  const room = chatRoomsData?.rooms?.find((r) => r.id === roomId);
  const displayName =
    room?.type === 'GROUP'
      ? room.name ?? '그룹 채팅'
      : room?.members?.find((m) => m.id !== currentUserId)?.name ?? '채팅';

  const messages: GroupChatMessage[] = messagesData?.messages
    ? messagesData.messages
        .map((msg) => convertMessageToGroupChatMessage(msg, currentUserId))
        .reverse()
    : [];

  useEffect(() => {
    if (messages.length === 0) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (
      !message.trim() ||
      !roomId ||
      sendMessageMutation.isPending ||
      isSendingRef.current
    )
      return;

    isSendingRef.current = true;
    const messageToSend = message.trim();

    sendMessageMutation.mutate(
      { roomId, data: { message: messageToSend } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            chatKeys.messages(roomId, messageParams),
            (old: { messages: MessageResponse[]; has_more: boolean } | undefined) => {
              if (!old) return { messages: [data], has_more: false };
              if (old.messages.some((m) => m.id === data.id)) return old;
              return { ...old, messages: [data, ...old.messages] };
            }
          );
          sendBroadcast(data);
          setMessage('');
          isSendingRef.current = false;
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        },
        onError: () => {
          isSendingRef.current = false;
        },
      }
    );
  }, [message, roomId, sendMessageMutation, queryClient, sendBroadcast]);

  if (isMessagesLoading) {
    return (
      <EmptyContent
        variant="loading"
        message="메시지를 불러오는 중..."
      />
    );
  }

  const dateLabel = messages.length > 0 ? formatDateLabel(messages[0].created_at) : '';

  return (
    <div className={styles.container}>
      {/* 뒤로가기 + 제목 */}
      <div className={styles.header}>
        <Link
          href={backHref}
          className="flex items-center gap-2 py-2 pr-4 text-grey-10"
          aria-label="뒤로가기"
        >
          <Icon name="IconLLineArrowLeft" className="size-6" />
          <span className="text-[16px] font-semibold">{displayName}</span>
        </Link>
      </div>

      {/* 메시지 목록 */}
      <div className={styles.messagesContainer}>
        {dateLabel && <p className={styles.dateLabel}>{dateLabel}</p>}
        <div className={styles.messagesList}>
          {messages.length === 0 ? (
            <EmptyContent variant="empty" message="아직 메시지가 없습니다." />
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
  );
}

const styles = {
  container: cn(
    'flex flex-1 flex-col min-h-0 bg-white overflow-hidden pb-20'
  ),
  header: cn('shrink-0 border-b border-grey-2 px-4'),
  messagesContainer: cn('flex-1 min-h-0 overflow-y-auto px-4 pb-4'),
  dateLabel: cn('py-3 text-center text-[14px] font-normal leading-5 text-grey-8'),
  messagesList: cn('flex flex-col gap-5'),
  inputWrapper: cn(
    'flex flex-col fixed bottom-0 left-0 right-0 max-w-md mx-auto',
    'bg-white border-t border-grey-2'
  ),
  inputInner: cn('w-full'),
};
