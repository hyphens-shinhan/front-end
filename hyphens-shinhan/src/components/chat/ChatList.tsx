'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../common/Avatar";
import InputBar, { INPUT_BAR_TYPE } from "../common/InputBar";
import { useChatRooms } from "@/hooks/chat/useChat";
import { ChatRoomResponse, ChatRoomMember } from "@/types/chat";
import { useUserStore } from "@/stores";

export default function ChatList() {
  const { data, isLoading, error } = useChatRooms();
  const currentUser = useUserStore((s) => s.user);

  // 1. 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  const rooms = data?.rooms || [];

  // 2. 검색 로직 (방 이름 또는 상대방 이름 기준 필터링)
  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return rooms;

    return rooms.filter((room) => {
      if (room.type === 'GROUP') {
        // 그룹 채팅은 클럽 이름으로 검색
        return room.name?.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        // DM은 상대방 이름으로 검색
        const opponent = room.members.find((m) => m.id !== currentUser?.id);
        return opponent?.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [rooms, searchTerm, currentUser?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col px-4 pt-3">
        <InputBar type={INPUT_BAR_TYPE.CHAT_SEARCH} />
        <div className="py-10 text-center text-grey-9">채팅 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return <div className="px-4 pt-3 text-red-500">목록을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col px-4 pt-3 pb-40">
      {/** 대화 상대 검색하기 - value와 onChange 연결 */}
      <InputBar
        type={INPUT_BAR_TYPE.CHAT_SEARCH}
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
      />

      {/** 대화 목록 */}
      <div className="flex flex-col mt-2">
        {filteredRooms.length === 0 ? (
          <p className="text-center text-grey-9 py-10">
            {searchTerm ? "검색 결과가 없습니다." : "참여 중인 채팅방이 없습니다."}
          </p>
        ) : (
          filteredRooms.map((room) => (
            <ChatRoomItem key={room.id} room={room} currentUserId={currentUser?.id} />
          ))
        )}
      </div>
    </div>
  );
}

/** 채팅방 개별 아이템 컴포넌트 */
function ChatRoomItem({ room, currentUserId }: { room: ChatRoomResponse; currentUserId?: string }) {
  const router = useRouter();

  let displayName = "";
  let displayImage: string | null = null;
  let targetHref = "";

  if (room.type === 'GROUP') {
    displayName = room.name || "알 수 없는 그룹";
    displayImage = room.image_url;
    targetHref = `/community/group/${room.club_id || room.id}/chat`;
  } else {
    const opponent = room.members.find((member: ChatRoomMember) => member.id !== currentUserId);
    displayName = opponent?.name || "이름 없음";
    displayImage = opponent?.avatar_url || null;
    targetHref = `/chat/${opponent?.id || ''}`;
  }

  const lastMsg = room.last_message;
  const messageContent = lastMsg?.message
    ? lastMsg.message
    : (lastMsg?.file_urls && lastMsg.file_urls.length > 0 ? "사진을 보냈습니다." : "대화 내용이 없습니다.");

  return (
    <div
      onClick={() => router.push(targetHref)}
      className="flex flex-row items-center gap-3 px-2 py-4 cursor-pointer hover:bg-grey-1 active:bg-grey-2 transition-colors"
    >
      <Avatar src={displayImage} size={40} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="title-16 text-grey-11 truncate">{displayName}</p>
        </div>
        <p className="body-6 text-grey-10 truncate">{messageContent}</p>
      </div>
      {/* <span className="text-[10px] text-grey-8">
                {formatChatTime(lastMsg.sent_at)}
              </span> */}
      {room.unread_count > 0 && (
        <div className="flex items-center justify-center bg-grey-5 rounded-full px-2 py-1 my-auto">
          <span className="font-caption-caption3 text-grey-11">
            {room.unread_count > 99 ? '99+' : room.unread_count}
          </span>
        </div>
      )}
    </div>
  );
}

/** 시간 포맷팅 함수 */
function formatChatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return '어제';
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}