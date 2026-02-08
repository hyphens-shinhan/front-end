'use client'

import { useState } from 'react'
import type { MentorshipRequest, TimeOfDay } from '@/types/mentor'
import { cn } from '@/utils/cn'

const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: '오전 (6-9시)' },
  { value: 'afternoon', label: '오후 (12-3시)' },
  { value: 'evening', label: '저녁 (6-9시)' },
  { value: 'late_night', label: '밤 (9시-12시)' },
  { value: 'flexible', label: '유연함' },
]

interface QuestionnaireStep3bProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep3b({
  initialData,
  onNext,
  onBack,
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

  return (
    <div className="max-w-[600px] mx-auto">
      <h2 className="font-semibold text-xl text-grey-11 mb-2">가능한 시간대를 선택해주세요</h2>
      <p className="text-sm text-grey-7 mb-8">멘토와 만날 수 있는 시간대를 선택해주세요.</p>
      <div className="space-y-2">
        {TIMES.map((time) => {
          const isSelected = selectedTimes.includes(time.value)
          return (
            <label
              key={time.value}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all',
                isSelected
                  ? 'bg-primary-shinhanblue text-white'
                  : 'bg-grey-2 hover:bg-grey-3 text-grey-11'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded transition-all',
                  isSelected ? 'bg-white' : 'border-2 border-grey-5 bg-transparent'
                )}
              >
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="var(--color-primary-shinhanblue)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleTime(time.value)}
                className="sr-only"
              />
              <span className="font-medium text-sm flex-1">{time.label}</span>
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
          disabled={selectedTimes.length === 0}
          className="flex-1 px-6 py-3 bg-primary-shinhanblue text-white font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          다음
        </button>
      </div>
    </div>
  )
}
