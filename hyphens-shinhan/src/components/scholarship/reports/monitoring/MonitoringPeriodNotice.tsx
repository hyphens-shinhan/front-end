import { cn } from '@/utils/cn'

interface MonitoringPeriodNoticeProps {
  /** 기간 라벨 (예: "4월 학업 달성 기간은") */
  periodLabel?: string
  /** 기간 범위 (예: "3월 31일부터 4월 29일까지") */
  periodRange?: string
}

const styles = {
  wrapper: cn('px-4'),
  box: cn('text-center px-5.5 py-3 bg-grey-2 rounded-[16px] mb-4'),
  message: cn('font-caption-caption2 text-grey-9'),
  highlight: cn('font-caption-caption1 text-grey-9'),
}

export default function MonitoringPeriodNotice({
  periodLabel,
  periodRange
}: MonitoringPeriodNoticeProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <p className={styles.message}>
          {periodLabel}{' '}
          <span className={styles.highlight}>{periodRange}</span>
          입니다
        </p>
      </div>
    </div>
  )
}
