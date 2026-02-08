'use client'

import { cn } from '@/utils/cn'
import Tab from '@/components/common/Tab'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { ReportMonth } from '@/services/reports'

const ReportDetailRouter = dynamic(
  () => import('@/components/scholarship/reports/ReportDetailRouter'),
  { ssr: true }
)

const MonitoringContent = dynamic(
  () => import('@/components/scholarship/reports/monitoring/MonitoringContent'),
  { ssr: true }
)

export const ACTIVITY_DETAIL_TAB = {
  COUNCIL: '자치회',
  MONITORING: '학업 모니터링',
} as const

export type ActivityDetailTabValue =
  (typeof ACTIVITY_DETAIL_TAB)[keyof typeof ACTIVITY_DETAIL_TAB]

interface ActivityDetailTabsProps {
  year: number
  month: ReportMonth
  councilId?: string
}

/**
 * 활동 상세 화면 탭 (자치회 | 학업 모니터링).
 * URL searchParam `tab`으로 탭 전환, year/month/councilId는 유지.
 */
export default function ActivityDetailTabs({
  year,
  month,
  councilId = '',
}: ActivityDetailTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab =
    (searchParams.get('tab') as ActivityDetailTabValue) ??
    ACTIVITY_DETAIL_TAB.COUNCIL

  const handleTabClick = (tab: ActivityDetailTabValue) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabRow}>
        <Tab
          isActive={activeTab === ACTIVITY_DETAIL_TAB.COUNCIL}
          title={ACTIVITY_DETAIL_TAB.COUNCIL}
          onClick={() => handleTabClick(ACTIVITY_DETAIL_TAB.COUNCIL)}
        />
        <Tab
          isActive={activeTab === ACTIVITY_DETAIL_TAB.MONITORING}
          title={ACTIVITY_DETAIL_TAB.MONITORING}
          onClick={() => handleTabClick(ACTIVITY_DETAIL_TAB.MONITORING)}
        />
      </div>
      <div className={styles.content}>
        {activeTab === ACTIVITY_DETAIL_TAB.COUNCIL && (
          <ReportDetailRouter
            year={year}
            month={month}
            councilId={councilId}
          />
        )}
        {activeTab === ACTIVITY_DETAIL_TAB.MONITORING && (
          <MonitoringContent year={year} month={month} />
        )}
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col h-full'),
  tabRow: cn('flex flex-row gap-[6px] px-4 py-2'),
  content: cn('flex-1 overflow-y-auto scrollbar-hide'),
}
