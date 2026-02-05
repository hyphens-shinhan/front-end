'use client'

import { cn } from '@/utils/cn'
import { attendanceToDisplayStatus } from '@/utils/reports'
import ParticipationMemberRow from './ParticipationMemberRow'
import type { AttendanceResponse } from '@/types/reports'

export type ParticipationVariant = 'YB_LEADER' | 'YB'

interface ParticipationMemberListExpandedProps {
  /** YB_LEADER: 팀장 뷰(팀원 행에 출석 Toggle) / YB: 팀원 뷰 */
  variant: ParticipationVariant
  /** API 출석 목록 (user_id, status, confirmation) */
  attendance?: AttendanceResponse[]
  /** 출석 여부 (user_id → 출석 여부). 부모에서 관리 */
  attendanceStatusByUser: Record<string, boolean>
  /** 출석 여부 변경 시 호출 */
  onAttendanceChange: (userId: string, checked: boolean) => void
}

/** 버튼 클릭 시 펼쳐지는 멤버 목록. variant에 따라 팀장/팀원 영역 스타일·표시가 다름 */
export default function ParticipationMemberListExpanded({
  variant,
  attendance = [],
  attendanceStatusByUser,
  onAttendanceChange,
}: ParticipationMemberListExpandedProps) {
  const isLeader = variant === 'YB_LEADER'
  const leader = attendance[0]

  return (
    <div className={styles.container}>
      <div className={styles.teamSection}>
        {/** 팀장 행 */}
        {leader && (
          <>
            <p className={styles.sectionLabel}>팀장</p>
            <ParticipationMemberRow
              key={leader.user_id}
              name={leader.name}
              status={attendanceToDisplayStatus(leader)}
              showToggle={isLeader}
              attendanceStatus={attendanceStatusByUser[leader.user_id] ?? false}
              onToggle={(checked) => onAttendanceChange(leader.user_id, checked)}
            />
          </>
        )}
        {/** 팀원 행 */}
        <div className={styles.sectionContent}>
          <p className={styles.sectionLabel}>팀원</p>
          <p className={styles.sectionDescription}>활동에 불참한 팀원의 토글을 off 상태로 바꾸어주세요!</p>
        </div>

        {/** 팀원 목록 */}
        {attendance.length <= 1 ? (
          <p className={cn(styles.sectionLabel, 'text-grey-6')}>
            참석 명단이 없습니다.
          </p>
        ) : (
          attendance.slice(1).map((a) => (
            <ParticipationMemberRow
              key={a.user_id}
              name={a.name}
              status={attendanceToDisplayStatus(a)}
              showToggle={isLeader}
              attendanceStatus={attendanceStatusByUser[a.user_id] ?? false}
              onToggle={(checked) => onAttendanceChange(a.user_id, checked)}
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
  sectionDescription: cn('body-8 text-grey-8'),
  sectionContent: cn('flex flex-col gap-2'),
}
