import Link from 'next/link'
import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import InfoTag from "../common/InfoTag";
import type { ActivityStatusType } from "@/types";

const STATUS_LABEL: Record<ActivityStatusType, { label: string; color: 'blue' | 'green' | 'grey' }> = {
  inProgress: { label: '진행중', color: 'blue' },
  scheduled: { label: '참여 예정', color: 'blue' },
  completed: { label: '완료', color: 'green' },
  beforeStart: { label: '시작전', color: 'grey' },
};

interface ActivityBannerProps {
  title: string
  dateLabel: string
  status: ActivityStatusType
  /** 있으면 클릭 시 해당 URL로 이동 (예: 신한장학재단 이벤트 상세) */
  href?: string
}

/** MY활동 연간 필수 활동, 내가 신청한 프로그램 배너 컴포넌트 */
export default function ActivityBanner({
  title,
  dateLabel,
  status,
  href,
}: ActivityBannerProps) {
  const statusConfig = STATUS_LABEL[status]
  const content = (
    <>
      <div className={styles.infoContainer}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>{title}</p>
          <InfoTag label={statusConfig.label} color={statusConfig.color} />
        </div>
        <time className={styles.date}>{formatDateLabel(dateLabel)}</time>
      </div>
      <span className={styles.button} aria-hidden>
        <Icon name="IconLLineArrowRight" size={24} />
      </span>
    </>
  )
  if (href) {
    return (
      <Link href={href} className={styles.container}>
        {content}
      </Link>
    )
  }
  return <div className={styles.container}>{content}</div>
}

function formatDateLabel(value: string): string {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
  } catch {
    return value;
  }
}

const styles = {
  container: cn(
    'flex items-center',
    'px-5 py-4',
    'border border-grey-2 rounded-[16px]',
  ),
  infoContainer: cn(
    'flex flex-col gap-1',
  ),
  titleContainer: cn(
    'flex gap-[9px]',
  ),
  title: cn(
    'body-5 text-grey-11 line-clamp-1',
  ),
  statusContainer: cn(
    'mb-auto',
  ),
  button: cn(
    'flex ml-auto items-center justify-center text-grey-9',
  ),
  date: cn(
    'font-caption-caption4 text-grey-9',
  ),
};