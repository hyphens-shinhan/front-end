'use client'

import { useEffect, useMemo, useState } from 'react'
import MonitoringGoalHeader from './MonitoringGoalHeader'
import MonitoringGoalItem from './MonitoringGoalItem'
import MonitoringPeriodNotice from './MonitoringPeriodNotice'
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

  const report = lookup?.report ?? null
  const isSubmitted = report?.is_submitted ?? false

  const [goals, setGoals] = useState<GoalCreate[]>([{ ...INITIAL_GOAL }, { ...INITIAL_GOAL }])
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([])

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
  }, [lookupSuccess, report?.id])

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

  const handleSave = async () => {
    if (goals.length < 2) return
    const body = {
      goals,
      evidence_urls: evidenceUrls.length ? evidenceUrls : null,
    }
    if (report && !isSubmitted) {
      await updateReport.mutateAsync({ reportId: report.id, body })
    } else if (!report) {
      await createReport.mutateAsync({
        year,
        month,
        goals,
        evidence_urls: body.evidence_urls,
      })
    }
  }

  const handleSubmit = async () => {
    if (!report || isSubmitted) return
    await submitReport.mutateAsync(report.id)
  }

  const saveDisabled =
    isSubmitted || goals.length < 2 || createReport.isPending || updateReport.isPending
  const submitDisabled =
    !report || isSubmitted || submitReport.isPending

  const isGoalsChecked =
    goals.length >= 2 &&
    goals.every((g) => g.content.trim().length > 0)
  const isEvidenceChecked = evidenceUrls.length >= 1

  return (
    <div className="flex flex-col py-4 pb-40">
      <MonitoringPeriodNotice
        periodLabel={periodLabel}
        periodRange={periodRange}
      />

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

      <MonitoringEvidenceUpload
        evidenceUrls={evidenceUrls}
        onEvidenceUrlsChange={setEvidenceUrls}
        isChecked={isEvidenceChecked}
      />

      <BottomFixedButton
        label="제출하기"
        size="L"
        type="primary"
        onClick={handleSubmit}
        disabled={submitDisabled}
        secondLabel="저장하기"
        secondType="secondary"
        secondDisabled={saveDisabled}
        onSecondClick={handleSave}
      />
    </div>
  )
}