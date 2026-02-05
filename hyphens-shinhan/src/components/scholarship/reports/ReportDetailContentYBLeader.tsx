'use client'

import { useState, useEffect } from 'react'
import ActivityInfoInput from './ActivityInfoInput'
import Separator from '@/components/common/Separator'
import ActivityPhotosInput from './ActivityPhotosInput'
import ParticipationMemberInput from './ParticipationMemberInput'
import ActivityCostReceiptInput from './ActivityCostReceiptInput'
import BottomFixedButton from '@/components/common/BottomFixedButton'
import type { AttendanceResponse, ReportResponse } from '@/types/reports'
import type { ReportMonth } from '@/services/reports'
import { useUpdateReport, useSubmitReport } from '@/hooks/reports/useReportsMutations'

// ---------- Props ----------
interface ReportDetailContentYBLeaderProps {
    year: number
    month: ReportMonth
    /** 회의 ID (PATCH/GET 경로용). 없으면 임시저장·제출 비활성화 */
    councilId: string
    /** 이미 있는 초안 데이터. 있으면 폼에 채워 넣음 (GET으로 로드된 값) */
    initialReport?: ReportResponse | null
}

/**
 * YB_LEADER 전용 활동 보고서 작성/수정 화면.
 * - 진입 시 initialReport가 있으면 GET된 데이터로 폼 초기화.
 * - 임시 저장 → PATCH (초안 생성 또는 수정).
 * - 제출 → POST submit (reportId 필요, 초안 저장 후 또는 initialReport.id).
 */
export default function ReportDetailContentYBLeader({
    year,
    month,
    councilId,
    initialReport,
}: ReportDetailContentYBLeaderProps) {
    // ---------- 폼 상태 ----------
    const [title, setTitle] = useState('')
    const [activityDate, setActivityDate] = useState('')
    const [location, setLocation] = useState('')
    const [content, setContent] = useState('')
    const [attendance, setAttendance] = useState<AttendanceResponse[]>()
    const [isPhotosChecked, setIsPhotosChecked] = useState(false)
    const [isReceiptChecked, setIsReceiptChecked] = useState(false)
    /** 제출 시 사용할 보고서 ID (initialReport.id 또는 첫 PATCH 성공 후 설정) */
    const [reportId, setReportId] = useState<string | null>(
        initialReport?.id ?? null
    )

    // ---------- API 뮤테이션 ----------
    const updateReport = useUpdateReport()
    const submitReport = useSubmitReport()

    // ---------- 초안 데이터 반영 (GET → 폼 초기화) ----------
    /** 진행중인 월 진입 시 initialReport가 있으면 폼 필드에 채움 */
    useEffect(() => {
        if (!initialReport) return
        setTitle(initialReport.title ?? '')
        setActivityDate(initialReport.activity_date ?? '')
        setLocation(initialReport.location ?? '')
        setContent(initialReport.content ?? '')
        if (initialReport.attendance?.length) {
            setAttendance(initialReport.attendance)
        }
        setReportId(initialReport.id)
    }, [initialReport?.id])

    // ---------- 제출 가능 여부 (섹션별 체크) ----------
    const isActivityInfoChecked =
        title.trim().length > 0 && content.trim().length > 0
    const isParticipationChecked = attendance && attendance.length > 0 ? true : false
    const isSubmitEnabled =
        isActivityInfoChecked &&
        isPhotosChecked &&
        isParticipationChecked &&
        isReceiptChecked

    // ---------- 임시 저장 (PATCH) ----------
    const handleSaveDraft = () => {
        if (!councilId) return
        updateReport.mutate(
            {
                councilId,
                year,
                month,
                body: {
                    title: title || null,
                    activity_date: activityDate || null,
                    location: location || null,
                    content: content || null,
                    attendance: attendance?.map((a) => ({
                        user_id: a.user_id,
                        status: a.status,
                    })),
                },
            },
            {
                onSuccess: (data) => {
                    setReportId(data.id)
                },
            }
        )
    }

    // ---------- 제출 (POST submit) ----------
    const handleSubmit = () => {
        const id = reportId ?? initialReport?.id
        if (!id) {
            // 초안이 없으면 먼저 임시 저장 후 제출 유도하거나, 한 번 임시저장 후 버튼 활성화
            handleSaveDraft()
            return
        }
        submitReport.mutate(id)
    }

    // ---------- 버튼 활성/비활성 조건 ----------
    const canSubmit = !!reportId || !!initialReport?.id
    const isSaving = updateReport.isPending || submitReport.isPending
    const canSave = !!councilId

    return (
        <div className="flex flex-col pb-40">
            {/* ---------- 활동 정보 (제목·일자·장소·내용) ---------- */}
            <ActivityInfoInput
                title={title}
                date={activityDate || 'YYYY.MM.DD'}
                location={location}
                description={content}
                setTitle={setTitle}
                setDescription={setContent}
                isTitleChecked={isActivityInfoChecked}
            />
            <Separator className="mx-4" />

            {/* ---------- 활동 사진 ---------- */}
            <ActivityPhotosInput onCheckedChange={setIsPhotosChecked} />
            <Separator className="mx-4" />

            {/* ---------- 참여 멤버 (출석 명단). 팀장·미제출 시에만 행 토글 표시 ---------- */}
            <ParticipationMemberInput
                attendance={attendance}
                isChecked={isParticipationChecked}
                variant="YB_LEADER"
                isSubmitted={initialReport?.is_submitted ?? false}
            />
            <Separator className="mx-4" />

            {/* ---------- 활동 비용·영수증 ---------- */}
            <ActivityCostReceiptInput onCheckedChange={setIsReceiptChecked} />

            {/* ---------- 제출 / 임시 저장 버튼 ---------- */}
            <BottomFixedButton
                label="제출"
                size="L"
                type="primary"
                disabled={!isSubmitEnabled || !canSubmit || !canSave || isSaving}
                onClick={handleSubmit}
                secondLabel="임시 저장"
                secondType="secondary"
                secondDisabled={!canSave || isSaving}
                onSecondClick={handleSaveDraft}
            />
        </div>
    )
}
