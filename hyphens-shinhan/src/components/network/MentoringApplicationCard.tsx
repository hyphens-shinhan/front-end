'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

/** 멘토링 신청/내역 카드 */
export default function MentoringApplicationCard() {
  const router = useRouter()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>멘토링 신청하기</h3>
          <p className={styles.subtitle}>OB선배, 전문 멘토님과의 멘토링</p>
        </div>
        <Button
          label="신청하기"
          size="S"
          type="primary"
          className="px-2.5"
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
        />
      </div>
      <button
        type="button"
        onClick={() => router.push(ROUTES.MENTORS.HISTORY)}
        className={styles.historyButton}
      >
        <span className={styles.historyLabel}>나의 멘토링 내역</span>
        <Icon name="IconLLineArrowRight" size={20} className={styles.historyIcon} />
      </button>
    </div>
  )
}

const styles = {
  card: cn('bg-white rounded-[16px] border border-grey-2 shadow-none px-4 py-4.5 mt-3'),
  header: cn('flex items-center justify-between gap-9 mb-2.5'),
  titleBlock: cn('flex flex-col gap-1.5'),
  title: cn('title-16 text-grey-11'),
  subtitle: cn('body-8 text-grey-9'),
  historyButton: cn(
    'w-full flex items-center justify-between bg-grey-2 rounded-[16px] px-4 py-3.5 hover:bg-grey-3 transition-colors active:scale-96',
  ),
  historyLabel: cn('body-5 text-grey-10'),
  historyIcon: cn('text-grey-5'),
}
