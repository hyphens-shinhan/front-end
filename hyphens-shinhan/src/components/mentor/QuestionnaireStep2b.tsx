'use client'

import { useState } from 'react'
import type { MentorshipRequest, ExpertiseLevel } from '@/types/mentor'
import { cn } from '@/utils/cn'

const EXPERTISE_LEVELS: { value: ExpertiseLevel; label: string }[] = [
  { value: 'beginner', label: '초급 수준의 가이드' },
  { value: 'intermediate', label: '중급 수준의 가이드' },
  { value: 'advanced', label: '고급 수준의 가이드' },
]

interface QuestionnaireStep2bProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep2b({
  initialData,
  onNext,
  onBack,
}: QuestionnaireStep2bProps) {
  const [goalLevel, setGoalLevel] = useState<ExpertiseLevel | null>(
    initialData?.goalLevel ?? null
  )
  const [goalDescription, setGoalDescription] = useState<string>(
    initialData?.goalDescription ?? ''
  )

  const handleNext = () => {
    if (goalLevel) {
      onNext({
        goalLevel,
        goalDescription: goalDescription.trim() || undefined,
      })
    }
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <h2 className="font-semibold text-xl text-grey-11 mb-2">
        필요한 멘토 수준을 선택해주세요
      </h2>
      <p className="text-sm text-grey-7 mb-8">원하는 멘토의 전문성 수준을 선택해주세요.</p>
      <div className="space-y-6">
        <div className="space-y-2">
          {EXPERTISE_LEVELS.map((level) => {
            const isSelected = goalLevel === level.value
            return (
              <label
                key={level.value}
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
                  name="level"
                  value={level.value}
                  checked={isSelected}
                  onChange={() => setGoalLevel(level.value)}
                  className="sr-only"
                />
                <span className="font-medium text-sm flex-1">{level.label}</span>
              </label>
            )
          })}
        </div>
        <div>
          <label className="block font-medium text-sm text-grey-11 mb-3">
            목표 설명 (선택사항)
          </label>
          <textarea
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            placeholder="예: 테크 업계에서 인턴십을 얻고 싶습니다"
            className="w-full px-4 py-3 border border-grey-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue focus:border-transparent resize-none text-grey-11 placeholder:text-grey-5"
            rows={4}
          />
        </div>
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
          disabled={!goalLevel}
          className="flex-1 px-6 py-3 bg-primary-shinhanblue text-white font-medium text-sm rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          다음
        </button>
      </div>
    </div>
  )
}
