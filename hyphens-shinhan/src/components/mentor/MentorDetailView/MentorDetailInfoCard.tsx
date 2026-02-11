'use client'

import type { Mentor } from '@/types/mentor'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface InfoRowProps {
  icon: React.ComponentProps<typeof Icon>['name']
  children: React.ReactNode
}

function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} className="size-6 shrink-0 text-grey-8" aria-hidden />
      <span className="body-6 text-grey-11">
        {children}
      </span>
    </div>
  )
}

interface MentorDetailInfoCardProps {
  mentor: Mentor
}

export function MentorDetailInfoCard({ mentor }: MentorDetailInfoCardProps) {
  const school = [mentor.university, mentor.major].filter(Boolean).join(' ')
  const workplace = [mentor.company, mentor.currentRole]
    .filter(Boolean)
    .reverse()
    .join(' • ')

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-[16px] border border-grey-2 p-5',
        'bg-white'
      )}
    >
      {school && (
        <InfoRow icon="IconLBoldTeacher">{school}</InfoRow>
      )}
      {workplace && (
        <InfoRow icon="IconLBoldBriefcase">{workplace}</InfoRow>
      )}
      {mentor.address && (
        <InfoRow icon="IconLBoldLocation">{mentor.address}</InfoRow>
      )}
      {mentor.email && (
        <InfoRow icon='IconLBoldRsms'>{mentor.email}</InfoRow>
      )}
    </div>
  )
}
