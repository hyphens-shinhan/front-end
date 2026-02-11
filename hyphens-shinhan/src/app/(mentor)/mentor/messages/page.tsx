'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import InputBar, { INPUT_BAR_TYPE } from '@/components/common/InputBar';
import { useChatRooms } from '@/hooks/chat/useChat';
import { useUserStore } from '@/stores';
import type { ChatRoomResponse, ChatRoomMember } from '@/types/chat';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export default function MentorMessagesPage() {
  const { data, isLoading, error } = useChatRooms();
  const currentUser = useUserStore((s) => s.user);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const rooms = data?.rooms ?? [];

  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return rooms;
    return rooms.filter((room) => {
      if (room.type === 'GROUP') {
        return room.name?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      const opponent = room.members.find((m) => m.id !== currentUser?.id);
      return opponent?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [rooms, searchTerm, currentUser?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col px-4 pt-3">
        <InputBar type={INPUT_BAR_TYPE.CHAT_SEARCH} />
        <div className="py-10 text-center text-grey-5">채팅 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 pt-3 text-[14px] text-red-500">
        목록을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 pt-3 pb-40">
      <InputBar
        type={INPUT_BAR_TYPE.CHAT_SEARCH}
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
      />
      <div className="mt-2 flex flex-col">
        {filteredRooms.length === 0 ? (
          <p className="py-10 text-center text-grey-5">
            {searchTerm ? '검색 결과가 없습니다.' : '참여 중인 채팅방이 없습니다.'}
          </p>
        ) : (
          filteredRooms.map((room) => (
            <MentorChatRoomItem
              key={room.id}
              room={room}
              currentUserId={currentUser?.id}
              onPress={() => {
                if (room.type === 'GROUP' && room.club_id) {
                  router.push(`/community/group/${room.club_id}/chat`);
                } else {
                  router.push(`${ROUTES.MENTOR_DASHBOARD.MESSAGES}/${room.id}`);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MentorChatRoomItem({
  room,
  currentUserId,
  onPress,
}: {
  room: ChatRoomResponse;
  currentUserId?: string;
  onPress: () => void;
}) {
  let displayName = '';
  let displayImage: string | null = null;

  if (room.type === 'GROUP') {
    displayName = room.name || '알 수 없는 그룹';
    displayImage = room.image_url;
  } else {
    const opponent = room.members.find((m: ChatRoomMember) => m.id !== currentUserId);
    displayName = opponent?.name || '이름 없음';
    displayImage = opponent?.avatar_url ?? null;
  }

  const lastMsg = room.last_message;
  const messageContent = lastMsg?.message
    ? lastMsg.message
    : lastMsg?.file_urls?.length
      ? '사진을 보냈습니다.'
      : '대화 내용이 없습니다.';

  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        'flex w-full flex-row items-center gap-3 px-2 py-4 text-left',
        'hover:bg-grey-1 active:bg-grey-2 transition-colors'
      )}
    >
      <Avatar src={displayImage} size={40} />
      <div className="min-w-0 flex-1">
        <p className="title-16 text-grey-11 truncate">{displayName}</p>
        <p className="body-6 text-grey-10 truncate">{messageContent}</p>
      </div>
      {room.unread_count > 0 && (
        <div className="flex shrink-0 items-center justify-center rounded-full bg-grey-5 px-2 py-1">
          <span className="font-caption-caption3 text-grey-11">
            {room.unread_count > 99 ? '99+' : room.unread_count}
          </span>
        </div>
      )}
    </button>
  );
}
