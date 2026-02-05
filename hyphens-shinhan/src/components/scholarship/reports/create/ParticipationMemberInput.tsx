import { cn } from "@/utils/cn"
import ReportTitle from "../ReportTitle"
import ParticipationMemberList from "./ParticipationMemberList"
import type { AttendanceResponse } from "@/types/reports"

export interface ParticipationMemberInputProps {
    /** API 출석 목록. 없으면 기본 목록 사용 (TODO: API 연동 시 부모에서 내려줌) */
    attendance?: AttendanceResponse[]
    /** 섹션 체크 표시 (참석 명단 1명 이상일 때 true 등) */
    isChecked?: boolean
    /** 제출 완료 시 true — 토글 숨김(목록만 표시) */
    isSubmitted?: boolean
}

export default function ParticipationMemberInput({
    attendance,
    isChecked = false,
    isSubmitted = false,
}: ParticipationMemberInputProps) {
    return (
        <div className={styles.container}>
            <ReportTitle title="함께한 팀원을 알려주세요" checkIcon={true} isChecked={isChecked} className="py-0" />
            <ParticipationMemberList
                attendance={attendance}
            />
        </div>
    )
}

const styles = {
    container: cn('flex flex-col gap-1.5 px-4 pt-6'),
}