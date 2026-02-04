'use client'

import { cn } from '@/utils/cn'
import { attendanceToDisplayStatus } from '@/utils/reports'
import ParticipationMemberRow from './ParticipationMemberRow'
import type { AttendanceResponse } from '@/types/reports'

export type ParticipationVariant = 'YB_LEADER' | 'YB'

interface ParticipationMemberListExpandedProps {
  /** YB_LEADER: 팀장 뷰(팀장 pt-12 pb-18, 팀원 행에 불참 처리 아이콘) / YB: 팀원 뷰 */
  variant: ParticipationVariant
  /** API 출석 목록 (user_id, status, confirmation) */
  attendance?: AttendanceResponse[]
}

/** 버튼 클릭 시 펼쳐지는 멤버 목록. variant에 따라 팀장/팀원 영역 스타일·표시가 다름 */
export default function ParticipationMemberListExpanded({
  variant,
  attendance = [],
}: ParticipationMemberListExpandedProps) {
  const isLeader = variant === 'YB_LEADER'
  const displayName = (userId: string) =>
    userId.length > 8 ? `${userId.slice(0, 8)}…` : userId

  return (
    <div className={styles.container}>
      <div className={styles.teamSection}>
        <p className={styles.sectionLabel}>참여 멤버</p>
        {attendance.length === 0 ? (
          <p className={cn(styles.sectionLabel, 'text-grey-6')}>
            참석 명단이 없습니다.
          </p>
        ) : (
          attendance.map((a) => (
            <ParticipationMemberRow
              key={a.user_id}
              name={displayName(a.user_id)}
              status={attendanceToDisplayStatus(a)}
              showCloseIcon={isLeader}
            />
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: cn(
    'flex flex-col gap-5 px-6 py-5 border border-grey-2 rounded-[16px]'
  ),
  sectionLabel: cn('body-7 text-grey-8'),
  teamSection: cn('flex flex-col gap-4'),
}
