'use client'

import Button from '@/components/common/Button'
import ParticipationMemberList from './ParticipationMemberList'
import { cn } from '@/utils/cn'
import { useConfirmAttendance, useRejectAttendance } from '@/hooks/reports/useReportsMutations'
import type { AttendanceResponse } from '@/types/reports'

interface ParticipationStatusProps {
  reportId: string
  attendance: AttendanceResponse[]
  /** 제출 완료 시 true — 불참/출석 버튼 숨김 */
  isSubmitted?: boolean
}

/** 활동 보고서 상세 - 참여 현황 섹션 (출석률, 참석 멤버 미리보기, 불참/출석 버튼) */
export default function ParticipationStatus({
  reportId,
  attendance,
  isSubmitted = false,
}: ParticipationStatusProps) {
  const confirmAttendance = useConfirmAttendance()
  const rejectAttendance = useRejectAttendance()

  const confirmedCount = attendance.filter((a) => a.confirmation === 'CONFIRMED').length
  const totalCount = attendance.length
  const progressPct = totalCount > 0 ? (confirmedCount / totalCount) * 100 : 0

  return (
    <div>
      <h2 className={styles.sectionTitle}>참여 현황</h2>
      <div className={styles.progressWrap}>
        <p className={styles.progressLabel}>
          참석 확인 {confirmedCount} / {totalCount}
        </p>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={confirmedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      <ParticipationMemberList attendance={attendance} />
      {!isSubmitted && (
        <div className={styles.buttonRow}>
          <Button
            label="불참"
            size="L"
            type="warning"
            fullWidth
            disabled={rejectAttendance.isPending}
            onClick={() => rejectAttendance.mutate(reportId)}
          />
          <Button
            label="출석"
            size="L"
            type="primary"
            fullWidth
            disabled={confirmAttendance.isPending}
            onClick={() => confirmAttendance.mutate(reportId)}
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  sectionTitle: cn('title-16 text-grey-11 py-4.5'),
  progressWrap: cn('pb-2'),
  progressLabel: cn('body-8 pb-2 text-grey-10'),
  /** 진행 바 배경(트랙) */
  progressTrack: cn('w-full h-2 rounded-[16px] bg-grey-2 overflow-hidden'),
  /** 진행 바 채워진 부분 - primary 색상 */
  progressFill: cn('h-full rounded-[16px] bg-primary-secondaryroyal'),
  buttonRow: cn('flex gap-2 pt-2'),
}
