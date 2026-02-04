'use client'

import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

type AttendanceStatus = '출석' | '대기 중' | '불참'

interface ParticipationMemberRowProps {
    name: string
    status: AttendanceStatus
    /** YB_LEADER일 때만 true: 팀원 행에 "대기 중" 옆 불참 처리(Close) 아이콘 표시 */
    showCloseIcon?: boolean
}

/** 멤버 한 명 행 (프로필 + 이름 + 출석 상태, 선택 시 Close 아이콘) */
export default function ParticipationMemberRow({
    name,
    status,
    showCloseIcon = false,
}: ParticipationMemberRowProps) {
    const statusColor =
        status === '출석'
          ? 'text-state-green'
          : status === '불참'
            ? 'text-state-red'
            : 'text-state-yellow'

    return (
        <div className='flex w-full gap-3 items-center'>
            <div className='w-6 h-6 shrink-0 rounded-full bg-grey-3 border' aria-hidden />
            <p className='body-6 text-grey-11 min-w-0 flex-1 truncate'>{name}</p>
            <div className='flex shrink-0 gap-2.5 items-center'>
                <p className={cn('body-5', statusColor)}>{status}</p>
                {showCloseIcon && (
                    <Icon
                        name='IconMLineClose'
                        size={20}
                        className='text-grey-9'
                    />
                )}
            </div>
        </div>
    )
}
