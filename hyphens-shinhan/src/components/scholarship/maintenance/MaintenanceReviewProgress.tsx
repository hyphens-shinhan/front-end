'use client';

import { Icon } from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import { cn } from '@/utils/cn';

interface MaintenanceReviewProgressProps {
  /** 상단 캡션 (예: "2025 장학금") */
  yearLabel?: string;
  /** 우측 경고 태그 (있을 때만 빨간 pill 표시, 예: "유의 필요") */
  tagLabel?: string;
  /** 전체 진행률 0~100 */
  progress: number;
  /** 하단 안내 문구 (있을 때만 회색 바 + 빨간 점 + 문구 표시) */
  noticeMessage?: string;
  className?: string;
}

/**
 * 유지심사 현황 상세 - 진행률 블록 (Figma: Frame 1321316461)
 * 상단 제목·태그, 전체 진행률 바, 선택적 하단 안내 스트립
 */
export default function MaintenanceReviewProgress({
  yearLabel = '2025 장학금',
  tagLabel,
  progress,
  noticeMessage,
  className,
}: MaintenanceReviewProgressProps) {
  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.card}>
        {/* 상단: 제목 + 태그 */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <span className={styles.caption}>{yearLabel}</span>
            <span className={styles.title}>유지심사 현황</span>
          </div>
          {tagLabel != null && tagLabel !== '' && (
            <div className={styles.tagPill}>
              <Icon
                name="IconLBoldInfoCircle"
                size={24}
                className={styles.tagIcon}
              />
              <span className={styles.tagText}>{tagLabel}</span>
            </div>
          )}
        </div>

        {/* 전체 진행률 */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabelRow}>
            <span className={styles.progressLabel}>전체 진행률</span>
            <span className={styles.progressValue}>{progressValue}%</span>
          </div>
          <ProgressBar value={progressValue} max={100} className={styles.bar} />
        </div>
      </div>

      {noticeMessage != null && noticeMessage !== '' && (
        <div className={styles.noticeStrip}>
          <span className={styles.noticeDot} aria-hidden />
          <span className={styles.noticeText}>{noticeMessage}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: 'flex flex-col items-center w-full pt-3 pb-5 px-4',
  card: cn(
    'flex flex-col gap-6 self-stretch',
    'px-6 pt-6 border border-grey-2 rounded-t-[16px]',
  ),
  headerRow: 'flex flex-row justify-between items-center gap-4',
  titleBlock: 'flex flex-col gap-1.5',
  caption: 'body-7 text-grey-9',
  title: 'title-20 text-grey-11',
  tagPill: cn(
    'flex flex-row items-center gap-1.5 shrink-0',
    'px-2.5 py-2 rounded-2xl bg-state-red-light',
  ),
  tagIcon: 'text-white',
  tagText: 'body-7 text-state-red',
  progressSection: 'flex flex-col gap-2.5 self-stretch pb-4',
  progressLabelRow: 'flex flex-row justify-between items-end',
  progressLabel: 'body-7 text-grey-9',
  progressValue: 'body-3 text-grey-11',
  bar: 'h-2',
  noticeStrip: cn(
    'flex flex-row items-center gap-2.5 self-stretch',
    'px-6 py-3 bg-grey-2 rounded-b-[16px] border border-grey-2',
  ),
  noticeDot: 'size-2.5 rounded-full bg-state-red shrink-0',
  noticeText: 'body-7 text-grey-9',
} as const;
