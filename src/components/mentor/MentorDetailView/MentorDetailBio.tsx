'use client'

import type { Mentor } from '@/types/mentor'
import { cn } from '@/utils/cn'

interface MentorDetailBioProps {
  mentor: Mentor
}

export function MentorDetailBio({ mentor }: MentorDetailBioProps) {
  if (!mentor.bio) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-bold leading-[22px] text-grey-10">
        멘토 소개
      </h2>
      <p className="text-sm font-normal leading-5 text-grey-10">
        {mentor.bio}
      </p>
    </section>
  )
}
