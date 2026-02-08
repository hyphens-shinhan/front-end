'use client'

import { useState } from 'react'
import type { MentorshipRequest, DayOfWeek } from '@/types/mentor'
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
    <div className="max-w-[600px] mx-auto">
      <h2 className="font-semibold text-xl text-grey-11 mb-2">가능한 요일을 선택해주세요</h2>
      <p className="text-sm text-grey-7 mb-8">멘토와 만날 수 있는 요일을 선택해주세요.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value)
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={cn(
                'px-4 py-3 rounded-xl font-medium text-sm transition-all',
                isSelected
                  ? 'bg-primary-shinhanblue text-white'
                  : 'bg-grey-2 text-grey-11 hover:bg-grey-3'
              )}
            >
              {day.label}
            </button>
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
          disabled={selectedDays.length === 0}
          className="flex-1 px-6 py-3 bg-primary-shinhanblue text-white font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          다음
        </button>
      </div>
    </div>
  )
}
