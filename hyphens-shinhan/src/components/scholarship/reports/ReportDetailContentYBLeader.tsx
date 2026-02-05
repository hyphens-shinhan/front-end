'use client'

import { useState } from "react";
import ActivityInfoInput from "./ActivityInfoInput";
import Separator from "@/components/common/Separator";
import ActivityPhotosInput from "./ActivityPhotosInput";
import ParticipationMemberInput from "./ParticipationMemberInput";
import ActivityCostReceiptInput from "./ActivityCostReceiptInput";
import BottomFixedButton from "@/components/common/BottomFixedButton";
import type { AttendanceResponse } from "@/types/reports";
import type { ReportMonth } from "@/services/reports";

const DEFAULT_ATTENDANCE: AttendanceResponse[] = [
    { user_id: '김지우', name: '김지우', avatar_url: null, status: 'PRESENT', confirmation: 'CONFIRMED' },
    { user_id: '나동규', name: '나동규', avatar_url: null, status: 'PRESENT', confirmation: 'CONFIRMED' },
    { user_id: '박근경', name: '박근경', avatar_url: null, status: 'PRESENT', confirmation: 'CONFIRMED' },
    { user_id: '아노', name: '아노', avatar_url: null, status: 'PRESENT', confirmation: 'CONFIRMED' },
]

interface ReportDetailContentYBLeaderProps {
  /** 연도 (제출/저장 시 사용) */
  year: number
  /** 월 4–12 (제출/저장 시 사용) */
  month: ReportMonth
}

export default function ReportDetailContentYBLeader({
  year,
  month,
}: ReportDetailContentYBLeaderProps) {
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [attendance] = useState<AttendanceResponse[]>(DEFAULT_ATTENDANCE)
    const [isPhotosChecked, setIsPhotosChecked] = useState(false)
    const [isReceiptChecked, setIsReceiptChecked] = useState(false)

    const isActivityInfoChecked = title.trim().length > 0 && description.trim().length > 0
    const isParticipationChecked = attendance.length > 0
    const isSubmitEnabled =
        isActivityInfoChecked && isPhotosChecked && isParticipationChecked && isReceiptChecked

    return (
        <div className="flex flex-col pb-40">
            <ActivityInfoInput
                title={title}
                date="2026-01-01"
                location="서울"
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                isTitleChecked={isActivityInfoChecked}
            />
            <Separator className="mx-4" />

            <ActivityPhotosInput onCheckedChange={setIsPhotosChecked} />
            <Separator className="mx-4" />

            <ParticipationMemberInput
                attendance={attendance}
                isChecked={isParticipationChecked}
            />
            <Separator className="mx-4" />

            <ActivityCostReceiptInput onCheckedChange={setIsReceiptChecked} />

            <BottomFixedButton
                label="제출"
                size="L"
                type="primary"
                disabled={!isSubmitEnabled}
                onClick={() => { }}
                secondLabel="임시 저장"
                secondType="secondary"
                onSecondClick={() => { }}
            />
        </div>
    )
}
