'use client'

import { cn } from '@/utils/cn'
import Avatar from '@/components/common/Avatar'
import type { GroupChatMessage } from './groupChatUtils'
import { formatMessageTime } from './groupChatUtils'

interface GroupChatMessageItemProps {
  message: GroupChatMessage
  prevMessage: GroupChatMessage | null
}

export default function GroupChatMessageItem({
  message,
  prevMessage,
}: GroupChatMessageItemProps) {
  /** 상대 메시지에서 아바타를 표시할지 (같은 발신자 연속 시에는 한 번만) */
  const showAvatar =
    !message.is_own &&
    (!prevMessage || prevMessage.sender_id !== message.sender_id || prevMessage.is_own)

  return (
    <div
      className={cn(
        styles.messageItem,
        message.is_own ? styles.messageItemOwn : styles.messageItemOther
      )}
    >
      {!message.is_own && showAvatar && (
        <Avatar
          src={message.sender_avatar}
          alt={message.sender_name || '프로필'}
          size={38}
          containerClassName={styles.avatar}
        />
      )}
      {!message.is_own && !showAvatar && <div className={styles.avatarPlaceholder} />}
      {message.is_own ? (
        <>
          <span className={styles.messageTime}>
            {formatMessageTime(message.created_at)}
          </span>
          <div
            className={cn(
              styles.messageBubble,
              styles.messageBubbleOwn
            )}
          >
            <p className={styles.messageText}>{message.content}</p>
          </div>
        </>
      ) : (
        <div
          className={cn(
            styles.messageContent,
            styles.messageContentOther
          )}
        >
          {showAvatar && message.sender_name && (
            <span className={styles.senderName}>{message.sender_name}</span>
          )}
          <div
            className={cn(
              styles.messageRow,
              styles.messageRowOther
            )}
          >
            <div
              className={cn(
                styles.messageBubble,
                styles.messageBubbleOther
              )}
            >
              <p className={styles.messageText}>{message.content}</p>
            </div>
            <span className={styles.messageTime}>
              {formatMessageTime(message.created_at)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  messageItem: cn('flex gap-2'),
  messageItemOwn: cn('justify-end'),
  messageItemOther: cn('justify-start'),
  avatar: cn('h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full'),
  avatarPlaceholder: cn('h-[38px] w-[38px] shrink-0'),
  messageContent: cn('flex flex-1 min-w-0 flex-col'),
  messageContentOwn: cn('items-end'),
  messageContentOther: cn('items-start'),
  senderName: cn('mb-1 px-2 text-[12px] font-normal leading-[14px] text-grey-8'),
  messageRow: cn('flex items-end gap-1 min-w-0'),
  messageRowOwn: cn('flex-row'),
  messageRowOther: cn('flex-row'),
  messageBubble: cn('max-w-[85%] min-w-0 rounded-[16px] px-4 py-3'),
  messageBubbleOwn: cn('bg-primary-lighter text-grey-11'),
  messageBubbleOther: cn('bg-grey-2 text-black'),
  messageText: cn('text-[16px] font-normal leading-[22px] whitespace-pre-wrap break-words overflow-hidden'),
  messageTime: cn('shrink-0 text-[12px] font-normal leading-[14px] text-grey-8 self-end'),
}
