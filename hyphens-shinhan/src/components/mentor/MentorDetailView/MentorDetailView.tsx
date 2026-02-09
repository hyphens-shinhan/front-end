'use client'

import type { Mentor } from '@/types/mentor'
import { MentorDetailHeader } from './MentorDetailHeader'
import { MentorDetailInfoCard } from './MentorDetailInfoCard'
import { MentorDetailBio } from './MentorDetailBio'
import { MentorDetailMentoringInfo } from './MentorDetailMentoringInfo'
import { MentorDetailActions } from './MentorDetailActions'
import { MentorDetailPosts } from './MentorDetailPosts'

interface MentorDetailViewProps {
  mentor: Mentor
}

export function MentorDetailView({ mentor }: MentorDetailViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[600px] px-4 pb-20 pt-6">
        <div className="flex flex-col gap-5">
          <MentorDetailHeader mentor={mentor} />
          <MentorDetailInfoCard mentor={mentor} />
          <MentorDetailBio mentor={mentor} />
          <MentorDetailMentoringInfo mentor={mentor} />
          <div className="h-0.5 bg-grey-2 py-px" aria-hidden />
          <MentorDetailActions mentor={mentor} />
          <MentorDetailPosts mentor={mentor} />
        </div>
      </main>
    </div>
  )
}
