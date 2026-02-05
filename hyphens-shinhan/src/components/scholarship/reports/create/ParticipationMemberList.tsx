'use client'

import { useState } from 'react'
import MemberPreviewRow from '../MemberPreviewRow'
import ParticipationMemberListExpanded from './ParticipationMemberListExpanded'
import type { AttendanceResponse } from '@/types/reports'

export interface ParticipationMemberListProps {
  /** API 출석 목록 (있으면 미리보기·펼침 목록에 반영) */
  attendance?: AttendanceResponse[]
}

/** 참석 멤버 프로필 미리보기 + 펼침 시 멤버 목록 (YB_LEADER 작성 화면 전용) */
export default function ParticipationMemberList({
  attendance = [],
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

  const handleAttendanceChange = (userId: string, checked: boolean) => {
    setAttendanceStatusByUser((prev) => ({ ...prev, [userId]: checked }))
  }

  return (
    <>
      <MemberPreviewRow
        members={attendance.map((a) => a.name)}
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
