'use client'

import { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useUserStore, useHeaderStore } from '@/stores'
import { useReport } from '@/hooks/reports/useReports'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import { ROUTES } from '@/constants'
import type { ReportMonth } from '@/services/reports'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'

const ReportDetailContentYB = dynamic(
  () => import('./ReportDetailContentYB'),
  { ssr: true }
)

const ReportDetailContentYBLeader = dynamic(
  () => import('./ReportDetailContentYBLeader'),
  { ssr: true }
)

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
  const councilId = useMemo(
    () =>
      councilIdFromUrl ||
      activitiesData?.years?.find((y) => y.year === year)?.council_id ||
      '',
    [councilIdFromUrl, activitiesData?.years, year]
  )
  const { data: report, isLoading: reportLoading } = useReport(
    councilId,
    year,
    month
  )

  const router = useRouter()
  const setCustomTitle = useHeaderStore((s) => s.setCustomTitle)
  const setHandlers = useHeaderStore((s) => s.setHandlers)
  const resetHandlers = useHeaderStore((s) => s.resetHandlers)

  const isLeader = user?.role === 'YB_LEADER'
  /** is_submitted가 false면 무조건 작성 페이지(YBLeader). ActivityCard status와 무관. */
  const showLeaderDraft = isLeader && !report?.is_submitted

  /** user 미로드 또는 리더인데 보고서 로딩 중이면 로딩 UI (역할 분기 보류) */
  const isLoading =
    user === null || (reportLoading && !!councilId && isLeader)

  /** 활동 상세 공통 헤더: 제목 'N월 활동', 백 시 MY활동 목록(연도 쿼리 유지) */
  useEffect(() => {
    setCustomTitle(`${month}월 활동`)
    const goToList = () => router.push(`${ROUTES.SCHOLARSHIP.MAIN}?year=${year}`)
    setHandlers({ onBack: goToList })
    return () => {
      resetHandlers()
      setCustomTitle(null)
    }
  }, [router, year, month, setHandlers, resetHandlers, setCustomTitle])

  if (isLoading) {
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
