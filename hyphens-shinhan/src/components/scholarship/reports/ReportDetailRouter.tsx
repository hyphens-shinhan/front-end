'use client'

import { useMemo } from 'react'
import { useUserStore } from '@/stores'
import { useReport } from '@/hooks/reports/useReports'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import type { ReportMonth } from '@/services/reports'
import ReportDetailContentYB from './ReportDetailContentYB'
import ReportDetailContentYBLeader from './ReportDetailContentYBLeader'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'

interface ReportDetailRouterProps {
  year: number
  month: ReportMonth
}

/**
 * 유저 역할·리포트 제출 여부에 따라 상세 화면을 분기합니다.
 * - YB_LEADER: 해당 월 미제출 → YBLeader(작성/수정), 제출 완료 → YB(보기)
 * - YB: 항상 YB(보기)
 */
export default function ReportDetailRouter({
  year,
  month,
}: ReportDetailRouterProps) {
  const user = useUserStore((s) => s.user)
  const { data: activitiesData } = useActivitiesSummary()
  const councilId = useMemo(
    () => activitiesData?.years?.find((y) => y.year === year)?.council_id ?? '',
    [activitiesData, year]
  )
  const { data: report, isLoading: reportLoading } = useReport(
    councilId,
    year,
    month
  )

  const isLeader = user?.role === 'YB_LEADER'
  const showLeaderDraft = isLeader && !report?.is_submitted

  // 역할·리포트 로딩 중
  if (reportLoading && councilId && isLeader) {
    return (
      <div className="flex flex-col py-20 pb-40">
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    )
  }

  if (showLeaderDraft) {
    return (
      <ReportDetailContentYBLeader
        year={year}
        month={month}
        councilId={councilId}
        initialReport={report ?? undefined}
      />
    )
  }

  return <ReportDetailContentYB year={year} month={month} />
}
