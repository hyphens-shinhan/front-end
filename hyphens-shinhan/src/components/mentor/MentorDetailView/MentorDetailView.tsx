'use client'

import type { Mentor } from '@/types/mentor'
import { MentorDetailHeader } from './MentorDetailHeader'
import { MentorDetailInfoCard } from './MentorDetailInfoCard'
import { MentorDetailBio } from './MentorDetailBio'
import { MentorDetailMentoringInfo } from './MentorDetailMentoringInfo'
import { MentorDetailActions } from './MentorDetailActions'
import FeedList from '@/components/mypage/FeedList'
import Separator from '@/components/common/Separator'

interface MentorDetailViewProps {
  mentor: Mentor
}

export function MentorDetailView({ mentor }: MentorDetailViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[600px] px-4 pb-20 pt-6">
        <div className="flex flex-col gap-5">
          {/* 헤더 */}
          <MentorDetailHeader mentor={mentor} />
          {/* 정보 카드 */}
          <MentorDetailInfoCard mentor={mentor} />
          {/* 소개 */}
          <MentorDetailBio mentor={mentor} />
          {/* 분리선 */}
          <Separator className="mx-4" />
          {/* 멘토링 정보 */}
          <MentorDetailMentoringInfo mentor={mentor} />
          {/* 액션 버튼 */}
          <MentorDetailActions mentor={mentor} />
          {/* 글 */}
          <FeedList
            isMyPage={false}
            userName={mentor.name}
            userId={mentor.id}
            userAvatarUrl={mentor.avatar ?? null}
            postsUserId={mentor.id}
          />
        </div>
      </main>
    </div>
  )
}
