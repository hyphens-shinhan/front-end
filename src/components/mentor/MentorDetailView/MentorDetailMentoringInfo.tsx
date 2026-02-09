'use client'

import type { Mentor } from '@/types/mentor'
import {
  DAY_LABELS,
  TIME_OF_DAY_LABELS,
  MEETING_FORMAT_LABELS,
  STYLE_LABELS,
  PREFERRED_FREQUENCY_LABEL,
} from '@/constants/mentorDetail'

const labelClass = 'text-sm font-semibold leading-5 text-grey-8'
const valueClass = 'text-sm font-semibold leading-5 text-grey-10'

function InfoRow({
  label,
  value,
  gap = 12,
  valueWrap = false,
}: {
  label: string
  value: string
  gap?: 12 | 27
  valueWrap?: boolean
}) {
  return (
    <div
      className={valueWrap ? 'flex items-start' : 'flex items-center'}
      style={{ gap: `${gap}px` }}
    >
      <span className={labelClass}>{label}</span>
      <span className={valueWrap ? `${valueClass} min-w-0 flex-1` : valueClass}>
        {value}
      </span>
    </div>
  )
}

interface MentorDetailMentoringInfoProps {
  mentor: Mentor
}

export function MentorDetailMentoringInfo({
  mentor,
}: MentorDetailMentoringInfoProps) {
  const { availability, personalityTraits } = mentor
  const daysLabel =
    availability.days.length > 0
      ? availability.days.map((d) => DAY_LABELS[d]).join(', ')
      : '-'
  const timeLabel =
    availability.timeOfDay.length > 0
      ? availability.timeOfDay.map((t) => TIME_OF_DAY_LABELS[t]).join(', ')
      : '-'
  const formatLabel =
    availability.preferredFormats.length > 0
      ? [
          ...new Set(
            availability.preferredFormats.map((f) => MEETING_FORMAT_LABELS[f])
          ),
        ].join(', ')
      : '-'
  const styleParts: string[] = []
  if (
    personalityTraits?.mentorshipStyle &&
    STYLE_LABELS[personalityTraits.mentorshipStyle]
  ) {
    styleParts.push(STYLE_LABELS[personalityTraits.mentorshipStyle])
  }
  if (
    personalityTraits?.communicationStyle &&
    STYLE_LABELS[personalityTraits.communicationStyle]
  ) {
    styleParts.push(STYLE_LABELS[personalityTraits.communicationStyle])
  }
  if (
    personalityTraits?.workPace &&
    STYLE_LABELS[personalityTraits.workPace]
  ) {
    styleParts.push(STYLE_LABELS[personalityTraits.workPace])
  }
  const styleLabel = styleParts.length > 0 ? styleParts.join(', ') : '-'

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-bold leading-[22px] text-grey-10">
        멘토링 정보
      </h2>
      <div className="grid grid-cols-2 gap-x-[62px] gap-y-2">
        {/* Left column: 가능 시간, 시간대, 선호 방식 */}
        <div className="flex flex-col gap-2">
          <InfoRow label="가능 시간" value={daysLabel} gap={12} />
          <InfoRow label="시간대" value={timeLabel} gap={27} />
          <InfoRow label="선호 방식" value={formatLabel} gap={12} />
        </div>
        {/* Right column: 선호 주기, 스타일 */}
        <div className="flex min-w-0 flex-col gap-2">
          <InfoRow label="선호 주기" value={PREFERRED_FREQUENCY_LABEL} gap={12} />
          <InfoRow label="스타일" value={styleLabel} gap={27} valueWrap />
        </div>
      </div>
    </section>
  )
}
