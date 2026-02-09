'use client'

import { useState } from 'react'
import type { MentorshipRequest } from '@/types/mentor'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

const stepStyles = {
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'title-16 text-grey-11 font-semibold',
  hint: 'body-8 text-grey-8',
  textarea: cn(
    'w-full min-h-[112px] px-4 py-3 rounded-2xl border border-grey-2',
    'body-5 text-grey-11 placeholder:text-grey-8 font-semibold',
    'focus:outline-none focus:ring-2 focus:ring-primary-shinhanblue resize-none',
  ),
} as const

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
  const [goalDescription, setGoalDescription] = useState<string>(
    initialData?.goalDescription ?? ''
  )

  const canNext = goalDescription.trim().length > 0

  const handleNext = () => {
    if (!canNext) return
    onNext({
      goalDescription: goalDescription.trim(),
      goalLevel: initialData?.goalLevel ?? 'intermediate',
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>
            멘토링을 통해 얻고 싶은 것을 작성해주세요
          </h2>
          <p className={stepStyles.hint}>자유롭게 입력해주세요</p>
        </div>
        <div className="pt-2">
          <textarea
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            placeholder="예: IT기업에서 프론트엔드 인턴십을 하고 싶습니다"
            className={stepStyles.textarea}
            rows={4}
          />
        </div>
      </div>
      <QuestionnaireStepFooter
        onBack={onBack}
        onNext={handleNext}
        nextDisabled={!canNext}
      />
    </div>
  )
}
