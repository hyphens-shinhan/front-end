'use client'

import { useRouter, useParams } from 'next/navigation'
import { ROUTES } from '@/constants'
import { MentorApplicationForm } from '@/components/mentor/MentorDetailView/MentorApplicationForm'
import { useMentorById } from '@/hooks/mentoring/useMentoring'
import { cn } from '@/utils/cn'

export default function MentorApplyPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.id as string

  const { data: mentor, isLoading: loading } = useMentorById(mentorId)

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 py-8">
        <p className="text-grey-7">로딩 중...</p>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="px-5 py-8">
        <p className="mb-4 text-grey-7">멘토를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.MENTORS.MATCHES)}
          className={cn(
            'min-h-[44px] rounded-lg bg-primary-shinhanblue px-4 py-2 text-sm font-medium text-white',
            'transition-opacity hover:opacity-90'
          )}
        >
          매칭 목록으로
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full px-5 pb-8 pt-2">
      <MentorApplicationForm mentor={mentor} onCancel={() => router.back()} />
    </div>
  )
}
