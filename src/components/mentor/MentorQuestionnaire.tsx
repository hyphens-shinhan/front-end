'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { ROUTES } from '@/constants'
import { useHeaderStore } from '@/stores'
import QuestionnaireStep1 from './QuestionnaireStep1'
import QuestionnaireStep2 from './QuestionnaireStep2'
import QuestionnaireStep2b from './QuestionnaireStep2b'
import QuestionnaireStep3 from './QuestionnaireStep3'
import QuestionnaireStep3b from './QuestionnaireStep3b'
import QuestionnaireStep3c from './QuestionnaireStep3c'
import QuestionnaireStep4 from './QuestionnaireStep4'
import { cn } from '@/utils/cn'

interface MentorQuestionnaireProps {
  onComplete: (request: MentorshipRequest) => void
}

export default function MentorQuestionnaire({ onComplete }: MentorQuestionnaireProps) {
  const router = useRouter()
  const setHandlers = useHeaderStore((s) => s.setHandlers)
  const resetHandlers = useHeaderStore((s) => s.resetHandlers)

  const [currentStep, setCurrentStep] = useState(1)
  const [request, setRequest] = useState<Partial<MentorshipRequest>>({
    ybId: 'yb_1',
  })

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

  const handleNext = (stepData: Partial<MentorshipRequest>) => {
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
      onComplete(completeRequest)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const progressPercent = (currentStep / 7) * 100

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
          />
        )}
        {currentStep === 2 && (
          <QuestionnaireStep2
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <QuestionnaireStep2b
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <QuestionnaireStep3
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <QuestionnaireStep3b
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 6 && (
          <QuestionnaireStep3c
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 7 && (
          <QuestionnaireStep4
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: cn(
    'flex flex-col flex-1 min-h-0',
    'px-4 pt-3 pb-0',
  ),
  subtitle: 'title-16 text-grey-11 font-bold mb-2 shrink-0',
  progressSection: 'flex flex-col gap-2 pb-2 shrink-0',
  progressText: 'body-8 text-grey-10',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-grey-2',
  progressFill: cn(
    'h-full rounded-full transition-[width] duration-300',
    'bg-primary-secondaryroyal',
  ),
  stepContent: 'flex flex-col flex-1 min-h-0 overflow-hidden',
} as const
