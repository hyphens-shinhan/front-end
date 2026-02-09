import { cn } from '@/utils/cn'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import ActivityBanner from './ActivityBanner'
import type { ActivityStatusType } from '@/types'

export type ActivityFormItem = {
  id: string
  title: string
  dateLabel: string
  status: ActivityStatusType
  /** 연간 필수 활동일 때만: GOAL | SIMPLE_REPORT | URL_REDIRECT */
  activity_type?: string
}

interface ActivityFormProps {
  title: string
  /** 연간 필수 활동 / 내가 신청한 프로그램 목록. 비어 있으면 EmptyContent 표시 */
  items?: ActivityFormItem[]
  /** 빈 상태 메시지 키 (EMPTY_CONTENT_MESSAGES.EMPTY 내 키) */
  emptyMessageKey: keyof typeof EMPTY_CONTENT_MESSAGES.EMPTY
  /** 항목 클릭 시 이동할 href (예: 내가 신청한 프로그램 → 이벤트 상세) */
  getItemHref?: (item: ActivityFormItem) => string | undefined
}

export default function ActivityForm({
  title,
  items = [],
  emptyMessageKey,
  getItemHref,
}: ActivityFormProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {items.length > 0 ? (
        items.map((item) => (
          <ActivityBanner
            key={item.id}
            title={item.title}
            dateLabel={item.dateLabel}
            status={item.status}
            href={getItemHref?.(item)}
          />
        ))
      ) : (
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY[emptyMessageKey]}
          className="py-8"
        />
      )}
    </div>
  )
}

const styles = {
    container: cn(
        'flex flex-col gap-3 px-4',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
};