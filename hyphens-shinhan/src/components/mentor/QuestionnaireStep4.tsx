'use client'

import { useState, useEffect } from 'react'
import type {
  MentorshipRequest,
  CommunicationStyle,
  MentorshipStyle,
  PersonalityTraits,
} from '@/types/mentor'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'
import { cn } from '@/utils/cn'

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

const stepStyles = {
  sectionTitle: 'body-8 text-grey-9 font-bold py-3',
  optionRow: cn(
    'flex items-center gap-2 py-3 px-4 cursor-pointer min-h-[48px]',
    'border-b border-grey-2 last:border-b-0',
  ),
  optionCircle: cn(
    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-grey-4 transition-colors',
  ),
  optionCircleSelected: 'bg-primary-secondaryroyal',
  optionLabel: 'body-5 text-grey-10 flex-1 font-semibold',
  optionLabelSelected: 'text-grey-11',
} as const

function OptionRow({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={stepStyles.optionRow}
    >
      <div
        className={cn(
          stepStyles.optionCircle,
          selected && stepStyles.optionCircleSelected,
        )}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M10 3L4.5 8.5L2 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={cn(stepStyles.optionLabel, selected && stepStyles.optionLabelSelected)}>
        {label}
      </span>
    </button>
  )
}

interface QuestionnaireStep4Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
}

export default function QuestionnaireStep4({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
}: QuestionnaireStep4Props) {
  const [communicationStyle, setCommunicationStyle] = useState<
    CommunicationStyle | undefined
  >(initialData?.personalityPreferences?.communicationStyle)
  const [mentorshipStyle, setMentorshipStyle] = useState<MentorshipStyle | undefined>(
    initialData?.personalityPreferences?.mentorshipStyle
  )

  const handleNext = () => {
    const personalityPreferences: PersonalityTraits = {}
    if (communicationStyle) personalityPreferences.communicationStyle = communicationStyle
    if (mentorshipStyle) personalityPreferences.mentorshipStyle = mentorshipStyle
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
  }, [onFooterChange, onRegisterNext])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <QuestionnaireQuestionBlock
          title="선호하는 멘토님의 스타일을 선택해주세요"
          hint="복수 선택 가능, 선택하지 않으면 상관없음으로 매칭됩니다"
          titleVariant="large"
        />
        <div className="pt-2">
          <p className={stepStyles.sectionTitle}>소통 방식</p>
          <div className="flex flex-col">
            {COMMUNICATION.map((opt) => (
              <OptionRow
                key={opt.value}
                label={opt.label}
                selected={communicationStyle === opt.value}
                onToggle={() =>
                  setCommunicationStyle(
                    communicationStyle === opt.value ? undefined : opt.value
                  )
                }
              />
            ))}
          </div>
          <p className={stepStyles.sectionTitle}>멘토링 방식</p>
          <div className="flex flex-col">
            {MENTORING_STYLE.map((opt) => (
              <OptionRow
                key={opt.value}
                label={opt.label}
                selected={mentorshipStyle === opt.value}
                onToggle={() =>
                  setMentorshipStyle(
                    mentorshipStyle === opt.value ? undefined : opt.value
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
