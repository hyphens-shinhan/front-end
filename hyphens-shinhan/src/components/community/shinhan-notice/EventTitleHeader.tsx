import { cn } from "@/utils/cn";
import InfoTag from "@/components/common/InfoTag";
import { EventStatus } from "@/types/posts";

function getStatusInfo(status?: EventStatus | null) {
  switch (status) {
    case EventStatus.OPEN:
      return { label: '모집중', color: 'green' as const };
    case EventStatus.CLOSED:
      return { label: '종료', color: 'grey' as const };
    case EventStatus.SCHEDULED:
      return { label: '예정', color: 'blue' as const };
    default:
      return { label: '모집중', color: 'green' as const };
  }
}

interface EventTitleHeaderProps {
  /** 이벤트 카테고리 */
  event_category?: string | null;
  /** 이벤트 진행 상태 */
  event_status?: EventStatus | null;
  /** 제목 */
  title: string;
  /** 카드용(제목 말줄임, gap 16px) / 상세용(전체, gap 12px) */
  variant?: 'card' | 'detail';
  /** 상세용 추가 정보 (D-day 등) - variant="detail"일 때 제목 아래에 표시 */
  extra?: React.ReactNode;
  className?: string;
}

/** 이벤트 태그 + 제목 (목록/상세 공통, NoticeTitleHeader와 동일 패턴) */
export default function EventTitleHeader({
  event_category,
  event_status,
  title,
  variant = 'card',
  extra,
  className,
}: EventTitleHeaderProps) {
  const statusInfo = getStatusInfo(event_status);
  const isCard = variant === 'card';

  return (
    <header
      className={cn(
        styles.container,
        isCard ? styles.containerCard : styles.containerDetail,
        className
      )}
    >
      <div className={styles.tagContainer}>
        {event_category && <InfoTag label={event_category} color="blue" />}
        <InfoTag label={statusInfo.label} color={statusInfo.color} />
      </div>

      <p className={cn(styles.title, isCard && styles.titleCard)}>{title}</p>

      {!isCard && extra != null && <div className={styles.extra}>{extra}</div>}
    </header>
  );
}

const styles = {
  container: cn('flex flex-col'),
  /** 리스트(카드): gap 16px */
  containerCard: cn('gap-4'),
  /** 상세: gap 12px */
  containerDetail: cn('gap-3'),
  tagContainer: cn('flex gap-1.5'),
  title: cn('title-18 text-grey-11'),
  titleCard: cn('line-clamp-1 truncate'),
  extra: cn('flex flex-col gap-1'),
};
