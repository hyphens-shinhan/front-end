'use client'

import { useMemo } from 'react'
import { cn } from '@/utils/cn'
import Tab from '@/components/common/Tab'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { ReportMonth } from '@/services/reports'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'

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
/**
 * activities API의 해당 연도 요약에서 학업 모니터링 탭 노출 여부 결정.
 * academic_is_monitored === true 이면 학업 모니터링 탭 표시.
 */
export default function ActivityDetailTabs({
  year,
  month,
  councilId = '',
}: ActivityDetailTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: activitiesData } = useActivitiesSummary()

  const showMonitoringTab = useMemo(() => {
    const yearlySummary = activitiesData?.years?.find((y) => y.year === year)
    return yearlySummary?.academic_is_monitored === true
  }, [activitiesData?.years, year])

  const tabFromUrl = searchParams.get('tab') as ActivityDetailTabValue | null
  const activeTab =
    tabFromUrl === ACTIVITY_DETAIL_TAB.MONITORING && !showMonitoringTab
      ? ACTIVITY_DETAIL_TAB.COUNCIL
      : tabFromUrl ?? ACTIVITY_DETAIL_TAB.COUNCIL

  const handleTabClick = (tab: ActivityDetailTabValue) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className={styles.container}>
      {showMonitoringTab && (
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
      )}
      <div className={styles.content}>
        {activeTab === ACTIVITY_DETAIL_TAB.COUNCIL && (
          <ReportDetailRouter
            year={year}
            month={month}
            councilId={councilId}
          />
        )}
        {showMonitoringTab && activeTab === ACTIVITY_DETAIL_TAB.MONITORING && (
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
