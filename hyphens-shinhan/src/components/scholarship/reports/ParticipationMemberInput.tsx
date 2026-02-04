import { cn } from "@/utils/cn"
import ReportTitle from "./ReportTitle"
import ParticipationMemberRow from "./ParticipationMemberRow"
import ParticipationMemberList from "./ParticipationMemberList"

export default function ParticipationMemberInput() {
    return (
        <div className={styles.container}>
            <ReportTitle title="함께한 팀원을 알려주세요" checkIcon={true} isChecked={false} className="py-0" />
            {/** TODO: API 출석 목록 반영 */}
            <ParticipationMemberList
                variant="YB_LEADER"
                attendance={[
                    {
                        user_id: '김지우',
                        status: 'PRESENT',
                        confirmation: 'CONFIRMED',
                    },
                    {
                        user_id: '나동규',
                        status: 'PRESENT',
                        confirmation: 'CONFIRMED',
                    },
                    {
                        user_id: '박근경',
                        status: 'PRESENT',
                        confirmation: 'CONFIRMED',
                    },
                    {
                        user_id: '아노',
                        status: 'PRESENT',
                        confirmation: 'CONFIRMED',
                    },
                ]} />
        </div>
    )
}

const styles = {
    container: cn('flex flex-col gap-1.5 px-4 pt-6'),
}