'use client'

import { useState } from 'react'
import type {
  MentorshipRequest,
  CommunicationStyle,
  WorkPace,
  MentorshipStyle,
  PersonalityTraits,
} from '@/types/mentor'
import { cn } from '@/utils/cn'

const COMMUNICATION: { value: CommunicationStyle; label: string }[] = [
  { value: 'direct', label: '직설적' },
  { value: 'collaborative', label: '협력적' },
  { value: 'supportive', label: '지지적' },
]

const PACE: { value: WorkPace; label: string }[] = [
  { value: 'fast_paced', label: '빠름' },
  { value: 'steady', label: '안정적' },
  { value: 'flexible', label: '유연' },
]

const STYLE: { value: MentorshipStyle; label: string }[] = [
  { value: 'hands_on', label: '실습' },
  { value: 'advisory', label: '조언' },
  { value: 'inspirational', label: '영감' },
]

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
      className={cn(
        'flex items-center gap-4 w-full py-3 min-h-[48px] text-left transition-colors border-b border-grey-2 last:border-b-0',
        selected ? 'text-primary-shinhanblue' : 'text-grey-11'
      )}
    >
      <div
        className={cn(
          'shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors',
          selected ? 'bg-primary-shinhanblue' : 'border-2 border-grey-5 bg-transparent'
        )}
      >
        {selected && (
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
      <span className="text-[15px] font-medium">{label}</span>
    </button>
  )
}

interface QuestionnaireStep4Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep4({
  initialData,
  onNext,
  onBack,
}: QuestionnaireStep4Props) {
  const [communicationStyle, setCommunicationStyle] = useState<
    CommunicationStyle | undefined
  >(initialData?.personalityPreferences?.communicationStyle)
  const [workPace, setWorkPace] = useState<WorkPace | undefined>(
    initialData?.personalityPreferences?.workPace
  )
  const [mentorshipStyle, setMentorshipStyle] = useState<MentorshipStyle | undefined>(
    initialData?.personalityPreferences?.mentorshipStyle
  )

  const handleNext = () => {
    const personalityPreferences: PersonalityTraits = {}
    if (communicationStyle) personalityPreferences.communicationStyle = communicationStyle
    if (workPace) personalityPreferences.workPace = workPace
    if (mentorshipStyle) personalityPreferences.mentorshipStyle = mentorshipStyle
    onNext({
      personalityPreferences:
        Object.keys(personalityPreferences).length > 0
          ? personalityPreferences
          : undefined,
    })
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-[20px] font-semibold text-grey-11 tracking-[-0.02em] mb-2">
        선호하는 멘토 스타일 (선택)
      </h1>
      <p className="text-sm text-grey-7 mb-6">
        원하는 스타일만 골라주세요. 비워두면 상관없음으로 매칭됩니다.
      </p>
      <div className="space-y-5">
        <section>
          <p className="text-[13px] text-grey-7 uppercase mb-2">소통</p>
          <div className="rounded-lg overflow-hidden">
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
        </section>
        <section>
          <p className="text-[13px] text-grey-7 uppercase mb-2">속도</p>
          <div className="rounded-lg overflow-hidden">
            {PACE.map((opt) => (
              <OptionRow
                key={opt.value}
                label={opt.label}
                selected={workPace === opt.value}
                onToggle={() =>
                  setWorkPace(workPace === opt.value ? undefined : opt.value)
                }
              />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[13px] text-grey-7 uppercase mb-2">멘토링</p>
          <div className="rounded-lg overflow-hidden">
            {STYLE.map((opt) => (
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
        </section>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleNext}
          className="w-full min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          멘토 찾기
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 text-sm font-medium text-grey-7 hover:opacity-80 transition-opacity"
        >
          뒤로
        </button>
      </div>
    </div>
  )
}
