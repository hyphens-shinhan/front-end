'use client'

import { useCallback, useMemo, memo } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import EmptyContent from '@/components/common/EmptyContent'
import Separator from '@/components/common/Separator'
import { useReport } from '@/hooks/reports/useReports'
import {
  useConfirmAttendance,
  useRejectAttendance,
  useToggleVisibility,
} from '@/hooks/reports/useReportsMutations'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import { useUserStore } from '@/stores'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { ROUTES } from '@/constants'
import { TOAST_MESSAGES } from '@/constants/toast'
import { useToast } from '@/hooks/useToast'
import type { ReportMonth } from '@/services/reports'
import ActivityCostReceipt from './view/ActivityCostReceipt'
import ActivityInfo from './view/ActivityInfo'
import ActivityPhotos from './ActivityPhotos'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import characterImg from '@/assets/character.png'
import ParticipationMemberStatus from './view/ParticipationMemberStatus'
import BottomFixedButton from '@/components/common/BottomFixedButton'

export interface ReportDetailContentYBProps {
  /** 연도 (URL searchParams 또는 목록에서 전달) */
  year: number
  /** 월 (4–12, ReportMonth) */
  month: ReportMonth
}

/**
 * 활동 보고서 상세 (YB) – 메인 컨테이너
 *
 * - 활동 정보, 사진, 참여 현황, 비용·영수증 섹션을 묶어서 표시
 * - council_id는 api/v1/activities 요약에서 해당 연도로 조회 후 reports API에 사용
 * - 헤더 백·목록으로 돌아가기 시 /scholarship?year={year} 로 이동해 선택 연도 유지
 */
function ReportDetailContentYB({
  year,
  month,
}: ReportDetailContentYBProps) {
  const router = useRouter()
  /** 활동 요약에서 해당 연도의 자치회 ID 조회 (reports API용) */
  const { data: activitiesData } = useActivitiesSummary()
  const councilId = useMemo(
    () => activitiesData?.years?.find((y) => y.year === year)?.council_id ?? '',
    [activitiesData, year]
  )

  /** 해당 연·월 활동 보고서 조회 */
  const { data: report, isLoading, isError } = useReport(
    councilId,
    year,
    month
  )

  const toast = useToast()
  const user = useUserStore((s) => s.user)
  const confirmAttendance = useConfirmAttendance()
  const rejectAttendance = useRejectAttendance()
  const toggleVisibility = useToggleVisibility()

  /** EmptyContent 내 목록으로 돌아가기 버튼용 (연도 쿼리 유지) */
  const backToList = useCallback(
    () => router.push(`${ROUTES.SCHOLARSHIP.MAIN}?year=${year}`),
    [router, year]
  )

  const handleConfirm = useCallback(() => {
    if (!report?.id) return
    confirmAttendance.mutate(report.id, {
      onError: () => toast.error(TOAST_MESSAGES.REPORT.ATTENDANCE_ERROR),
    })
  }, [report?.id, confirmAttendance, toast])
  const handleReject = useCallback(() => {
    if (!report?.id) return
    rejectAttendance.mutate(report.id, {
      onError: () => toast.error(TOAST_MESSAGES.REPORT.ATTENDANCE_ERROR),
    })
  }, [report?.id, rejectAttendance, toast])
  const handleExport = useCallback(() => {
    if (!report?.id) return
    toggleVisibility.mutate(report.id, {
      onError: () => toast.error(TOAST_MESSAGES.REPORT.ATTENDANCE_ERROR),
    })
  }, [report?.id, toggleVisibility, toast])

  const activitiesLoading = activitiesData === undefined
  const hasNoCouncil = !activitiesLoading && !councilId

  // ---------- 로딩 ----------
  if (activitiesLoading || (isLoading && councilId)) {
    return (
      <div className={styles.container}>
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
          className="py-20 pb-40"
        />
      </div>
    )
  }

  // ---------- 해당 연도 자치회 없음 ----------
  if (hasNoCouncil) {
    return (
      <div className={cn(styles.container, 'py-8')}>
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY.REPORT_NO_COUNCIL}
          className="py-20"
        />
        <div className={styles.actionWrap}>
          <Button
            label="목록으로 돌아가기"
            size="M"
            type="primary"
            onClick={backToList}
          />
        </div>
      </div>
    )
  }

  // ---------- 에러, 보고서 없음, 또는 해당 월에 제출된 보고서 없음 ----------
  const hasNoSubmittedReport = isError || !report || !report.is_submitted
  if (hasNoSubmittedReport) {
    return (
      <div className={cn(styles.container, 'py-8')}>
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.REPORT}
          subMessage={
            <div className={'flex items-center justify-center p-6'}>
              <Image src={characterImg} alt="신한 캐릭터" width={100} height={100} />
            </div>
          }
          action={
            <Button
              label="팀장에게 요청하기"
              size="M"
              type="primary"
              onClick={backToList}
            />
          }
          className="py-20"
        />
      </div>
    )
  }

  const isSubmitted = report.is_submitted
  const attendance = report.attendance ?? []
  const receipts = report.receipts ?? []
  const myAttendance = attendance.find((a) => a.user_id === user?.id)
  const hasConfirmed = myAttendance?.confirmation === 'CONFIRMED'
  /** 확인 완료 또는 수정 요청 중 하나라도 끝난 뒤에는 둘 다 비활성화 */
  const hasResponded = hasConfirmed
  const canConfirm = isSubmitted && !hasResponded && !!report.id
  const isConfirming = confirmAttendance.isPending || rejectAttendance.isPending
  const isExporting = toggleVisibility.isPending

  // ---------- 정상: 보고서 내용 렌더 ----------
  return (
    <div className={styles.container}>
      {/* 활동 제목·일자·장소·내용 */}
      <ActivityInfo
        title={report.title ?? ''}
        activityDate={report.activity_date}
        location={report.location}
        content={report.content}
      />

      {/* 등록된 사진 (없으면 EmptyContent) */}
      <ActivityPhotos imageUrls={report.image_urls ?? null} />
      <Separator />

      {/* 참석자 현황 (참석 확인 수, 진행바, 멤버 미리보기/상세 링크) */}
      <ParticipationMemberStatus
        attendance={attendance}
        isSubmitted={isSubmitted}
        councilId={councilId}
        year={year}
        month={month}
      />
      <Separator />

      {/* 총 비용·영수증 내역 */}
      <ActivityCostReceipt receipts={receipts} />

      {/** 팀원(YB) 전용: 확인 완료 / 수정 요청. 리더(YB_LEADER)는 다른 버튼 사용 예정 */}
      {user?.role !== 'YB_LEADER' ? (
        <BottomFixedButton
          label="확인 완료"
          size="L"
          type="primary"
          disabled={!canConfirm || isConfirming || hasResponded}
          onClick={handleConfirm}
          secondLabel="수정 요청"
          secondType="warning"
          secondDisabled={!isSubmitted || isConfirming || hasResponded}
          onSecondClick={handleReject}
          topContent={
            <p className="font-caption-caption3 text-grey-9">
              보고서 내용이 사실과 다름없나요?
            </p>
          }
        />
      ) : (
        <BottomFixedButton
          label={report.is_public ? '글 내리기' : '글 올리기'}
          size="L"
          type="secondary"
          disabled={!report.id || isExporting}
          onClick={handleExport}
        />
      )}
    </div>
  )
}

export default memo(ReportDetailContentYB)

const styles = {
  container: cn('flex flex-col px-4 pb-40'),
  /** EmptyContent 아래 목록으로 돌아가기 버튼 래퍼 */
  actionWrap: cn('flex justify-center px-4 pb-8'),
  photosSection: cn('pb-6'),
}
