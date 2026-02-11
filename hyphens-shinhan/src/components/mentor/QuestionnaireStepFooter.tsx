'use client'

import BottomFixedButton from '@/components/common/BottomFixedButton'

interface QuestionnaireStepFooterProps {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextLabel?: string
}

export default function QuestionnaireStepFooter({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = '다음',
}: QuestionnaireStepFooterProps) {
  return (
    <BottomFixedButton
      label={nextLabel}
      size="L"
      type="primary"
      disabled={nextDisabled}
      onClick={onNext}
      secondLabel="뒤로 가기"
      secondType="secondary"
      onSecondClick={onBack}
    />
  )
}
