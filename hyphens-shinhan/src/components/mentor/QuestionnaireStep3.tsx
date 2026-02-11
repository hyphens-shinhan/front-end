'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest, DayOfWeek } from '@/types/mentor'
import SelectableOptionRow from './SelectableOptionRow'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' },
]

const stepStyles = {
  wrapper: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  options: 'flex flex-col',
} as const

interface QuestionnaireStep3Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
  onSave?: (data: Partial<MentorshipRequest>) => void
  onRegisterSave?: (fn: () => void) => void
}

export default function QuestionnaireStep3({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
  onSave,
  onRegisterSave,
}: QuestionnaireStep3Props) {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialData?.availability?.days ?? []
  )

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const handleNext = () => {
    if (selectedDays.length > 0) {
      onNext({
        availability: {
          ...initialData?.availability,
          days: selectedDays,
        } as MentorshipRequest['availability'],
      })
    }
  }

  useEffect(() => {
    onFooterChange?.({ nextLabel: '다음', nextDisabled: selectedDays.length === 0 })
    onRegisterNext?.(handleNext)
    onRegisterSave?.(() => {
      onSave?.({
        availability: {
          ...initialData?.availability,
          days: selectedDays,
        } as MentorshipRequest['availability'],
      })
    })
  }, [selectedDays, initialData?.availability, onFooterChange, onRegisterNext, onRegisterSave, onSave])

  return (
    <div className={stepStyles.wrapper}>
      <div className={stepStyles.scrollArea}>
        <QuestionnaireQuestionBlock
          title="가능한 요일을 선택해주세요"
          hint="멘토와 만날 수 있는 요일을 선택해주세요."
        />
        <div className={stepStyles.options}>
          {DAYS.map((day) => (
            <SelectableOptionRow
              key={day.value}
              value={day.value}
              label={day.label}
              selected={selectedDays.includes(day.value)}
              onToggle={() => toggleDay(day.value)}
              name="days"
              variant="checkbox"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
