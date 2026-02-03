'use client'

import { useState } from "react"
import MemberPreviewRow from "./MemberPreviewRow"
import ParticipationMemberListExpanded, {
    type ParticipationVariant,
} from "./ParticipationMemberListExpanded"

export type { ParticipationVariant }

interface ParticipationMemberListProps {
    /**
     * YB_LEADER: 팀장 뷰 — 팀장 영역 pt-12 pb-18, 팀원 행에 "대기 중" + 불참(Close) 아이콘
     * YB: 팀원 뷰 — 팀원은 목록만 보고, 팀원 행에 Close 아이콘 없음
     * TODO: 상위에서 활동/팀 역할 API 연동 후 isLeader 등으로 전달
     */
    variant?: ParticipationVariant
}

/** 참석 멤버 프로필 미리보기 + 펼침 시 멤버 목록. variant에 따라 팀장/팀원별로 보이는 UI가 달라짐 */
export default function ParticipationMemberList({
    variant = 'YB',
}: ParticipationMemberListProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <MemberPreviewRow
                isOpen={isOpen}
                onToggle={() => setIsOpen((prev) => !prev)}
            />
            {isOpen && (
                <ParticipationMemberListExpanded variant={'YB_LEADER'} />
            )}
        </>
    )
}
