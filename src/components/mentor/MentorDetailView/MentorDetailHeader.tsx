'use client'

import type { Mentor, MentorCategory } from '@/types/mentor'
import { Icon } from '@/components/common/Icon'
import InfoTag from '@/components/common/InfoTag'
import { MENTOR_CATEGORY_LABELS } from '@/constants/mentorDetail'
import { cn } from '@/utils/cn'

const AVATAR_FALLBACK = '/assets/images/male1.png'

interface MentorDetailHeaderProps {
  mentor: Mentor
}

export function MentorDetailHeader({ mentor }: MentorDetailHeaderProps) {
  const avatarSrc = mentor.avatar || AVATAR_FALLBACK
  const categoryLabel =
    MENTOR_CATEGORY_LABELS[mentor.primaryCategory as MentorCategory] ??
    mentor.primaryCategory
  const typeLabel = mentor.type === 'ob' ? 'OB 선배' : '전문 멘토'

  return (
    <div className="flex items-center gap-6">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-grey-2">
        <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <div className="flex w-full items-center gap-1">
          <h1
            className={cn(
              'truncate text-[24px] font-bold leading-[29px] text-grey-11',
              'tracking-[-0.02em]'
            )}
          >
            {mentor.name}
          </h1>
          <span className="shrink-0" aria-hidden>
            <Icon
              name="IconMBoldShieldTick"
              className="size-6 text-primary-secondaryroyal"
            />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <InfoTag label={categoryLabel} color="blue" />
          <InfoTag label={typeLabel} color="yellow" />
          {mentor.location && (
            <InfoTag label={mentor.location} color="green" />
          )}
        </div>
      </div>
    </div>
  )
}
