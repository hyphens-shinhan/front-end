'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { TOAST_MESSAGES } from '@/constants/toast'
import MonitoringGoalHeader from './MonitoringGoalHeader'
import MonitoringGoalItem from './MonitoringGoalItem'
import MonitoringGoalsSummary from './MonitoringGoalsSummary'
import MonitoringPeriodNotice from './MonitoringPeriodNotice'
import ReportTitle from '../ReportTitle'
import type { ReportMonth } from '@/services/reports'
import MonitoringEvidenceUpload from './MonitoringEvidenceUpload'
import BottomFixedButton from '@/components/common/BottomFixedButton'
import {
  useAcademicReportLookup,
  useCreateAcademicReport,
  useUpdateAcademicReport,
  useSubmitAcademicReport,
} from '@/hooks/academic'
import type { GoalCreate } from '@/types/academic'
import { AcademicGoalCategory } from '@/types/academic'

const INITIAL_GOAL: GoalCreate = {
  category: AcademicGoalCategory.MAJOR_REVIEW,
  content: '',
  achievement_pct: null,
}

function goalsFromReport(
  goals: { category: string; custom_category?: string | null; content: string; achievement_pct?: number | null }[],
): GoalCreate[] {
  return goals.map((g) => ({
    category: g.category as GoalCreate['category'],
    custom_category: g.custom_category ?? undefined,
    content: g.content,
    achievement_pct: g.achievement_pct ?? null,
  }))
}

interface MonitoringContentProps {
  year: number
  month: ReportMonth
}

export default function MonitoringContent({
  year,
  month,
}: MonitoringContentProps) {
  const { data: lookup, isSuccess: lookupSuccess } = useAcademicReportLookup(
    year,
    month,
  )
  const createReport = useCreateAcademicReport()
  const updateReport = useUpdateAcademicReport()
  const submitReport = useSubmitAcademicReport()

  const toast = useToast()
  const report = lookup?.report ?? null
  const isSubmitted = report?.is_submitted ?? false

  const [goals, setGoals] = useState<GoalCreate[]>([{ ...INITIAL_GOAL }, { ...INITIAL_GOAL }])
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([])
  const [showGoalsSummary, setShowGoalsSummary] = useState(false)
  const hasShownSubmittedToast = useRef(false)

  useEffect(() => {
    if (!lookupSuccess || !report) return
    if (report.goals?.length) {
      setGoals(
        goalsFromReport(report.goals).length >= 2
          ? goalsFromReport(report.goals)
          : [...goalsFromReport(report.goals), { ...INITIAL_GOAL }],
      )
    }
    setEvidenceUrls(report.evidence_urls ?? [])
    setShowGoalsSummary(!!report.id && report.goals?.length > 0)
  }, [lookupSuccess, report?.id])

  useEffect(() => {
    if (lookupSuccess && isSubmitted && !hasShownSubmittedToast.current) {
      hasShownSubmittedToast.current = true
      toast.show(TOAST_MESSAGES.MONITORING.SUBMIT_COMPLETE)
    }
  }, [lookupSuccess, isSubmitted, toast])

  const periodLabel = useMemo(
    () => `${month}월 학업 달성 기간은`,
    [month],
  )
  const periodRange = useMemo(() => {
    const start = new Date(year, month - 1, 0)
    const end = new Date(year, month, 0)
    const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`
    return `${fmt(start)}부터 ${fmt(end)}까지`
  }, [year, month])

  const handleAddGoal = () => {
    setGoals((prev) => [...prev, { ...INITIAL_GOAL }])
  }

  const handleRemoveGoal = (index: number) => {
    if (goals.length <= 2) return
    setGoals((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGoalChange = (index: number, next: GoalCreate) => {
    setGoals((prev) => prev.map((g, i) => (i === index ? next : g)))
  }

  /** 달성도 없으면 0으로 채워서 보낼 목표 배열 */
  const goalsForSubmit = useMemo(
    () =>
      goals.map((g) => ({
        ...g,
        achievement_pct: g.achievement_pct ?? 0,
      })),
    [goals]
  )

  const handleSave = async () => {
    if (goals.length < 2) return
    const body = {
      goals: goalsForSubmit,
      evidence_urls: evidenceUrls.length ? evidenceUrls : null,
    }
    if (report && !isSubmitted) {
      await updateReport.mutateAsync({ reportId: report.id, body })
      setShowGoalsSummary(true)
      toast.show(TOAST_MESSAGES.MONITORING.SAVE_SUCCESS)
    } else if (!report) {
      await createReport.mutateAsync({
        year,
        month,
        goals: goalsForSubmit,
        evidence_urls: body.evidence_urls,
      })
      setShowGoalsSummary(true)
      toast.show(TOAST_MESSAGES.MONITORING.SAVE_SUCCESS)
    }
  }

  const handleSubmit = async () => {
    if (!report || isSubmitted) return
    await submitReport.mutateAsync(report.id)
    toast.show(TOAST_MESSAGES.MONITORING.SUBMIT_SUCCESS)
  }

  const isGoalsChecked =
    goals.length >= 2 &&
    goals.every((g) => g.content.trim().length > 0)
  const isEvidenceChecked = evidenceUrls.length >= 1

  /** 저장하기: 제출 전 + 목표 칸 모두 체크(2개 이상, 내용 입력) + 로딩 아님 시에만 활성화 */
  const saveDisabled =
    isSubmitted ||
    !isGoalsChecked ||
    createReport.isPending ||
    updateReport.isPending

  /** 제출하기: 보고서 존재·미제출·로딩 아님 + 학습 목표·증빙 자료 체크 모두 완료 시에만 활성화 */
  const submitDisabled =
    !report ||
    isSubmitted ||
    submitReport.isPending ||
    !isGoalsChecked ||
    !isEvidenceChecked

  return (
    <div className="flex flex-col py-4 pb-40">
      <MonitoringPeriodNotice
        periodLabel={periodLabel}
        periodRange={periodRange}
      />

      {showGoalsSummary ? (
        <>
          <div className="px-4 py-2">
            <ReportTitle title="학습 목표" className="py-0" />
          </div>
          <div className="px-4">
            <MonitoringGoalsSummary
              goals={goals}
              onAchievementChange={(goalIndex, achievementPct) =>
                handleGoalChange(goalIndex, {
                  ...goals[goalIndex],
                  achievement_pct: achievementPct,
                })
              }
            />
          </div>
        </>
      ) : (
        <>
          <MonitoringGoalHeader
            onAddGoal={handleAddGoal}
            isChecked={isGoalsChecked}
          />
          <div className="flex flex-col">
            {goals.map((goal, index) => (
              <MonitoringGoalItem
                key={index}
                goalIndex={index + 1}
                goal={goal}
                onGoalChange={(next) => handleGoalChange(index, next)}
                onRemove={() => handleRemoveGoal(index)}
                canRemove={goals.length > 2}
              />
            ))}
          </div>
        </>
      )}

      {!showGoalsSummary ? (
        <MonitoringEvidenceUpload
          evidenceUrls={evidenceUrls}
          onEvidenceUrlsChange={setEvidenceUrls}
          isChecked={isEvidenceChecked}
          hideUploadButton={false}
        />
      ) : (
        <div className="px-4 py-2">
          <ReportTitle title="증빙자료" className="py-0" />
          {!isEvidenceChecked && (
            <p className="body-7 text-grey-8 mt-2">
              수정하기 버튼을 눌러 증빙자료를 제출해주세요.
            </p>
          )}
        </div>
      )}

      <BottomFixedButton
        label="제출하기"
        size="L"
        type="primary"
        onClick={handleSubmit}
        disabled={submitDisabled}
        secondLabel={showGoalsSummary ? '수정하기' : '저장하기'}
        secondType="secondary"
        secondDisabled={showGoalsSummary ? isSubmitted : saveDisabled}
        onSecondClick={
          showGoalsSummary ? () => setShowGoalsSummary(false) : handleSave
        }
      />
    </div>
  )
}