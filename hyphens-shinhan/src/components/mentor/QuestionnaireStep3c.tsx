'use client'

import { useState, useMemo, useEffect } from 'react'
import type { MentorshipRequest, MeetingFormat } from '@/types/mentor'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'
import SelectableOptionRow from './SelectableOptionRow'

type MeetingOptionId = 'remote' | 'in_person' | 'flexible'

const OPTIONS: { id: MeetingOptionId; label: string; formats: MeetingFormat[] }[] = [
  { id: 'remote', label: '비대면 방식 (Zoom, 구글미트 등)', formats: ['zoom', 'google_meet'] },
  { id: 'in_person', label: '대면 방식', formats: ['in_person'] },
  { id: 'flexible', label: '상황에 따라 유연하게', formats: ['any'] },
]

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
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
}

export default function QuestionnaireStep3c({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
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

  useEffect(() => {
    onFooterChange?.({ nextLabel: '다음', nextDisabled: !hasSelection })
    onRegisterNext?.(handleNext)
  }, [hasSelection, onFooterChange, onRegisterNext])

  return (
    <div className={stepStyles.wrapper}>
      <div className={stepStyles.scrollArea}>
        <QuestionnaireQuestionBlock
          title="멘토님과 만날 방법을 선택해주세요"
          hint="복수 선택 가능"
          titleVariant="large"
        />
        <div className={stepStyles.options}>
          {OPTIONS.map((opt) => (
            <SelectableOptionRow
              key={opt.id}
              value={opt.id}
              label={opt.label}
              selected={selected.has(opt.id)}
              onToggle={() => toggle(opt.id)}
              name="meetingMethod"
              variant="checkbox"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const stepStyles = {
  wrapper: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  options: 'flex flex-col',
} as const
