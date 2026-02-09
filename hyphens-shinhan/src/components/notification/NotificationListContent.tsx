'use client';

import { Icon } from '@/components/common/Icon';
import Separator from '@/components/common/Separator';
import { cn } from '@/utils/cn';
import type { NotificationItem } from '@/types/notification';

export interface NotificationListContentProps {
  items: NotificationItem[];
}

/** 알림 목록 뷰 - 제목/본문/날짜·시간, 미읽음 배경 강조 */
export default function NotificationListContent({ items }: NotificationListContentProps) {
  return (
    <div className={styles.wrapper}>
      {items.map((item, index) => (
        <div key={item.id}>
          <div
            className={cn(
              styles.row,
              item.unread && styles.rowUnread,
            )}
          >
            <div className={styles.iconWrap}>
              <Icon
                name={item.icon}
                className={item.unread ? styles.iconUnread : styles.iconRead}
              />
            </div>
            <div className={styles.textBlock}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.body}>{item.body}</p>
              <div className={styles.meta}>
                <span>{item.date}</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
          {index < items.length - 1 && (
            <Separator className="mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: 'flex flex-col',
  row: cn(
    'flex items-center gap-5',
    'px-5 py-4',
  ),
  rowUnread: 'bg-primary-lighter/50',
  iconWrap: cn(
    'flex shrink-0 items-center justify-center',
    'w-[41px] h-[41px] rounded-full bg-grey-1-1',
  ),
  iconUnread: 'text-primary-light',
  iconRead: 'text-grey-7',
  textBlock: 'flex min-w-0 flex-1 flex-col gap-2',
  title: 'title-16 text-grey-11',
  body: 'body-6 text-grey-11 line-clamp-2',
  meta: cn(
    'flex items-center gap-1.5',
    'font-caption-caption4 text-grey-8',
  ),
} as const;
