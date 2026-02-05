'use client'

import ReportTitle from '../ReportTitle'
import ProgressBar from '@/components/common/ProgressBar'
import MemberPreviewRow from '../MemberPreviewRow'
import { ROUTES } from '@/constants'
import type { ReportMonth } from '@/services/reports'
import type { AttendanceResponse } from '@/types/reports'

export interface ParticipationMemberStatusProps {
    /** 출석 목록 (이름·링크용) */
    attendance: AttendanceResponse[]
    /** 제출 완료 여부 — true면 참여 상세 링크 표시 */
    isSubmitted: boolean
    /** 자치회 ID (링크 쿼리용) */
    councilId: string
    /** 연도 (링크 쿼리용) */
    year: number
    /** 월 (링크 쿼리용) */
    month: ReportMonth
}

/** YB 제출 완료 뷰: 참석자 현황 섹션 (제목, 참석 수, 진행바, 멤버 미리보기/링크) */
export default function ParticipationMemberStatus({
    attendance,
    isSubmitted,
    councilId,
    year,
    month,
}: ParticipationMemberStatusProps) {
    const totalCount = attendance.length
    /** 확인 완료한 인원(confirmation === 'CONFIRMED'). 진행바는 이 값 기준 */
    const confirmedCount = attendance.filter((a) => a.confirmation === 'CONFIRMED').length
    const progressValue = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0

    return (
        <div>
            <ReportTitle title="참석자 현황" className="py-4.5" />
            <div className="flex gap-2 body-8 text-grey-10">
                <p>확인 완료</p>
                <p>{confirmedCount} / {totalCount}</p>
            </div>
            <ProgressBar value={progressValue} max={100} className="my-2" />
            <MemberPreviewRow
                members={attendance.map((a) => a.name)}
                isOpen={false}
                onToggle={() => { }}
                attendanceCount={totalCount}
                className="pt-2 pb-4"
                href={
                    isSubmitted && councilId
                        ? `${ROUTES.SCHOLARSHIP.REPORT.PARTICIPATION}?year=${year}&month=${month}&councilId=${councilId}`
                        : undefined
                }
            />
        </div>
    )
}
