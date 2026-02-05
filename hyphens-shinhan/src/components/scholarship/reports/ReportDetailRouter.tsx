'use client'

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
  /** URL 쿼리로 넘어온 자치회 ID. 없으면 활동 요약에서 조회(예: 북마크 진입) */
  councilId?: string
}

/**
 * 유저 역할·리포트 제출 여부에 따라 상세 화면을 분기합니다.
 * - YB_LEADER: 해당 월 미제출 → YBLeader(작성/수정), 제출 완료 → YB(보기)
 * - YB: 항상 YB(보기)
 * - councilId는 목록에서 링크로 넘겨받으며, 없을 때만 활동 요약 API로 보완
 */
export default function ReportDetailRouter({
  year,
  month,
  councilId: councilIdFromUrl = '',
}: ReportDetailRouterProps) {
  const user = useUserStore((s) => s.user)
  const { data: activitiesData } = useActivitiesSummary()
  const councilId =
    councilIdFromUrl ||
    activitiesData?.years?.find((y) => y.year === year)?.council_id ||
    ''
  const { data: report, isLoading: reportLoading } = useReport(
    councilId,
    year,
    month
  )

  const isLeader = user?.role === 'YB_LEADER'
  /** is_submitted가 false면 무조건 작성 페이지(YBLeader). ActivityCard status와 무관. */
  const showLeaderDraft = isLeader && !report?.is_submitted

  // user가 아직 로드되지 않았으면 역할 분기하지 않음 (null일 때 isLeader가 false라 YB가 뜨는 것 방지)
  if (user === null) {
    return (
      <div className="flex flex-col py-20 pb-40">
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    )
  }

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
