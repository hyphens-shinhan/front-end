'use client';

import Link from 'next/link';
import { Icon, type IconName } from '@/components/common/Icon';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

export interface ShortcutMenuItem {
  label: string;
  icon: IconName;
  href: string;
}

/** 홈 화면 바로가기 메뉴 기본 아이템 
 * TODO: 멘토, 지도, 팔로우 경로 체크 필요
 */
const DEFAULT_SHORTCUT_ITEMS: ShortcutMenuItem[] = [
  { label: '멘토', icon: 'IconLBoldBriefcase', href: `${ROUTES.NETWORK.MAIN}?tab=mentors` },
  { label: '공지사항', icon: 'IconLBoldNote', href: ROUTES.COMMUNITY.NOTICE.MAIN },
  { label: '지도', icon: 'IconLBoldMap', href: ROUTES.NETWORK.MAIN }, // TODO: 지도 탭 추가 필요
  { label: '팔로우', icon: 'IconLBoldProfile2user', href: `${ROUTES.NETWORK.MAIN}?tab=friends` },
];

interface ShortcutMenuListProps {
  items?: ShortcutMenuItem[];
  className?: string;
}

/**
 * 홈 화면 바로가기 메뉴 리스트
 */
export default function ShortcutMenuList({
  items = DEFAULT_SHORTCUT_ITEMS,
  className,
}: ShortcutMenuListProps) {
  return (
    <ul className={cn(styles.list, className)} role="list">
      {items.map((item: ShortcutMenuItem) => (
        <li key={item.label} className={styles.item}>
          <Link
            href={item.href}
            className={styles.link}
            aria-label={item.label}
          >
            <Icon name={item.icon} size={24} className='text-primary-shinhanblue' />
          </Link>
          <span className={styles.label}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

const styles = {
  list: 'flex flex-wrap items-center justify-center gap-9',
  item: 'flex flex-col items-center gap-2',
  link: 'flex flex-shrink-0 items-center justify-center rounded-xl bg-primary-lighter p-3.5 transition-[transform,opacity] active:scale-[0.98] active:opacity-90',
  label: 'text-center font-caption-caption1 text-grey-10',
} as const;