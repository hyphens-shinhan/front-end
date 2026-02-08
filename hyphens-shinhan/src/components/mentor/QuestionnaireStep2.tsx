'use client'

import { useState } from 'react'
import type { MentorshipRequest, GoalTimeline } from '@/types/mentor'
import { cn } from '@/utils/cn'

const TIMELINES: { value: GoalTimeline; label: string }[] = [
  { value: 'short_term', label: '단기 (3개월 이내)' },
  { value: 'medium_term', label: '중기 (6-12개월)' },
  { value: 'long_term', label: '장기 (1-2년)' },
]

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
    <div className="max-w-[600px] mx-auto">
      <h2 className="font-semibold text-xl text-grey-11 mb-2">목표 기간을 선택해주세요</h2>
      <p className="text-sm text-grey-7 mb-8">
        멘토링을 통해 달성하고 싶은 목표의 기간을 선택해주세요.
      </p>
      <div className="space-y-2">
        {TIMELINES.map((timeline) => {
          const isSelected = goalTimeline === timeline.value
          return (
            <label
              key={timeline.value}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all',
                isSelected
                  ? 'bg-primary-shinhanblue text-white'
                  : 'bg-grey-2 hover:bg-grey-3 text-grey-11'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full transition-all',
                  isSelected ? 'bg-white' : 'border-2 border-grey-5 bg-transparent'
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 bg-primary-shinhanblue rounded-full" />
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
              <span className="font-medium text-sm flex-1">{timeline.label}</span>
            </label>
          )
        })}
      </div>
      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 bg-grey-2 text-grey-7 font-medium text-sm rounded-lg hover:bg-grey-3 transition-colors"
        >
          뒤로
        </button>
        <button
          onClick={handleNext}
          disabled={!goalTimeline}
          className="flex-1 px-6 py-3 bg-primary-shinhanblue text-white font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          다음
        </button>
      </div>
    </div>
  )
}
