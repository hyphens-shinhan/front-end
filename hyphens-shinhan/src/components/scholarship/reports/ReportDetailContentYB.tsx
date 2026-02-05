'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import EmptyContent from '@/components/common/EmptyContent'
import Separator from '@/components/common/Separator'
import { useReport } from '@/hooks/reports/useReports'
import { useActivitiesSummary } from '@/hooks/activities/useActivities'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import { ROUTES } from '@/constants'
import type { ReportMonth } from '@/services/reports'
import ActivityCostReceipt from './ActivityCostReceipt'
import ActivityInfo from './view/ActivityInfo'
import ActivityPhotos from './ActivityPhotos'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import characterImg from '@/assets/character.png'
import ReportTitle from './ReportTitle'
import ProgressBar from '@/components/common/ProgressBar'
import MemberPreviewRow from './MemberPreviewRow'

interface ReportDetailContentYBProps {
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
export default function ReportDetailContentYB({
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
  const { data: report, isLoading, isError, error } = useReport(
    councilId,
    year,
    month
  )

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

  /** EmptyContent 내 목록으로 돌아가기 버튼용 (연도 쿼리 유지) */
  const backToList = () => router.push(`${ROUTES.SCHOLARSHIP.MAIN}?year=${year}`)

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

  // ---------- 에러 또는 보고서 없음 ----------
  if (isError || !report) {
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

  const isSubmitted = !!report.submitted_at

  // ---------- 정상: 보고서 내용 렌더 ----------
  return (
    <div className={styles.container}>
      {/* 활동 제목·일자·장소·내용 */}
      <ActivityInfo
        title={report.title}
        activityDate={report.activity_date}
        location={report.location}
        content={report.content}
      />

      {/* 등록된 사진 (없으면 EmptyContent) */}
      <ActivityPhotos imageUrls={report.image_urls} />
      <Separator />

      {/* 출석률, 참여 멤버 목록, 불참/출석 버튼 (미제출 시만) */}
      <div>
        <ReportTitle title="참여 현황" className="py-4.5" />
        <div className='flex gap-2 body-8 text-grey-10'>
          <p>참석 확인</p>
          <p>9 / 10</p>
        </div>
        <ProgressBar value={50} max={100} className='my-2' />
        {/* 참여 멤버 목록 - 제출 완료 뷰에서는 링크(오른쪽 화살표), 미제출은 토글 */}
        <MemberPreviewRow
          members={report.attendance.map((a) => a.name)}
          isOpen={false}
          onToggle={() => { }}
          attendanceCount={report.attendance.length}
          className="py-5"
          href={
            isSubmitted && councilId
              ? `${ROUTES.SCHOLARSHIP.REPORT.PARTICIPATION}?year=${year}&month=${month}&councilId=${councilId}`
              : undefined
          }
        />
      </div>
      <Separator />
      {/* 총 비용·영수증 내역, 확인 완료 버튼 */}
      <ActivityCostReceipt receipts={report.receipts} />
    </div>
  )
}

const styles = {
  container: cn('flex flex-col px-4 pb-40'),
  /** EmptyContent 아래 목록으로 돌아가기 버튼 래퍼 */
  actionWrap: cn('flex justify-center px-4 pb-8'),
  photosSection: cn('pb-6'),
}
