'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { hasStoredMentorshipRequest } from '@/components/common/CustomHeader'
import Button from '@/components/common/Button'
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
  /** API에서 조회한 내 설문 초기값 (이전 설문 전체 데이터, 자동 반영 X) */
  initialData?: Partial<MentorshipRequest> | null
  /** query param 등으로 특정 스텝부터 시작하고 싶을 때 (1~7) */
  initialStep?: number
  onComplete: (request: MentorshipRequest) => void | Promise<void>
}

export default function MentorQuestionnaire({ initialData: _initialData, initialStep, onComplete }: MentorQuestionnaireProps) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(() => {
    if (initialStep && initialStep >= 1 && initialStep <= 7) return initialStep
    return 1
  })
  const [request, setRequest] = useState<Partial<MentorshipRequest>>({
    ybId: 'yb_1',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [footerState, setFooterState] = useState<QuestionnaireFooterState>({
    nextLabel: '다음',
    nextDisabled: false,
  })
  /** 이전 설문 반영 시 스텝 컴포넌트 리마운트용 (새 request가 initialData로 들어가게) */
  const [loadVersion, setLoadVersion] = useState(0)
  const [hasPreviousSurvey, setHasPreviousSurvey] = useState(false)
  const nextHandlerRef = useRef<() => void>(() => { })
  /** 뒤로 가기 시 현재 스텝 데이터 저장용 */
  const saveHandlerRef = useRef<() => void>(() => { })
  const didInitStepRef = useRef(false)

  useEffect(() => {
    // 최초 1회만 initialStep 반영 (폼에는 이전 설문 자동 반영 안 함 → 버튼으로만 복원)
    if (didInitStepRef.current) return
    didInitStepRef.current = true
    if (initialStep && initialStep >= 1 && initialStep <= 7) {
      setCurrentStep(initialStep)
    }
  }, [initialStep])

  // 클라이언트에서만 이전 설문 존재 여부 판별해서 버튼 노출 여부 결정
  useEffect(() => {
    if (typeof window === 'undefined') return
    setHasPreviousSurvey(hasStoredMentorshipRequest())
  }, [])

  /** 현재 스텝에 해당하는 이전 설문 데이터만 반환 (폼에 넣을 부분) */
  const getStepSliceFromPrevious = useCallback(
    (step: number, full: MentorshipRequest, prev: Partial<MentorshipRequest>): Partial<MentorshipRequest> => {
      switch (step) {
        case 1:
          return { goalCategory: full.goalCategory, goalCategories: full.goalCategories }
        case 2:
          return { goalTimeline: full.goalTimeline }
        case 3:
          return { goalDescription: full.goalDescription, goalLevel: full.goalLevel }
        case 4:
          return {
            availability: {
              ...prev.availability,
              days: full.availability?.days ?? [],
              timeOfDay: prev.availability?.timeOfDay ?? [],
              preferredFormats: prev.availability?.preferredFormats ?? [],
            },
          }
        case 5:
          return {
            availability: {
              ...prev.availability,
              days: prev.availability?.days ?? [],
              timeOfDay: full.availability?.timeOfDay ?? [],
              preferredFormats: prev.availability?.preferredFormats ?? [],
            },
          }
        case 6:
          return {
            availability: {
              ...prev.availability,
              days: prev.availability?.days ?? [],
              timeOfDay: prev.availability?.timeOfDay ?? [],
              preferredFormats: full.availability?.preferredFormats ?? [],
            },
          }
        case 7:
          return full.personalityPreferences
            ? { personalityPreferences: full.personalityPreferences }
            : {}
        default:
          return {}
      }
    },
    []
  )

  const handleLoadPreviousSurvey = useCallback(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('mentorship_request') : null
      if (!stored) return
      const parsed = JSON.parse(stored) as MentorshipRequest
      if (!parsed || typeof parsed !== 'object') return
      console.log('[이전 설문 불러오기] 불러온 전체 데이터:', parsed)
      setRequest((prev) => {
        const stepSlice = getStepSliceFromPrevious(currentStep, parsed, prev)
        const next = { ...prev, ...stepSlice }
        console.log('[이전 설문 불러오기] 현재 스텝(%d)에 반영한 데이터:', currentStep, stepSlice)
        return next
      })
      setLoadVersion((v) => v + 1)
    } catch {
      // ignore
    }
  }, [currentStep, getStepSliceFromPrevious])

  const handleNext = async (stepData: Partial<MentorshipRequest>) => {
    const updatedRequest = { ...request, ...stepData }
    setRequest(updatedRequest)

    // 다음 버튼 클릭 시 현재까지 담긴 데이터 확인용
    console.log('[MentorQuestionnaire] 다음 버튼 클릭', {
      currentStep,
      stepData,
      mergedRequest: updatedRequest,
    })

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

  /** 스텝 이동 없이 현재 스텝 데이터만 request에 머지 */
  const handleSave = useCallback((stepData: Partial<MentorshipRequest>) => {
    setRequest((prev) => ({ ...prev, ...stepData }))
  }, [])

  const handleBack = () => {
    // 뒤로 가기 전에 현재 스텝 데이터를 저장
    saveHandlerRef.current?.()
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
  const onRegisterSave = useCallback((fn: () => void) => {
    saveHandlerRef.current = fn
  }, [])
  const footerCallbacks = {
    onFooterChange: setFooterState,
    onRegisterNext,
    onSave: handleSave,
    onRegisterSave,
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <p className={styles.subtitle}>나에게 맞는 멘토 찾기</p>
        {hasPreviousSurvey && (
          <Button
            label="이전 설문 불러오기"
            size="S"
            type="secondary"
            className="text-primary-light"
            onClick={handleLoadPreviousSurvey}
          />
        )}
      </div>
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
            key={`step-1-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 2 && (
          <QuestionnaireStep2
            key={`step-2-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 3 && (
          <QuestionnaireStep2b
            key={`step-3-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 4 && (
          <QuestionnaireStep3
            key={`step-4-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 5 && (
          <QuestionnaireStep3b
            key={`step-5-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 6 && (
          <QuestionnaireStep3c
            key={`step-6-${loadVersion}`}
            initialData={request}
            onNext={handleNext}
            onBack={handleBack}
            {...footerCallbacks}
          />
        )}
        {currentStep === 7 && (
          <QuestionnaireStep4
            key={`step-7-${loadVersion}`}
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
  subtitle: 'title-16 text-grey-11 font-bold shrink-0',
  progressSection: 'flex flex-col gap-2 pb-2 shrink-0',
  progressText: 'body-8 text-grey-10',
  progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-grey-2',
  progressFill: cn(
    'h-full rounded-full transition-[width] duration-300',
    'bg-primary-secondaryroyal',
  ),
  headerRow: cn(
    'flex items-center justify-between mb-1',
  ),
  stepContent: 'flex flex-col flex-1 min-h-0 overflow-hidden overflow-y-auto pb-40',
} as const
