'use client'

import type { Mentor } from '@/types/mentor'

interface MentorDetailBioProps {
  mentor: Mentor
}

export function MentorDetailBio({ mentor }: MentorDetailBioProps) {
  if (!mentor.bio) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-16 text-grey-10">
        멘토 소개
      </h2>
      <p className="body-8 text-grey-10">
        {mentor.bio}
      </p>
    </section>
  )
}
