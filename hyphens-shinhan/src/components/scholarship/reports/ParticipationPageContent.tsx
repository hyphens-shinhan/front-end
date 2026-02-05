'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderStore } from '@/stores'
import { useReport } from '@/hooks/reports/useReports'
import { ROUTES } from '@/constants'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { cn } from '@/utils/cn'
import ReportTitle from './ReportTitle'
import ParticipationMemberListExpanded from './create/ParticipationMemberListExpanded'
import type { ReportMonth } from '@/services/reports'

interface ParticipationPageContentProps {
  year: number
  month: ReportMonth
  councilId: string
}

/** 참여 멤버 상세 페이지 (제출 완료 뷰에서 이동). 보고서 출석 명단만 읽기 전용으로 표시 */
export default function ParticipationPageContent({
  year,
  month,
  councilId,
}: ParticipationPageContentProps) {
  const router = useRouter()
  const setCustomTitle = useHeaderStore((s) => s.setCustomTitle)
  const setHandlers = useHeaderStore((s) => s.setHandlers)
  const resetHandlers = useHeaderStore((s) => s.resetHandlers)

  const { data: report, isLoading, isError, error } = useReport(
    councilId,
    year,
    month
  )

  const activityUrl = `${ROUTES.SCHOLARSHIP.REPORT.ACTIVITY}?year=${year}&month=${month}&councilId=${councilId}`

  useEffect(() => {
    setCustomTitle('참여 현황')
    setHandlers({
      onBack: () => router.push(activityUrl),
    })
    return () => {
      resetHandlers()
      setCustomTitle(null)
    }
  }, [router, setHandlers, resetHandlers, setCustomTitle, activityUrl])

  if (!councilId) {
    return (
      <div className={styles.container}>
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY.REPORT_NO_COUNCIL}
          className="py-20"
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
          className="py-20"
        />
      </div>
    )
  }

  if (isError || !report) {
    return (
      <div className={styles.container}>
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.REPORT}
          className="py-20"
        />
      </div>
    )
  }

  const attendanceStatusByUser = Object.fromEntries(
    report.attendance.map((a) => [a.user_id, a.status === 'PRESENT'])
  )

  return (
    <div className={styles.container}>
      <ReportTitle title="참여 현황" className="pb-4" />
      <ParticipationMemberListExpanded
        attendance={report.attendance}
        attendanceStatusByUser={attendanceStatusByUser}
        onAttendanceChange={() => { }}
      />
    </div>
  )
}

const styles = {
  container: cn('px-4 pb-40'),
}
