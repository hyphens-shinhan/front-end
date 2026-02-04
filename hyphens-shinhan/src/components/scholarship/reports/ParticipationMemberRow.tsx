'use client'

import Toggle from "@/components/common/Toggle"
import { cn } from "@/utils/cn"

type AttendanceStatus = '출석' | '대기 중' | '불참'

interface ParticipationMemberRowProps {
    name: string
    status: AttendanceStatus
    /** YB_LEADER일 때만 true: 팀원 행에 "출석" 옆 출석 여부 상태 Toggle 표시 */
    showToggle?: boolean
    /** 출석 여부 상태 (showToggle일 때만 사용) */
    attendanceStatus?: boolean
    /** 출석 여부 상태 변경 시 호출 (showToggle일 때만 사용) */
    onToggle?: (status: boolean) => void
}

/** 멤버 한 명 행 (프로필 + 이름 + 출석 상태, 리더는 출석 여부 상태 Toggle 표시) */
export default function ParticipationMemberRow({
    name,
    status,
    showToggle = false,
    attendanceStatus = true,
    onToggle,
}: ParticipationMemberRowProps) {
    // 토글이 활성화된 경우 토글 상태에 따라 출석 상태 결정
    const displayStatus: AttendanceStatus = showToggle
        ? attendanceStatus
            ? '출석'
            : '불참'
        : status

    const statusColor =
        displayStatus === '출석'
            ? 'text-state-green'
            : displayStatus === '불참'
                ? 'text-state-red'
                : 'text-state-yellow'

    return (
        <div className={styles.container}>
            <div className={styles.profile} aria-hidden />
            <p className={styles.name}>{name}</p>
            <div className={styles.statusContainer}>
                <p className={cn(styles.status, statusColor)}>{displayStatus}</p>
                {showToggle && (
                    <Toggle
                        checked={attendanceStatus}
                        onChange={(checked) => onToggle?.(checked)}
                    />
                )}
            </div>
        </div>
    )
}

const styles = {
    container: cn('flex w-full gap-3 items-center'),
    name: cn('body-6 text-grey-11 min-w-0 flex-1'),
    statusContainer: cn('flex shrink-0 gap-2.5 items-center'),
    status: cn('body-5'),
    closeIcon: cn('text-grey-9'),
    profile: cn('w-6 h-6 shrink-0 rounded-full bg-grey-10'),
}