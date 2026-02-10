'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest, TimeOfDay } from '@/types/mentor'
import { cn } from '@/utils/cn'

const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: '오전 (6-9시)' },
  { value: 'afternoon', label: '오후 (12-3시)' },
  { value: 'evening', label: '저녁 (6-9시)' },
  { value: 'late_night', label: '밤 (9시-12시)' },
  { value: 'flexible', label: '유연함' },
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

interface QuestionnaireStep3bProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
}

export default function QuestionnaireStep3b({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
}: QuestionnaireStep3bProps) {
  const [selectedTimes, setSelectedTimes] = useState<TimeOfDay[]>(
    initialData?.availability?.timeOfDay ?? []
  )

  const toggleTime = (time: TimeOfDay) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time))
    } else {
      setSelectedTimes([...selectedTimes, time])
    }
  }

  const handleNext = () => {
    if (selectedTimes.length > 0) {
      onNext({
        availability: {
          ...initialData?.availability,
          timeOfDay: selectedTimes,
        } as MentorshipRequest['availability'],
      })
    }
  }

  useEffect(() => {
    onFooterChange?.({ nextLabel: '다음', nextDisabled: selectedTimes.length === 0 })
    onRegisterNext?.(handleNext)
  }, [selectedTimes, onFooterChange, onRegisterNext])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>가능한 시간대를 선택해주세요</h2>
          <p className={stepStyles.hint}>멘토와 만날 수 있는 시간대를 선택해주세요.</p>
        </div>
        <div className="flex flex-col">
          {TIMES.map((time) => {
            const isSelected = selectedTimes.includes(time.value)
            return (
              <label key={time.value} className={stepStyles.optionRow}>
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
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTime(time.value)}
                  className="sr-only"
                />
                <span className={cn(stepStyles.optionLabel, isSelected && stepStyles.optionLabelSelected)}>
                  {time.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
