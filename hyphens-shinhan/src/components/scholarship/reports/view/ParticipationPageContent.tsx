'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useHeaderStore } from '@/stores'
import { useReport } from '@/hooks/reports/useReports'
import { ROUTES } from '@/constants'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { cn } from '@/utils/cn'
import type { ReportMonth } from '@/services/reports'
import type { AttendanceResponse } from '@/types/reports'

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

  const { data: report, isLoading, isError } = useReport(
    councilId,
    year,
    month
  )

  const activityUrl = `${ROUTES.SCHOLARSHIP.REPORT.ACTIVITY}?year=${year}&month=${month}&councilId=${councilId}`

  useEffect(() => {
    setCustomTitle('참석자 현황')
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

  const attendance = report.attendance ?? []

  /** 팀장 먼저, 나머지 API 순서. is_leader 없으면 원본 순서 유지 (attendance 참조 안정화) */
  const displayOrder = useMemo((): AttendanceResponse[] => {
    const list = report.attendance ?? []
    const leader = list.find((a) => a.is_leader)
    if (!leader) return list
    const rest = list.filter((a) => a.user_id !== leader.user_id)
    return [leader, ...rest]
  }, [report.attendance])

  return (
    <div className={styles.container}>
      {/* 테이블 헤더 */}
      <div className={styles.tableHeader}>
        <p className={styles.headerLabel}>이름</p>
        <div className={styles.headerRight}>
          <p className={styles.headerCell}>참석 여부</p>
          <p className={styles.headerCell}>확인 여부</p>
        </div>
      </div>

      {/* 멤버 목록 */}
      <div className={styles.memberList}>
        {displayOrder.length === 0 ? (
          <p className={styles.emptyMessage}>참석 명단이 없습니다.</p>
        ) : (
          displayOrder.map((member) => {
            const attendanceStatus =
              member.status === 'PRESENT' ? '출석' : '불참'
            const confirmationStatus =
              member.confirmation === 'CONFIRMED' ? '확인' : '대기 중'

            return (
              <div key={member.user_id} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className={styles.avatarImage}
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <p className={styles.memberName}>
                    {member.name}
                    {member.is_leader && (
                      <span className={styles.leaderBadge}> (팀장)</span>
                    )}
                  </p>
                </div>
                <div className={styles.statusGroup}>
                  <p
                    className={cn(
                      styles.statusCell,
                      attendanceStatus === '출석'
                        ? styles.statusPresent
                        : styles.statusAbsent
                    )}
                  >
                    {attendanceStatus}
                  </p>
                  <p
                    className={cn(
                      styles.statusCell,
                      confirmationStatus === '확인'
                        ? styles.statusConfirmed
                        : styles.statusPending
                    )}
                  >
                    {confirmationStatus}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col pb-40'),
  tableHeader: cn(
    'flex justify-between items-center px-8 pt-7',
  ),
  headerLabel: cn('body-7 text-grey-8 font-semibold'),
  headerRight: cn('flex items-center shrink-0 gap-2'),
  /** 참석 여부·확인 여부 칸: 고정 너비 + 가운데 정렬 */
  headerCell: cn('body-7 text-grey-8 font-semibold text-center w-[72px]'),
  memberList: cn('flex flex-col gap-7 px-8 pt-7'),
  memberRow: cn('flex justify-between items-center'),
  memberInfo: cn('flex items-center gap-3 flex-1 min-w-0'),
  avatar: cn(
    'relative w-9 h-9 shrink-0 rounded-full bg-grey-10 overflow-hidden'
  ),
  avatarImage: cn('object-cover'),
  memberName: cn('body-6 text-grey-11'),
  leaderBadge: cn('body-6 text-grey-11'),
  statusGroup: cn('flex shrink-0 gap-2'),
  /** 각 상태 칸: 고정 너비 + 가운데 정렬 */
  statusCell: cn('body-5 font-semibold text-center w-[72px]'),
  statusPresent: cn('text-state-green'),
  statusAbsent: cn('text-state-red'),
  statusConfirmed: cn('text-primary-secondaryroyal'),
  statusPending: cn('text-grey-8'),
  emptyMessage: cn('body-7 text-grey-6 py-8'),
}
