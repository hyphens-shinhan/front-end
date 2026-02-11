'use client'

import { useState, useEffect } from 'react'
import type {
  MentorshipRequest,
  CommunicationStyle,
  MentorshipStyle,
  PersonalityTraits,
} from '@/types/mentor'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'
import SelectableOptionRow from './SelectableOptionRow'

const COMMUNICATION: { value: CommunicationStyle; label: string }[] = [
  { value: 'direct', label: '직설적이고 명확한' },
  { value: 'supportive', label: '부드럽고 지지해주는' },
  { value: 'collaborative', label: '수평적이고 편안한' },
]

const MENTORING_STYLE: { value: MentorshipStyle; label: string }[] = [
  { value: 'hands_on', label: '실습 중심의 멘토링' },
  { value: 'advisory', label: '조언 및 상담 중심의 멘토링' },
  { value: 'inspirational', label: '인사이트와 영감을 주는 멘토링' },
]

interface QuestionnaireStep4Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
  onSave?: (data: Partial<MentorshipRequest>) => void
  onRegisterSave?: (fn: () => void) => void
}

export default function QuestionnaireStep4({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
  onSave,
  onRegisterSave,
}: QuestionnaireStep4Props) {
  const [communicationStyles, setCommunicationStyles] = useState<CommunicationStyle[]>(
    initialData?.personalityPreferences?.communicationStyles ??
    (initialData?.personalityPreferences?.communicationStyle
      ? [initialData.personalityPreferences.communicationStyle]
      : [])
  )
  const [mentorshipStyles, setMentorshipStyles] = useState<MentorshipStyle[]>(
    initialData?.personalityPreferences?.mentorshipStyles ??
    (initialData?.personalityPreferences?.mentorshipStyle
      ? [initialData.personalityPreferences.mentorshipStyle]
      : [])
  )

  const handleNext = () => {
    const personalityPreferences: PersonalityTraits = {}
    if (communicationStyles.length) personalityPreferences.communicationStyles = communicationStyles
    if (mentorshipStyles.length) personalityPreferences.mentorshipStyles = mentorshipStyles
    onNext({
      personalityPreferences:
        Object.keys(personalityPreferences).length > 0
          ? personalityPreferences
          : undefined,
    })
  }

  useEffect(() => {
    onFooterChange?.({ nextLabel: '멘토 찾기', nextDisabled: false })
    onRegisterNext?.(handleNext)
    onRegisterSave?.(() => {
      const personalityPreferences: PersonalityTraits = {}
      if (communicationStyles.length) personalityPreferences.communicationStyles = communicationStyles
      if (mentorshipStyles.length) personalityPreferences.mentorshipStyles = mentorshipStyles
      onSave?.({
        personalityPreferences:
          Object.keys(personalityPreferences).length > 0 ? personalityPreferences : undefined,
      })
    })
  }, [communicationStyles, mentorshipStyles, onFooterChange, onRegisterNext, onRegisterSave, onSave])

  return (
    <div className={stepStyles.wrapper}>
      <div className={stepStyles.scrollArea}>
        <QuestionnaireQuestionBlock
          title="선호하는 멘토님의 스타일을 선택해주세요"
          hint="복수 선택 가능, 선택하지 않으면 상관없음으로 매칭됩니다"
          titleVariant="large"
        />
        <div className={stepStyles.content}>
          <p className={stepStyles.sectionTitle}>소통 방식</p>
          <div className={stepStyles.sectionOptions}>
            {COMMUNICATION.map((opt) => (
              <SelectableOptionRow
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={communicationStyles.includes(opt.value)}
                onToggle={() =>
                  setCommunicationStyles((prev) =>
                    prev.includes(opt.value)
                      ? prev.filter((v) => v !== opt.value)
                      : [...prev, opt.value]
                  )
                }
                name="communicationStyle"
                variant="checkbox"
              />
            ))}
          </div>
          <p className={stepStyles.sectionTitle}>멘토링 방식</p>
          <div className={stepStyles.sectionOptions}>
            {MENTORING_STYLE.map((opt) => (
              <SelectableOptionRow
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={mentorshipStyles.includes(opt.value)}
                onToggle={() =>
                  setMentorshipStyles((prev) =>
                    prev.includes(opt.value)
                      ? prev.filter((v) => v !== opt.value)
                      : [...prev, opt.value]
                  )
                }
                name="mentorshipStyle"
                variant="checkbox"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const stepStyles = {
  wrapper: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  content: 'pt-2',
  sectionTitle: 'body-8 text-grey-9 font-bold py-3',
  sectionOptions: 'flex flex-col',
} as const
