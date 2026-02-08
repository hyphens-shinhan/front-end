'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { ROUTES } from '@/constants'
import QuestionnaireStep1 from './QuestionnaireStep1'
import QuestionnaireStep2 from './QuestionnaireStep2'
import QuestionnaireStep2b from './QuestionnaireStep2b'
import QuestionnaireStep3 from './QuestionnaireStep3'
import QuestionnaireStep3b from './QuestionnaireStep3b'
import QuestionnaireStep3c from './QuestionnaireStep3c'
import QuestionnaireStep4 from './QuestionnaireStep4'

interface MentorQuestionnaireProps {
  onComplete: (request: MentorshipRequest) => void
}

export default function MentorQuestionnaire({ onComplete }: MentorQuestionnaireProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [request, setRequest] = useState<Partial<MentorshipRequest>>({
    ybId: 'yb_1',
  })

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

  return (
    <div className="min-h-screen bg-white pt-px">
      <main>
        <div className="max-w-[600px] mx-auto px-5 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-[13px] text-grey-7 tracking-[-0.02em] mb-2">
              {currentStep} / 7
            </p>
            <div className="w-full h-[3px] bg-grey-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-shinhanblue rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </div>

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
      </main>
    </div>
  )
}
