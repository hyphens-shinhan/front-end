'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest, TimeOfDay } from '@/types/mentor'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'
import SelectableOptionRow from './SelectableOptionRow'

const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: '오전 9시 ~ 오후 12시' },
  { value: 'afternoon', label: '오후 12시 ~ 오후 3시' },
  { value: 'evening', label: '오후 3시 ~ 오후 6시' },
  { value: 'late_night', label: '오후 6시 ~ 오후 9시' },
  { value: 'flexible', label: '그 외 시간대' },
]

interface QuestionnaireStep3bProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
  onSave?: (data: Partial<MentorshipRequest>) => void
  onRegisterSave?: (fn: () => void) => void
}

export default function QuestionnaireStep3b({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
  onSave,
  onRegisterSave,
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
    onRegisterSave?.(() => {
      onSave?.({
        availability: {
          ...initialData?.availability,
          timeOfDay: selectedTimes,
        } as MentorshipRequest['availability'],
      })
    })
  }, [selectedTimes, initialData?.availability, onFooterChange, onRegisterNext, onRegisterSave, onSave])

  return (
    <div className={stepStyles.wrapper}>
      <div className={stepStyles.scrollArea}>
        <QuestionnaireQuestionBlock
          title="가능한 시간대를 선택해주세요"
          hint="멘토와 만날 수 있는 시간대를 선택해주세요."
        />
        <div className={stepStyles.options}>
          {TIMES.map((time) => (
            <SelectableOptionRow
              key={time.value}
              value={time.value}
              label={time.label}
              selected={selectedTimes.includes(time.value)}
              onToggle={() => toggleTime(time.value)}
              name="timeOfDay"
              variant="checkbox"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const stepStyles = {
  wrapper: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  options: 'flex flex-col',
} as const
