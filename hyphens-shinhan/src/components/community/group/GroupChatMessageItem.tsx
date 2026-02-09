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
  const showAvatar =
    !message.is_own &&
    message.sender_avatar &&
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
      <div
        className={cn(
          styles.messageContent,
          message.is_own ? styles.messageContentOwn : styles.messageContentOther
        )}
      >
        {!message.is_own && showAvatar && message.sender_name && (
          <span className={styles.senderName}>{message.sender_name}</span>
        )}
        <div
          className={cn(
            styles.messageRow,
            message.is_own ? styles.messageRowOwn : styles.messageRowOther
          )}
        >
          {message.is_own && (
            <span className={styles.messageTime}>
              {formatMessageTime(message.created_at)}
            </span>
          )}
          <div
            className={cn(
              styles.messageBubble,
              message.is_own ? styles.messageBubbleOwn : styles.messageBubbleOther
            )}
          >
            <p className={styles.messageText}>{message.content}</p>
          </div>
          {!message.is_own && (
            <span className={styles.messageTime}>
              {formatMessageTime(message.created_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  messageItem: cn('flex gap-2'),
  messageItemOwn: cn('justify-end'),
  messageItemOther: cn('justify-start'),
  avatar: cn('shrink-0'),
  avatarPlaceholder: cn('w-[38px] shrink-0'),
  messageContent: cn('flex flex-col'),
  messageContentOwn: cn('items-end'),
  messageContentOther: cn('items-start'),
  senderName: cn('mb-1 px-2 text-[12px] font-normal leading-[14px] text-grey-8'),
  messageRow: cn('flex items-end gap-1'),
  messageRowOwn: cn('flex-row'),
  messageRowOther: cn('flex-row'),
  messageBubble: cn('max-w-[85%] rounded-[16px] px-4 py-3'),
  messageBubbleOwn: cn('bg-primary-lighter text-grey-11'),
  messageBubbleOther: cn('bg-grey-2 text-black'),
  messageText: cn('text-[16px] font-normal leading-[22px] whitespace-pre-wrap'),
  messageTime: cn('shrink-0 text-[12px] font-normal leading-[14px] text-grey-8'),
}
