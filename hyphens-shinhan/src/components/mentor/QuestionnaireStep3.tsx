'use client'

import { useState } from 'react'
import type { MentorshipRequest, DayOfWeek } from '@/types/mentor'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

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
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'body-5 text-grey-11',
  hint: 'body-8 text-grey-8',
  dayButton: cn(
    'body-8 font-semibold py-3 px-4 rounded-xl transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
  ),
  dayButtonSelected: 'bg-primary-secondaryroyal text-white',
  dayButtonUnselected: 'bg-grey-2 text-grey-11 hover:bg-grey-3',
} as const

interface QuestionnaireStep3Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep3({
  initialData,
  onNext,
  onBack,
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

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>가능한 요일을 선택해주세요</h2>
          <p className={stepStyles.hint}>멘토와 만날 수 있는 요일을 선택해주세요.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.value)
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={cn(
                  stepStyles.dayButton,
                  isSelected ? stepStyles.dayButtonSelected : stepStyles.dayButtonUnselected,
                )}
              >
                {day.label}
              </button>
            )
          })}
        </div>
      </div>
      <QuestionnaireStepFooter
        onBack={onBack}
        onNext={handleNext}
        nextDisabled={selectedDays.length === 0}
      />
    </div>
  )
}
