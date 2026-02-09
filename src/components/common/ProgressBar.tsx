'use client'

import { cn } from '@/utils/cn'

interface ProgressBarProps {
  /** 현재 값 (예: 확인 완료 수) */
  value: number
  /** 최대값 (예: 전체 수). 0이면 퍼센트 0 */
  max: number
  /** 트랙(배경)에 줄 추가 클래스 */
  className?: string
}

/**
 * 진행률 바 (접근성: role="progressbar", aria-valuenow/min/max)
 * 채워진 비율 = value / max (max > 0일 때)
 */
export default function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0

  return (
    <div
      className={cn(styles.track, className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={styles.fill}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const styles = {
  /** 진행 바 배경(트랙) */
  track: cn('w-full h-2 rounded-[16px] bg-grey-2 overflow-hidden'),
  /** 진행 바 채워진 부분 - primary 색상 */
  fill: cn('h-full rounded-[16px] bg-primary-secondaryroyal'),
}
