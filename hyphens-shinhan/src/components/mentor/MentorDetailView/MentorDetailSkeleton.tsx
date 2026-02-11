'use client'

import { Skeleton } from '@/components/common/Skeleton'

/** 멘토 상세 로딩 시 표시하는 프로필 스켈레톤 */
export function MentorDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[600px] px-4 pb-20 pt-6">
        <div className="flex flex-col gap-5">
          {/* 헤더: 아바타 + 이름/태그 */}
          <div className="flex items-center gap-6">
            <Skeleton.Circle className="h-20 w-20 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-center gap-1">
                <Skeleton.Box className="h-7 w-32 rounded" />
                <Skeleton.Box className="size-6 shrink-0 rounded" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Skeleton.Tag className="h-6 w-16" />
                <Skeleton.Tag className="h-6 w-20" />
                <Skeleton.Tag className="h-6 w-14" />
              </div>
            </div>
          </div>

          {/* 정보 카드 */}
          <Skeleton.Container className="flex flex-col gap-3 rounded-xl border border-grey-2 p-4">
            <Skeleton.Box className="h-5 w-24 rounded" />
            <Skeleton.Text lines={2} lastLineWidth="w-4/5" />
          </Skeleton.Container>

          {/* 소개 */}
          <Skeleton.Container className="flex flex-col gap-2">
            <Skeleton.Box className="h-5 w-16 rounded" />
            <Skeleton.Text lines={3} lastLineWidth="w-3/4" />
          </Skeleton.Container>

          {/* 멘토링 정보 */}
          <Skeleton.Container className="flex flex-col gap-2">
            <Skeleton.Box className="h-5 w-28 rounded" />
            <Skeleton.Text lines={2} lastLineWidth="w-2/3" />
          </Skeleton.Container>

          <div className="h-0.5 bg-grey-2 py-px" aria-hidden />

          {/* 액션 버튼 */}
          <Skeleton.Box className="h-14 w-full rounded-xl" />

          {/* 게시글 목록 */}
          <Skeleton.Container className="flex flex-col gap-3">
            <Skeleton.Box className="h-5 w-20 rounded" />
            <Skeleton.Box className="h-24 w-full rounded-xl" />
            <Skeleton.Box className="h-24 w-full rounded-xl" />
          </Skeleton.Container>
        </div>
      </main>
    </div>
  )
}
