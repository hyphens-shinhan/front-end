'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest } from '@/types/mentor'
import { useAutoResize } from '@/hooks/useAutoResize'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'
import { cn } from '@/utils/cn'

interface QuestionnaireStep2bProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
  onSave?: (data: Partial<MentorshipRequest>) => void
  onRegisterSave?: (fn: () => void) => void
}

export default function QuestionnaireStep2b({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
  onSave,
  onRegisterSave,
}: QuestionnaireStep2bProps) {
  const [goalDescription, setGoalDescription] = useState<string>(
    initialData?.goalDescription ?? ''
  )
  const { textareaRef, handleResize } = useAutoResize()

  // 비어 있는지만 trim으로 체크하고, 실제 저장 값은 사용자가 입력한 그대로 보존
  const canNext = goalDescription.trim().length > 0

  useEffect(() => {
    handleResize()
  }, [handleResize])

  const handleNext = () => {
    if (!canNext) return
    onNext({
      goalDescription,
      goalLevel: initialData?.goalLevel ?? 'intermediate',
    })
  }

  useEffect(() => {
    onFooterChange?.({ nextLabel: '다음', nextDisabled: !canNext })
    onRegisterNext?.(handleNext)
    onRegisterSave?.(() => {
      onSave?.({
        goalDescription,
        goalLevel: initialData?.goalLevel ?? 'intermediate',
      })
    })
  }, [canNext, goalDescription, initialData?.goalLevel, onFooterChange, onRegisterNext, onRegisterSave, onSave])

  return (
    <div className={stepStyles.wrapper}>
      <QuestionnaireQuestionBlock
        title="멘토링을 통해 얻고 싶은 것을 작성해주세요"
        hint="자유롭게 입력해주세요"
      />
      <div className={stepStyles.textareaWrapper}>
        <textarea
          name="goalDescription"
          ref={textareaRef}
          value={goalDescription}
          onChange={(e) => setGoalDescription(e.target.value)}
          onInput={handleResize}
          placeholder="예: IT기업에서 프론트엔드 인턴십을 하고 싶습니다"
          className={stepStyles.textarea}
          rows={1}
        />
      </div>
    </div>
  )
}

const stepStyles = {
  wrapper: 'flex flex-col flex-1',
  textareaWrapper: 'flex flex-col pt-1.5 overflow-visible',
  textarea: cn(
    'w-full min-h-[112px] px-4 py-3 rounded-[16px] border border-grey-2 scrollbar-hide',
    'body-6 text-grey-11 placeholder:text-grey-8 placeholder:body-5',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-secondarysky resize-none',
  ),
} as const
