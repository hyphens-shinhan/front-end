'use client'

import { useEffect } from "react"
import ActivityCostReceipt from "./ActivityCostReceipt"
import ActivityInfo from "./ActivityInfo"
import ActivityPhotos from "./ActivityPhotos"
import ParticipationStatus from "./ParticipationStatus"
import Separator from "@/components/common/Separator"
import { cn } from "@/utils/cn"
import { useHeaderStore } from "@/stores"

/** 활동 보고서 상세 (YB) - 활동 정보·사진·참여현황·비용 영수증을 묶은 메인 컨테이너 */
export default function ReportDetailContentYB() {
    const setCustomTitle = useHeaderStore((s) => s.setCustomTitle)

    // TODO: 활동 API 연동 시 응답의 month 등으로 `${month}월 활동` 설정
    const activityMonth = 4

    useEffect(() => {
        setCustomTitle(`${activityMonth}월 활동`)
        return () => setCustomTitle(null)
    }, [activityMonth, setCustomTitle])

    return (
        <div className={styles.container}>
            <ActivityInfo />
            <ActivityPhotos />
            <Separator />
            {/** TODO: 제출 완료 화면에서는 불참, 출석 버튼 없음 */}
            <ParticipationStatus />
            <Separator />
            <ActivityCostReceipt />
        </div>
    )
}

const styles = {
    container: cn('flex flex-col px-4 pb-40'),
}
