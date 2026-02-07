'use client';

import MaintenanceReviewShortcut from '@/components/home/MaintenanceReviewShortcut';
import MaintenanceReviewSummary from '@/components/home/MaintenanceReviewSummary';
import ShortcutMenuList from '@/components/home/ShortcutMenuList';
import { cn } from '@/utils/cn';

const styles = {
  card: 'flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-white pt-9 pb-20',
  shortcut: 'mt-7',
  summaryWrap: 'px-4',
} as const;

interface HomeContentCardProps {
  /** 유지심사 바로가기 태그 (없으면 미표시) */
  tagLabel?: string;
  className?: string;
}

/** 홈 탭 메인 콘텐츠를 담는 흰색 카드 영역 (상단만 둥근 모서리) */
export default function HomeContentCard({
  tagLabel = '유의 필요',
  className,
}: HomeContentCardProps) {
  return (
    <div className={cn(styles.card, className)}>
      <ShortcutMenuList />
      <MaintenanceReviewShortcut tagLabel={tagLabel} className={styles.shortcut} />
      <div className={styles.summaryWrap}>
        <MaintenanceReviewSummary />
      </div>
    </div>
  );
}
