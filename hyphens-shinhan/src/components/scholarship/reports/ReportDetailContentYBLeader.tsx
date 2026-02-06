'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import ActivityInfoInput from './create/ActivityInfoInput'
import Separator from '@/components/common/Separator'
import ActivityPhotosInput, { type ActivityPhotosInputRef } from './create/ActivityPhotosInput'
import ParticipationMemberInput from './create/ParticipationMemberInput'
import ActivityCostReceiptInput, {
    type ActivityCostReceiptInputRef,
} from './create/ActivityCostReceiptInput'
import BottomFixedButton from '@/components/common/BottomFixedButton'
import type {
    AttendanceResponse,
    ReceiptCreate,
    ReportResponse,
} from '@/types/reports'
import { AttendanceStatus, ConfirmationStatus } from '@/types/reports'
import type { ReportMonth } from '@/services/reports'
import { useUpdateReport, useSubmitReport } from '@/hooks/reports/useReportsMutations'
import { useCouncilMembers } from '@/hooks/councils/useCouncils'

// ---------- Props ----------
export interface ReportDetailContentYBLeaderProps {
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
function ReportDetailContentYBLeader({
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
    /** 활동 사진 1장 이상 선택 시 true (제출 버튼 활성화용) */
    const [isPhotosChecked, setIsPhotosChecked] = useState(false)
    /** 영수증 1장 이상 + 총 비용 입력 시 true (제출 버튼 활성화용) */
    const [isReceiptChecked, setIsReceiptChecked] = useState(false)
    /** 제출 시 사용할 보고서 ID (initialReport.id 또는 첫 PATCH 성공 후 설정) */
    const [reportId, setReportId] = useState<string | null>(
        initialReport?.id ?? null
    )

    /** 활동 사진: ref로 uploadImages() 호출 → 기존 URL + 새 업로드 URL 합쳐서 반환 */
    const photoInputRef = useRef<ActivityPhotosInputRef>(null)
    /** 영수증: ref로 getReceipts() 호출 → 기존 + 새 업로드 합쳐 ReceiptCreate[] 반환 */
    const receiptInputRef = useRef<ActivityCostReceiptInputRef>(null)
    /** 임시 저장/제출 시 항상 최신 출석 상태 사용 (토글 직후 클로저 스테일 방지) */
    const attendanceRef = useRef<AttendanceResponse[] | undefined>(attendance)
    attendanceRef.current = attendance

    // ---------- API 뮤테이션 ----------
    const updateReport = useUpdateReport()
    const submitReport = useSubmitReport()

    // ---------- 회의 멤버 목록 (출석 없을 때 초기 명단 채우기) ----------
    const { data: councilMembers } = useCouncilMembers(councilId)

    // ---------- 초안 데이터 반영 (GET → 폼 초기화) ----------
    /** 진행중인 월 진입 시 initialReport가 있으면 폼 필드에 채움 */
    useEffect(() => {
        if (!initialReport) return
        setTitle(initialReport.title ?? '')
        setActivityDate(initialReport.activity_date ?? '')
        setLocation(initialReport.location ?? '')
        setContent(initialReport.content ?? '')
        if (initialReport.attendance?.length) {
            const next = initialReport.attendance
            setAttendance(next)
            attendanceRef.current = next
        }
        setReportId(initialReport.id)
    }, [initialReport?.id])

    // ---------- 출석 명단 없을 때 회의 멤버 API로 초기 목록 채우기 ----------
    useEffect(() => {
        if (!councilId || !councilMembers?.length) return
        const fromReport = initialReport?.attendance
        if (fromReport?.length) return
        if (attendance !== undefined && attendance.length > 0) return
        const initial: AttendanceResponse[] = councilMembers.map((m) => ({
            user_id: m.id,
            name: m.name,
            avatar_url: m.avatar_url,
            status: AttendanceStatus.PRESENT,
            confirmation: ConfirmationStatus.PENDING,
            is_leader: m.is_leader,
        }))
        setAttendance(initial)
        attendanceRef.current = initial
    }, [councilId, councilMembers, initialReport?.attendance, attendance?.length])

    /** 참석/불참 토글 시 부모 attendance 상태 반영 → 임시저장/제출 시 서버로 전달 */
    const handleAttendanceStatusChange = useCallback((userId: string, present: boolean) => {
        setAttendance((prev) => {
            if (!prev?.length) return prev
            const next = prev.map((a) =>
                a.user_id === userId
                    ? { ...a, status: present ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT }
                    : a
            )
            attendanceRef.current = next
            return next
        })
    }, [])

    // ---------- 제출 가능 여부 (섹션별 체크) ----------
    const isActivityInfoChecked =
        title.trim().length > 0 && content.trim().length > 0
    const isParticipationChecked = attendance && attendance.length > 0 ? true : false
    const isSubmitEnabled =
        isActivityInfoChecked &&
        isPhotosChecked &&
        isParticipationChecked &&
        isReceiptChecked

    // ---------- 임시 저장 (PATCH) / 제출 공통: 최신 폼으로 PATCH 후 선택적으로 제출 ----------
    /**
     * 활동 사진·영수증은 ref로 각각 업로드 후 URL/ReceiptCreate[] 받아서 body에 담아 PATCH.
     * 제출 시에도 먼저 이걸 호출해 최신 출석 상태를 서버에 반영한 뒤 submit 호출.
     */
    const saveDraftThen = async (afterSave?: (data: { id: string }) => void) => {
        if (!councilId) return
        const [imageUrls, receipts] = await Promise.all([
            photoInputRef.current?.uploadImages() ?? Promise.resolve([]),
            receiptInputRef.current?.getReceipts() ?? Promise.resolve([]),
        ])
        const receiptsPayload: ReceiptCreate[] | null =
            receipts.length > 0 ? receipts : null
        const latestAttendance = attendanceRef.current

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
                    image_urls: imageUrls.length > 0 ? imageUrls : null,
                    receipts: receiptsPayload,
                    attendance: latestAttendance?.map((a) => ({
                        user_id: a.user_id,
                        status: a.status,
                    })),
                },
            },
            {
                onSuccess: (data) => {
                    setReportId(data.id)
                    afterSave?.(data)
                },
            }
        )
    }

    /** 임시 저장만 */
    const handleSaveDraft = () => {
        saveDraftThen()
    }

    /** 제출: 항상 최신 폼(출석 포함)으로 먼저 PATCH 후 submit 호출 */
    const handleSubmit = () => {
        saveDraftThen((data) => {
            submitReport.mutate(data.id)
        })
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

            {/* ---------- 활동 사진 (기존 URL 표시 + 임시 저장 시 image_urls로 전달) ---------- */}
            <ActivityPhotosInput
                ref={photoInputRef}
                existingImageUrls={initialReport?.image_urls ?? undefined}
                onCheckedChange={setIsPhotosChecked}
            />
            <Separator className="mx-4" />

            {/* ---------- 참여 멤버 (출석 명단). 팀장·미제출 시에만 행 토글 표시 ---------- */}
            <ParticipationMemberInput
                attendance={attendance}
                onAttendanceStatusChange={
                    initialReport?.is_submitted ? undefined : handleAttendanceStatusChange
                }
                isChecked={isParticipationChecked}
                isSubmitted={initialReport?.is_submitted ?? false}
            />
            <Separator className="mx-4" />

            {/* ---------- 활동 비용·영수증 (기존 표시 + 임시 저장 시 receipts로 전달) ---------- */}
            <ActivityCostReceiptInput
                ref={receiptInputRef}
                existingReceipts={initialReport?.receipts ?? undefined}
                onCheckedChange={setIsReceiptChecked}
            />

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

export default memo(ReportDetailContentYBLeader)
