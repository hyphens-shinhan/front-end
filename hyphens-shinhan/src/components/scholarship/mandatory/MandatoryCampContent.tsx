'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import ActivityInfoInput from '@/components/scholarship/reports/create/ActivityInfoInput'
import Separator from '@/components/common/Separator'
import ActivityPhotosInput, {
  type ActivityPhotosInputRef,
} from '@/components/scholarship/reports/create/ActivityPhotosInput'
import BottomFixedButton from '@/components/common/BottomFixedButton'
import { useMandatoryActivityLookup } from '@/hooks/mandatory/useMandatory'
import {
  useCreateSubmissionReport,
  useUpdateSubmissionReport,
  useSubmitSubmission,
} from '@/hooks/mandatory/useMandatoryMutations'
import { useConfirmModalStore } from '@/stores'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'

interface MandatoryCampContentProps {
  activityId: string
}

/** 연간 필수 활동 – 장학캠프(SIMPLE_REPORT). 자치회 활동 YB_LEADER 페이지와 동일 UI, 멤버 섹션만 제외, API는 mandatory 사용 */
function MandatoryCampContent({ activityId }: MandatoryCampContentProps) {
  const { data, isLoading, isError } = useMandatoryActivityLookup(activityId)
  const createReport = useCreateSubmissionReport()
  const updateReport = useUpdateSubmissionReport()
  const submitReport = useSubmitSubmission()
  const openConfirmModal = useConfirmModalStore((s) => s.onOpen)
  const toast = useToast()
  const photoInputRef = useRef<ActivityPhotosInputRef>(null)

  const [reportTitle, setReportTitle] = useState('')
  const [reportContent, setReportContent] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [location, setLocation] = useState('')
  const [isPhotosChecked, setIsPhotosChecked] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const activity = data?.activity ?? null
  const submission = data?.submission ?? null
  const isSubmitted = submission?.is_submitted ?? false

  /** 초안 데이터 반영 */
  useEffect(() => {
    if (!submission) return
    setReportTitle(submission.report_title ?? '')
    setReportContent(submission.report_content ?? '')
    setActivityDate(submission.activity_date ?? '')
    setLocation(submission.location ?? '')
    setSubmissionId(submission.id)
  }, [submission?.id])

  const isActivityInfoChecked =
    reportTitle.trim().length > 0 && reportContent.trim().length > 0
  const isSubmitEnabled =
    isActivityInfoChecked && isPhotosChecked && !isSubmitted
  const isSaving = createReport.isPending || updateReport.isPending || submitReport.isPending

  const saveDraftThen = useCallback(
    async (afterSave?: (id: string) => void) => {
      const imageUrls =
        (await photoInputRef.current?.uploadImages()) ?? []
      const body = {
        report_title: reportTitle || '',
        report_content: reportContent || '',
        activity_date: activityDate || new Date().toISOString().slice(0, 10),
        location: location || '',
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      }

      if (submissionId) {
        updateReport.mutate(
          { submissionId, body },
          {
            onSuccess: (res) => {
              setSubmissionId(res.id)
              if (!afterSave) toast.show(TOAST_MESSAGES.REPORT.DRAFT_SAVE_SUCCESS)
              afterSave?.(res.id)
            },
            onError: () => toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
          }
        )
      } else {
        createReport.mutate(
          { activityId, body },
          {
            onSuccess: (res) => {
              setSubmissionId(res.id)
              if (!afterSave) toast.show(TOAST_MESSAGES.REPORT.DRAFT_SAVE_SUCCESS)
              afterSave?.(res.id)
            },
            onError: () => toast.error(TOAST_MESSAGES.REPORT.DRAFT_SAVE_ERROR),
          }
        )
      }
    },
    [
      activityId,
      submissionId,
      reportTitle,
      reportContent,
      activityDate,
      location,
      updateReport,
      createReport,
      toast,
    ]
  )

  const handleSubmit = useCallback(() => {
    openConfirmModal({
      title: '모두 잘 입력했나요?',
      content: (
        <div className="flex items-center justify-center body-7 text-grey-10">
          제출 후에는 임의로 수정할 수 없어요.
        </div>
      ),
      confirmText: '제출하기',
      onConfirm: () => {
        saveDraftThen((id) => {
          submitReport.mutate(id, {
            onSuccess: () => toast.show(TOAST_MESSAGES.REPORT.SUBMIT_SUCCESS),
            onError: () => toast.error(TOAST_MESSAGES.REPORT.SUBMIT_ERROR),
          })
        })
      },
    })
  }, [openConfirmModal, saveDraftThen, submitReport, toast])

  if (isLoading) {
    return (
      <div className="flex flex-col py-20 pb-40">
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col px-4 py-8">
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="flex flex-col px-4 py-8">
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  const displayDate =
    activityDate || 'YYYY.MM.DD'

  return (
    <div className="flex flex-col pb-40">
      {/* 활동 정보 (제목·일자·장소·내용) - 멤버 섹션 없음 */}
      <ActivityInfoInput
        title={reportTitle}
        date={displayDate}
        location={location}
        description={reportContent}
        setTitle={setReportTitle}
        setDescription={setReportContent}
        setDate={setActivityDate}
        setLocation={setLocation}
        isTitleChecked={isActivityInfoChecked}
      />
      <Separator className="mx-4" />

      {/* 활동 사진 */}
      <ActivityPhotosInput
        ref={photoInputRef}
        existingImageUrls={submission?.image_urls ?? undefined}
        onCheckedChange={setIsPhotosChecked}
      />

      {/* 제출 / 임시 저장 버튼 */}
      {!isSubmitted && (
        <BottomFixedButton
          label="제출"
          size="L"
          type="primary"
          disabled={!isSubmitEnabled || isSaving}
          onClick={handleSubmit}
          secondLabel="임시 저장"
          secondType="secondary"
          secondDisabled={isSaving}
          onSecondClick={() => saveDraftThen()}
        />
      )}
    </div>
  )
}

export default memo(MandatoryCampContent)
