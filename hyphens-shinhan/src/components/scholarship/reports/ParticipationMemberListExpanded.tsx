'use client'

import { cn } from "@/utils/cn"
import ParticipationMemberRow from "./ParticipationMemberRow"

export type ParticipationVariant = 'YB_LEADER' | 'YB'

interface ParticipationMemberListExpandedProps {
    /** YB_LEADER: 팀장 뷰(팀장 pt-12 pb-18, 팀원 행에 불참 처리 아이콘) / YB: 팀원 뷰 */
    variant: ParticipationVariant
}

/** 버튼 클릭 시 펼쳐지는 멤버 목록. variant에 따라 팀장/팀원 영역 스타일·표시가 다름 */
export default function ParticipationMemberListExpanded({
    variant,
}: ParticipationMemberListExpandedProps) {
    const isLeader = variant === 'YB_LEADER'

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <p className={styles.sectionLabel}>팀장</p>
                <div className={styles.leaderRow}>
                    <ParticipationMemberRow
                        name='오시온'
                        status='출석'
                        showCloseIcon={false}
                    />
                </div>
            </div>

            {/* 팀원 목록: gap-16px. 팀원 행에 Close 아이콘은 YB_LEADER에서만 */}
            <div className={styles.teamSection}>
                <p className={styles.sectionLabel}>팀원</p>
                <ParticipationMemberRow
                    name='김지우'
                    status='대기 중'
                    showCloseIcon={isLeader}
                />
                <ParticipationMemberRow
                    name='김지우'
                    status='대기 중'
                    showCloseIcon={isLeader}
                />
                <ParticipationMemberRow
                    name='김지우'
                    status='대기 중'
                    showCloseIcon={isLeader}
                />
            </div>
        </div>
    )
}

const styles = {
    container: cn(
        'flex flex-col gap-5 px-6 py-5 border border-grey-2 rounded-[16px]'
    ),
    section: cn('flex flex-col'),
    sectionLabel: cn('body-7 text-grey-8'),
    leaderRow: cn('flex gap-3 items-center pt-3'),
    teamSection: cn('flex flex-col gap-4'),
}
