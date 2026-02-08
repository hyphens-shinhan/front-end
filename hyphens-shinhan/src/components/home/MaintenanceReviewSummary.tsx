'use client';

import { Icon, type IconName } from '@/components/common/Icon';
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
  /** 없으면 Figma 기본 4항목 사용 */
  items?: MaintenanceReviewSummaryItem[];
  className?: string;
}

/** 기본 4항목: GPA, 봉사, 이수학점, 행사 */
export const DEFAULT_SUMMARY_ITEMS: MaintenanceReviewSummaryItem[] = [
  { label: 'GPA', value: '2.8 / 4.5', icon: 'IconMBoldBookmark', hint: 'info' },
  { label: '이수학점', value: '18 / 15학점', icon: 'IconMBoldMedalStar', hint: 'tick' },
  { label: '봉사', value: '21 / 21시간', icon: 'IconMBoldMenuBoard', hint: 'tick' },
  { label: '행사', value: '7 / 8개', icon: 'IconMBoldCalendar', hint: 'info' },
];

/**
 * 홈 화면 유지 심사 현황 정보 요약 카드
 */
export default function MaintenanceReviewSummary({
  items = DEFAULT_SUMMARY_ITEMS,
  className,
}: MaintenanceReviewSummaryProps) {
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
  hintIconTick: 'text-state-yellow-dark',
  hintIconInfo: 'text-state-green',
} as const;