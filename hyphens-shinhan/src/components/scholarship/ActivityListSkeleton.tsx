'use client'

import { cn } from '@/utils/cn'
import { Skeleton } from '@/components/common/Skeleton'

/** MY활동(장학) 목록 로딩 스켈레톤 - YearSelector + 월별 카드 그리드 + 연간 필수/신청 프로그램 섹션 */
export default function ActivityListSkeleton() {
  return (
    <Skeleton.Container className={styles.container}>

      {/* 월별 카드 그리드 (3x3) */}
      <div className={styles.cardGrid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton.Box key={i} className="w-full aspect-square rounded-[16px]" />
        ))}
      </div>

      <div className={styles.space} />

      {/* 연간 필수 활동 */}
      <div className={styles.section}>
        <Skeleton.Box className="w-32 h-6 rounded" />
        <div className={styles.sectionList}>
          <Skeleton.Box className="w-full h-14 rounded-xl" />
          <Skeleton.Box className="w-full h-14 rounded-xl" />
        </div>
      </div>

      <div className={styles.space2} />

      {/* 내가 신청한 프로그램 */}
      <div className={styles.section}>
        <Skeleton.Box className="w-40 h-6 rounded" />
        <div className={styles.sectionList}>
          <Skeleton.Box className="w-full h-14 rounded-xl" />
        </div>
      </div>
    </Skeleton.Container>
  )
}

const styles = {
  container: cn('flex flex-col pb-40'),
  yearRow: cn('flex items-center justify-center gap-10 py-2'),
  cardGrid: cn('grid grid-cols-3 gap-[10px] px-[21px] py-5'),
  space: cn('h-20'),
  space2: cn('h-13'),
  section: cn('flex flex-col gap-3 px-4'),
  sectionList: cn('flex flex-col gap-2'),
}
