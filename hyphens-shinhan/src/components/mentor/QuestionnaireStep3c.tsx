'use client'

import { useState, useMemo } from 'react'
import type { MentorshipRequest, MeetingFormat } from '@/types/mentor'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

type MeetingOptionId = 'remote' | 'in_person' | 'flexible'

const OPTIONS: { id: MeetingOptionId; label: string; formats: MeetingFormat[] }[] = [
  { id: 'remote', label: '비대면 방식 (Zoom, 구글미트 등)', formats: ['zoom', 'google_meet'] },
  { id: 'in_person', label: '대면 방식', formats: ['in_person'] },
  { id: 'flexible', label: '상황에 따라 유연하게', formats: ['any'] },
]

const stepStyles = {
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'title-16 text-grey-11 font-semibold',
  hint: 'body-8 text-grey-8',
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

function getInitialSelected(preferredFormats: MeetingFormat[] | undefined): Set<MeetingOptionId> {
  const set = new Set<MeetingOptionId>()
  if (!preferredFormats?.length) return set
  if (preferredFormats.some((f) => f === 'zoom' || f === 'google_meet')) set.add('remote')
  if (preferredFormats.includes('in_person')) set.add('in_person')
  if (preferredFormats.includes('any')) set.add('flexible')
  return set
}

function selectedToFormats(selected: Set<MeetingOptionId>): MeetingFormat[] {
  const formats: MeetingFormat[] = []
  if (selected.has('remote')) formats.push('zoom', 'google_meet')
  if (selected.has('in_person')) formats.push('in_person')
  if (selected.has('flexible')) formats.push('any')
  return formats
}

interface QuestionnaireStep3cProps {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep3c({
  initialData,
  onNext,
  onBack,
}: QuestionnaireStep3cProps) {
  const [selected, setSelected] = useState<Set<MeetingOptionId>>(() =>
    getInitialSelected(initialData?.availability?.preferredFormats)
  )

  const preferredFormats = useMemo(() => selectedToFormats(selected), [selected])
  const hasSelection = preferredFormats.length > 0

  const toggle = (id: MeetingOptionId) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleNext = () => {
    if (!hasSelection) return
    onNext({
      availability: {
        ...initialData?.availability,
        preferredFormats,
      } as MentorshipRequest['availability'],
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className={stepStyles.questionBlock}>
          <h2 className={stepStyles.questionTitle}>멘토님과 만날 방법을 선택해주세요</h2>
          <p className={stepStyles.hint}>복수 선택 가능</p>
        </div>
        <div className="flex flex-col">
          {OPTIONS.map((opt) => {
            const isSelected = selected.has(opt.id)
            return (
              <label key={opt.id} className={stepStyles.optionRow}>
                <div
                  className={cn(
                    stepStyles.optionCircle,
                    isSelected && stepStyles.optionCircleSelected,
                  )}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(opt.id)}
                  className="sr-only"
                />
                <span className={cn(stepStyles.optionLabel, isSelected && stepStyles.optionLabelSelected)}>
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
      <QuestionnaireStepFooter
        onBack={onBack}
        onNext={handleNext}
        nextDisabled={!hasSelection}
      />
    </div>
  )
}
