'use client'

import { useState } from 'react'
import type { MentorshipRequest, GoalTimeline } from '@/types/mentor'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

const TIMELINES: { value: GoalTimeline; label: string }[] = [
  { value: 'short_term', label: '단기 (3개월 이내)' },
  { value: 'medium_term', label: '중기 (6-12개월)' },
  { value: 'long_term', label: '장기 (1-2년)' },
]

const stepStyles = {
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'body-5 text-grey-11',
  hint: 'body-8 text-grey-8',
  optionRow: cn(
    'flex items-center gap-2 py-3 px-0 cursor-pointer min-h-[48px]',
    'border-b border-grey-2 last:border-b-0',
  ),
  optionCircle: cn(
    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-grey-4 transition-colors',
  ),
  optionCircleSelected: 'bg-primary-secondaryroyal',
  optionLabel: 'body-5 text-grey-10 flex-1',
  optionLabelSelected: 'text-grey-11',
} as const

interface QuestionnaireStep2Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep2({
  initialData,
  onNext,
  onBack,
}: QuestionnaireStep2Props) {
  const [goalTimeline, setGoalTimeline] = useState<GoalTimeline | null>(
    initialData?.goalTimeline ?? null
  )

  const handleNext = () => {
    if (goalTimeline) onNext({ goalTimeline })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>목표 기간을 선택해주세요</h2>
          <p className={stepStyles.hint}>멘토링을 통해 달성하고 싶은 목표의 기간을 선택해주세요.</p>
        </div>
        <div className="flex flex-col">
          {TIMELINES.map((timeline) => {
            const isSelected = goalTimeline === timeline.value
            return (
              <label key={timeline.value} className={stepStyles.optionRow}>
                <div
                  className={cn(
                    stepStyles.optionCircle,
                    isSelected && stepStyles.optionCircleSelected,
                  )}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M10 3L4.5 8.5L2 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input
                  type="radio"
                  name="timeline"
                  value={timeline.value}
                  checked={isSelected}
                  onChange={() => setGoalTimeline(timeline.value)}
                  className="sr-only"
                />
                <span className={cn(stepStyles.optionLabel, isSelected && stepStyles.optionLabelSelected)}>
                  {timeline.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
      <QuestionnaireStepFooter onBack={onBack} onNext={handleNext} nextDisabled={!goalTimeline} />
    </div>
  )
}
