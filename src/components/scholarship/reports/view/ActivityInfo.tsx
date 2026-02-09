'use client'

import { cn } from '@/utils/cn'
import { formatDateYMD } from '@/utils/date'
import ReportTitle from '../ReportTitle'

interface ActivityInfoProps {
  /** 활동 제목 */
  title: string
  /** 활동 일자 (YYYY-MM-DD) */
  activityDate?: string | null
  /** 장소 */
  location?: string | null
  /** 활동 내용 설명 */
  content?: string | null
}

/** 활동 보고서 상세 - 활동 정보 섹션 (제목, 기간, 설명) */
export default function ActivityInfo({
  title,
  activityDate,
  location,
  content,
}: ActivityInfoProps) {
  const displayDate = activityDate ? formatDateYMD(activityDate) : null

  return (
    <div className={styles.section}>
      <ReportTitle title="활동 정보" className="py-4.5" />
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {displayDate && <time className={styles.date}>{displayDate}</time>}
        {location && <p className={styles.location}>{location}</p>}
        {content && <p className={styles.description}>{content}</p>}
      </div>
    </div>
  )
}

const styles = {
  section: cn('pb-4'),
  sectionTitle: cn('title-16 text-grey-11 py-4.5'),
  card: cn('flex flex-col gap-2.5 p-5 border border-grey-2 rounded-[16px]'),
  cardTitle: cn('body-2 font-bold text-grey-10'),
  date: cn('font-caption-caption2 text-grey-8'),
  location: cn('body-8 text-grey-9'),
  description: cn('body-8 text-grey-11'),
}
