'use client'

import BottomFixedButton from '@/components/common/BottomFixedButton'

interface MandatoryGoalBottomButtonsProps {
  onSave: () => void
  onSubmit: () => void
  isSaving: boolean
  isSubmitDisabled: boolean
}

/** 학업 계획서 하단 고정 버튼: 저장하기 / 제출하기 */
export default function MandatoryGoalBottomButtons({
  onSave,
  onSubmit,
  isSaving,
  isSubmitDisabled,
}: MandatoryGoalBottomButtonsProps) {
  return (
    <BottomFixedButton
      label="제출하기"
      size="L"
      type="primary"
      disabled={isSubmitDisabled || isSaving}
      onClick={onSubmit}
      secondLabel="저장하기"
      secondType="secondary"
      secondDisabled={isSaving}
      onSecondClick={onSave}
    />
  )
}
