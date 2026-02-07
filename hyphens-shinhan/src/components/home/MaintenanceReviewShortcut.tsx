'use client';

import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import InfoTag from '@/components/common/InfoTag';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

interface MaintenanceReviewShortcutProps {
  /** 유지심사 상태 태그 (예: '유의 필요'). 없으면 태그 미표시 */
  tagLabel?: string;
  /** 이동 경로. 기본: MY활동(장학) 메인 */
  href?: string;
  className?: string;
}

/**
 * 홈 화면 '나의 유지심사 현황' 바로가기 버튼
 * Figma: Frame 1321316146 - 타이틀 + 옵션 태그 + 화살표
 */
export default function MaintenanceReviewShortcut({
  tagLabel,
  href = ROUTES.SCHOLARSHIP.MAIN,
  className,
}: MaintenanceReviewShortcutProps) {
  return (
    <Link
      href={href}
      className={cn(styles.link, className)}
      aria-label="나의 유지심사 현황 자세히 보기"
    >
      <div className={styles.left}>
        <span className={styles.title}>나의 유지심사 현황</span>
        {tagLabel != null && tagLabel !== '' && (
          <InfoTag label={tagLabel} color="red" />
        )}
      </div>
      <Icon
        name="IconLLineArrowRight"
        size={24}
        className={styles.icon}
      />
    </Link>
  );
}

const styles = {
  link: 'flex w-full flex-row items-center justify-between gap-4 px-4 py-3',
  left: 'flex flex-row items-center gap-2',
  title: 'title-16 text-grey-10',
  icon: 'text-grey-8',
} as const;