'use client';

import { Icon } from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import { cn } from '@/utils/cn';

/** 태그·문구 스타일 구간 (red / yellow / green) */
type ProgressVariant = 'red' | 'yellow' | 'green';

/** 진행률 구간별 태그·문구 (임시 데이터, 추후 운영 정책으로 교체) */
const PROGRESS_MESSAGE_BY_RANGE: Array<{
  min: number;
  max: number;
  tagLabel: string;
  noticeMessage: string;
  variant: ProgressVariant;
}> = [
    { min: 0, max: 24, tagLabel: '매우 유의', noticeMessage: '장학금 유지가 위험! 지금부터라도 꼭 챙겨주세요', variant: 'red' },
    { min: 25, max: 49, tagLabel: '유의 필요', noticeMessage: '장학금 유지 위험! 조금만 더 신경써주세요', variant: 'red' },
    { min: 50, max: 74, tagLabel: '조금만 더', noticeMessage: '조금만 더 노력하면 유지 요건을 충족할 수 있어요', variant: 'yellow' },
    { min: 75, max: 99, tagLabel: '잘하고 있어요', noticeMessage: '잘 하고 있어요! 마무리만 확인해 주세요', variant: 'green' },
    { min: 100, max: 100, tagLabel: '제출 완료', noticeMessage: '잘 하고 있어요!', variant: 'green' },
  ];

function getProgressMessage(progress: number): {
  tagLabel: string;
  noticeMessage: string;
  variant: ProgressVariant;
} {
  const value = Math.min(100, Math.max(0, progress));
  const found = PROGRESS_MESSAGE_BY_RANGE.find((r) => value >= r.min && value <= r.max);
  return found
    ? { tagLabel: found.tagLabel, noticeMessage: found.noticeMessage, variant: found.variant }
    : { tagLabel: '', noticeMessage: '', variant: 'red' };
}

interface MaintenanceReviewProgressProps {
  /** 상단 캡션 (예: "2025 장학금") */
  yearLabel?: string;
  /** 전체 진행률 0~100 (구간별로 태그·문구 자동 적용) */
  progress: number;
  className?: string;
}

/**
 * 유지심사 현황 상세 - 진행률 블록 (Figma: Frame 1321316461)
 * 상단 제목·태그, 전체 진행률 바, 진행률 구간별 하단 안내 스트립
 */
export default function MaintenanceReviewProgress({
  yearLabel = '2025 장학금',
  progress,
  className,
}: MaintenanceReviewProgressProps) {
  const progressValue = Math.min(100, Math.max(0, progress));
  const { tagLabel, noticeMessage, variant } = getProgressMessage(progressValue);

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.card}>
        {/* 상단: 제목 + 태그 (구간별 색상) */}
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <span className={styles.caption}>{yearLabel}</span>
            <span className={styles.title}>유지심사 현황</span>
          </div>
          {tagLabel !== '' && (
            <div className={cn(styles.tagPill, tagPillByVariant[variant])}>
              <Icon
                name="IconLBoldInfoCircle"
                size={24}
                className={tagIconByVariant[variant]}
              />
              <span className={cn('body-7', tagTextByVariant[variant])}>
                {tagLabel}
              </span>
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

      {noticeMessage !== '' && (
        <div className={styles.noticeStrip}>
          <span
            className={cn('size-2.5 rounded-full shrink-0', noticeDotByVariant[variant])}
            aria-hidden
          />
          <span className={styles.noticeText}>{noticeMessage}</span>
        </div>
      )}
    </div>
  );
}

const tagPillByVariant: Record<ProgressVariant, string> = {
  red: 'bg-state-red-light',
  yellow: 'bg-state-yellow-light',
  green: 'bg-state-green-light',
};

const tagIconByVariant: Record<ProgressVariant, string> = {
  red: 'text-state-red',
  yellow: 'text-state-yellow-dark',
  green: 'text-state-green-dark',
};

const tagTextByVariant: Record<ProgressVariant, string> = {
  red: 'text-state-red',
  yellow: 'text-state-yellow-dark',
  green: 'text-state-green-dark',
};

const noticeDotByVariant: Record<ProgressVariant, string> = {
  red: 'bg-state-red',
  yellow: 'bg-state-yellow-dark',
  green: 'bg-state-green-dark',
};

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
    'pl-2.5 pr-4 py-2 rounded-2xl',
  ),
  progressSection: 'flex flex-col gap-2.5 self-stretch pb-4',
  progressLabelRow: 'flex flex-row justify-between items-end',
  progressLabel: 'body-7 text-grey-9',
  progressValue: 'body-3 text-grey-11',
  bar: 'h-2',
  noticeStrip: cn(
    'flex flex-row items-center gap-2.5 self-stretch',
    'px-6 py-3 bg-grey-2 rounded-b-[16px] border border-grey-2',
  ),
  noticeText: 'body-7 text-grey-9',
} as const;
