'use client';

import { Icon, type IconName } from '@/components/common/Icon';
import { Skeleton } from '@/components/common/Skeleton';
import { cn } from '@/utils/cn';

/** 한 항목: 라벨 + 값 + 옆에 info 또는 tick 아이콘 */
export interface MaintenanceReviewSummaryItem {
  /** 항목 라벨 (예: GPA, 봉사) */
  label: string;
  /** 표시 값 (예: 2.8 / 4.5, 21 / 21시간) */
  value: string;
  /** 왼쪽 아이콘 (Figma: Icon-M/Bold) */
  icon: IconName;
  /** 오른쪽 힌트: 'info' | 'tick' (info-circle 또는 tick-circle) */
  hint: 'info' | 'tick';
}

interface MaintenanceReviewSummaryProps {
  /** API 로딩 중이면 undefined, 데이터 없으면 [], 있으면 4항목 */
  items?: MaintenanceReviewSummaryItem[];
  className?: string;
}

const SUMMARY_SKELETON_COUNT = 4;

/**
 * 홈 화면 유지 심사 현황 정보 요약 카드
 * - items undefined: 로딩 스켈레톤
 * - items []: 미렌더
 * - items 있음: 2x2 그리드 표시
 */
export default function MaintenanceReviewSummary({
  items,
  className,
}: MaintenanceReviewSummaryProps) {
  if (items === undefined) {
    return (
      <div className={cn(styles.card, className)}>
        <div className={styles.grid}>
          {Array.from({ length: SUMMARY_SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.row}>
                <Skeleton.Box className="size-5 shrink-0 rounded" />
                <Skeleton.Box className="h-5 w-12 rounded" />
              </div>
              <div className={styles.valueRow}>
                <Skeleton.Box className="h-5 w-24 rounded" />
                <Skeleton.Box className="size-5 shrink-0 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.label} className={styles.item}>
            <div className={styles.row}>
              <span className={styles.iconWrap}>
                <Icon name={item.icon} size={20} className={styles.icon} />
              </span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <div className={styles.valueRow}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.iconWrap}>
                <Icon
                  name={
                    item.hint === 'tick'
                      ? 'IconLLineTickCircle'
                      : 'IconLLineInfoCircle'
                  }
                  size={20}
                  className={
                    item.hint === 'tick'
                      ? styles.hintIconTick
                      : styles.hintIconInfo
                  }
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const styles = {
  card: 'w-full rounded-[16px] border border-grey-2 bg-white p-6',
  grid: 'grid grid-cols-2  gap-y-7',
  item: 'flex flex-col gap-1.5',
  row: 'flex flex-row items-center gap-2',
  label: 'body-5 text-grey-9',
  valueRow: 'flex flex-row items-center gap-2',
  value: 'body-6 text-grey-11',
  iconWrap: 'flex shrink-0',
  icon: 'text-grey-8',
  hintIconTick: 'text-state-green',
  hintIconInfo: 'text-state-yellow-dark',
} as const;