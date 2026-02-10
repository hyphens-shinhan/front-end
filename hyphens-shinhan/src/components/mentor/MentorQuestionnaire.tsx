'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { useHeaderStore } from '@/stores'
import QuestionnaireStep1 from './QuestionnaireStep1'
import QuestionnaireStep2 from './QuestionnaireStep2'
import QuestionnaireStep2b from './QuestionnaireStep2b'
import QuestionnaireStep3 from './QuestionnaireStep3'
import QuestionnaireStep3b from './QuestionnaireStep3b'
import QuestionnaireStep3c from './QuestionnaireStep3c'
import QuestionnaireStep4 from './QuestionnaireStep4'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

export interface QuestionnaireFooterState {
  nextLabel: string
  nextDisabled: boolean
}

interface MentorQuestionnaireProps {
  /** API에서 조회한 내 설문 초기값 (있으면 폼에 채움) */
  initialData?: Partial<MentorshipRequest> | null
  onComplete: (request: MentorshipRequest) => void | Promise<void>
}

export default function MentorQuestionnaire({ initialData, onComplete }: MentorQuestionnaireProps) {
  const router = useRouter()
  const setHandlers = useHeaderStore((s) => s.setHandlers)
  const resetHandlers = useHeaderStore((s) => s.resetHandlers)

  const [currentStep, setCurrentStep] = useState(1)
  const [request, setRequest] = useState<Partial<MentorshipRequest>>({
    ybId: 'yb_1',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [footerState, setFooterState] = useState<QuestionnaireFooterState>({
    nextLabel: '다음',
    nextDisabled: false,
  })
  const nextHandlerRef = useRef<() => void>(() => { })

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setRequest((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    setHandlers({
      onClick: () => {
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem('mentorship_request') : null
          if (stored) {
            const parsed = JSON.parse(stored) as MentorshipRequest
            setRequest(parsed)
            setCurrentStep(1)
          }
        } catch {
          // ignore
        }
      },
    })
    return () => resetHandlers()
  }, [setHandlers, resetHandlers])

  const handleNext = async (stepData: Partial<MentorshipRequest>) => {
    const updatedRequest = { ...request, ...stepData }
    setRequest(updatedRequest)

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    } else {
      const completeRequest: MentorshipRequest = {
        id: `request_${Date.now()}`,
        ybId: updatedRequest.ybId ?? 'yb_1',
        goalCategory: updatedRequest.goalCategory!,
        goalCategories: updatedRequest.goalCategories,
        goalTimeline: updatedRequest.goalTimeline!,
        goalDescription: updatedRequest.goalDescription,
        goalLevel: updatedRequest.goalLevel!,
        availability: updatedRequest.availability!,
        personalityPreferences: updatedRequest.personalityPreferences,
        createdAt: new Date().toISOString(),
      }
      setIsSubmitting(true)
      try {
        await Promise.resolve(onComplete(completeRequest))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  useEffect(() => {
    setFooterState({ nextLabel: '다음', nextDisabled: false })
  }, [currentStep])

  const progressPercent = (currentStep / 7) * 100
  const onRegisterNext = useCallback((fn: () => void) => {
    nextHandlerRef.current = fn
  }, [])
  const footerCallbacks = {
    onFooterChange: setFooterState,
    onRegisterNext,
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>나에게 맞는 멘토 찾기</p>

      <div className={styles.progressSection}>
        <p className={styles.progressText}>{currentStep} / 7</p>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className={styles.stepContent}>
        {currentStep === 1 && (
          <QuestionnaireStep1
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 2 && (
          <QuestionnaireStep2
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 3 && (
          <QuestionnaireStep2b
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 4 && (
          <QuestionnaireStep3
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 5 && (
          <QuestionnaireStep3b
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 6 && (
          <QuestionnaireStep3c
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 7 && (
          <QuestionnaireStep4
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
      </div>

      <QuestionnaireStepFooter
        onBack={handleBack}
        onNext={() => nextHandlerRef.current?.()}
        nextLabel={footerState.nextLabel}
        nextDisabled={footerState.nextDisabled || isSubmitting}
      />
    </div>
  )
}

const styles = {
  wrapper: cn(
    'flex flex-col flex-1 min-h-0',
    'px-4 pt-3 pb-0',
  ),
  subtitle: 'title-16 text-grey-11 font-bold mb-3 shrink-0',
  progressSection: 'flex flex-col gap-2 pb-2 shrink-0',
  progressText: 'body-8 text-grey-10',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-grey-2',
  progressFill: cn(
    'h-full rounded-full transition-[width] duration-300',
    'bg-primary-secondaryroyal',
  ),
  stepContent: 'flex flex-col flex-1 min-h-0 overflow-hidden',
} as const
