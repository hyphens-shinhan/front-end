'use client'

import { cn } from '@/utils/cn'

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
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={onBack}
        className={styles.backButton}
      >
        뒤로 가기
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(styles.nextButton, nextDisabled && styles.nextButtonDisabled)}
      >
        {nextLabel}
      </button>
    </div>
  )
}

const styles = {
  wrapper: 'flex shrink-0 items-center justify-center gap-2 pt-4 pb-8',
  backButton: cn(
    'body-5 text-grey-9',
    'min-w-[176px] py-3 px-[60px]',
    'rounded-2xl border border-grey-2 bg-white',
    'shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.04)]',
    'hover:bg-grey-1-1 transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
  ),
  nextButton: cn(
    'body-5 font-semibold',
    'min-w-[176px] py-3 px-[60px]',
    'rounded-2xl bg-primary-shinhanblue text-white',
    'shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.04)]',
    'hover:opacity-90 transition-opacity disabled:cursor-not-allowed',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
  ),
  nextButtonDisabled: 'text-grey-6 bg-grey-3 hover:opacity-100',
} as const
