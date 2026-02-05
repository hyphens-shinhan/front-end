import { cn } from "@/utils/cn";
import StatusTag from "../common/StatusTag";
import { Icon } from "../common/Icon";
import Link from "next/link";
import { ROUTES } from "@/constants";
import type { ActivityStatusType } from "@/types";

interface ActivityCardProps {
  isCurrentMonth: boolean
  isMonitoring: boolean
  /** 연도 (상세 링크 쿼리용) */
  year: number
  /** 월 (4–12) */
  month: number
  /** 카드 제목 (자치회 보고서 제목 등) */
  title?: string | null
  /** 진행 상태 (진행중/완료/시작전 등) */
  status?: ActivityStatusType
}

/** MY활동 월별 활동 카드 컴포넌트
 * 월, 학업 모니터링 태그, 월별 title, 상태 태그
 */
export default function ActivityCard({
  isCurrentMonth,
  isMonitoring,
  year,
  month,
  title = '',
  status = 'beforeStart',
}: ActivityCardProps) {
  const href = `${ROUTES.SCHOLARSHIP.REPORT.ACTIVITY}?year=${year}&month=${month}`

  return (
    <Link href={href} className={cn(styles.container, isCurrentMonth && styles.currentMonth)}>
      <div className={styles.infoContainer}>
        <p className={styles.month}>{month}월</p>
        {isMonitoring && (
          <div className={styles.monitoringTag}>
            <Icon name="IconLLineInfoCircle" size={20} />
          </div>
        )}
      </div>
      <p className={styles.title}>{title ?? '활동'}</p>
      <StatusTag status={status} />
    </Link>
  )
}

const styles = {
  container: cn(
    'flex w-full aspect-square flex-col justify-between',
    'p-3',
    'bg-grey-1-1 rounded-[16px]',
    'border border-grey-2',
  ),
  infoContainer: cn(
    'flex items-center gap-1.5',
  ),
  currentMonth: cn(
    'bg-grey-1 border-primary-lighter',
  ),
  month: cn('body-1 text-grey-11'),
  title: cn('body-9 text-grey-9 line-clamp-1'),
  monitoringTag: cn(
    'flex items-center gap-1',
    'text-state-yellow',
  ),
};