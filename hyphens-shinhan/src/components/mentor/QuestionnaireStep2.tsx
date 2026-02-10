'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest, GoalTimeline } from '@/types/mentor'
import SelectableOptionRow from './SelectableOptionRow'

const TIMELINES: { value: GoalTimeline; label: string }[] = [
  { value: 'short_term', label: '일회성 상담' },
  { value: 'medium_term', label: '한 달 간 주기적으로' },
  { value: 'long_term', label: '한 달 이상 장기적으로' },
]

const stepStyles = {
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'body-5 text-grey-11',
  hint: 'body-8 text-grey-8',
} as const

interface QuestionnaireStep2Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
}

export default function QuestionnaireStep2({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
}: QuestionnaireStep2Props) {
  const [goalTimeline, setGoalTimeline] = useState<GoalTimeline | null>(
    initialData?.goalTimeline ?? null
  )

  const handleNext = () => {
    if (goalTimeline) onNext({ goalTimeline })
  }

  useEffect(() => {
    onFooterChange?.({ nextLabel: '다음', nextDisabled: !goalTimeline })
    onRegisterNext?.(handleNext)
  }, [goalTimeline, onFooterChange, onRegisterNext])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>목표 기간을 선택해주세요</h2>
          <p className={stepStyles.hint}>멘토링을 통해 달성하고 싶은 목표의 기간을 선택해주세요.</p>
        </div>
        <div className="flex flex-col">
          {TIMELINES.map((timeline) => (
            <SelectableOptionRow
              key={timeline.value}
              value={timeline.value}
              label={timeline.label}
              selected={goalTimeline === timeline.value}
              onToggle={() => setGoalTimeline(timeline.value)}
              name="timeline"
              variant="radio"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
