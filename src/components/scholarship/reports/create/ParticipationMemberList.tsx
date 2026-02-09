'use client'

import { useState, useEffect } from 'react'
import MemberPreviewRow from '../MemberPreviewRow'
import ParticipationMemberListExpanded from './ParticipationMemberListExpanded'
import type { AttendanceResponse } from '@/types/reports'

export interface ParticipationMemberListProps {
  /** API 출석 목록 (있으면 미리보기·펼침 목록에 반영) */
  attendance?: AttendanceResponse[]
  /** 참석/불참 토글 시 부모에 반영 (제출 시엔 undefined) */
  onAttendanceStatusChange?: (userId: string, present: boolean) => void
}

/** 참석 멤버 프로필 미리보기 + 펼침 시 멤버 목록 (YB_LEADER 작성 화면 전용) */
export default function ParticipationMemberList({
  attendance = [],
  onAttendanceStatusChange,
}: ParticipationMemberListProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [attendanceStatusByUser, setAttendanceStatusByUser] = useState<
    Record<string, boolean>
  >(() =>
    attendance.reduce<Record<string, boolean>>(
      (acc, a) => ({ ...acc, [a.user_id]: a.status === 'PRESENT' }),
      {}
    )
  )

  /** attendance가 나중에 채워질 때(예: council members API) 토글 상태 동기화 */
  useEffect(() => {
    if (!attendance.length) return
    setAttendanceStatusByUser((prev) =>
      attendance.reduce<Record<string, boolean>>(
        (acc, a) => ({
          ...acc,
          [a.user_id]: prev[a.user_id] ?? a.status === 'PRESENT',
        }),
        {}
      )
    )
  }, [attendance])

  const handleAttendanceChange = (userId: string, checked: boolean) => {
    setAttendanceStatusByUser((prev) => ({ ...prev, [userId]: checked }))
    onAttendanceStatusChange?.(userId, checked)
  }

  return (
    <>
      <MemberPreviewRow
        attendance={attendance}
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        attendanceCount={attendance.length}
        className="py-5"
      />
      {isOpen && (
        <ParticipationMemberListExpanded
          attendance={attendance}
          attendanceStatusByUser={attendanceStatusByUser}
          onAttendanceChange={handleAttendanceChange}
        />
      )}
    </>
  )
}
