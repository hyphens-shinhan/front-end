'use client'

import { useState } from 'react'
import MemberPreviewRow from './MemberPreviewRow'
import ParticipationMemberListExpanded, {
  type ParticipationVariant,
} from './ParticipationMemberListExpanded'
import type { AttendanceResponse } from '@/types/reports'

export type { ParticipationVariant }

export interface ParticipationMemberListProps {
  /**
   * YB_LEADER: 팀장 뷰 — 팀장 영역 pt-12 pb-18, 팀원 행에 "대기 중" + 불참(Close) 아이콘
   * YB: 팀원 뷰 — 팀원은 목록만 보고, 팀원 행에 Close 아이콘 없음
   */
  variant?: ParticipationVariant
  /** API 출석 목록 (있으면 미리보기·펼침 목록에 반영) */
  attendance?: AttendanceResponse[]
}

/** 참석 멤버 프로필 미리보기 + 펼침 시 멤버 목록. variant에 따라 팀장/팀원별로 보이는 UI가 달라짐 */
export default function ParticipationMemberList({
  variant = 'YB',
  attendance = [],
}: ParticipationMemberListProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MemberPreviewRow
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        attendanceCount={attendance.length}
      />
      {isOpen && (
        <ParticipationMemberListExpanded
          variant={variant}
          attendance={attendance}
        />
      )}
    </>
  )
}
