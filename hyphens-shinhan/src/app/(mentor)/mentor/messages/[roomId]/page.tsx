'use client';

import { useParams } from 'next/navigation';
import MentorChatRoomView from '@/components/mentor/MentorChatRoomView';
import { ROUTES } from '@/constants';
import EmptyContent from '@/components/common/EmptyContent';
import { EMPTY_CONTENT_MESSAGES } from '@/constants';

export default function MentorMessagesRoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;

  if (!roomId) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
      />
    );
  }

  return (
    <MentorChatRoomView
      roomId={roomId}
      backHref={ROUTES.MENTOR_DASHBOARD.MESSAGES}
    />
  );
}
