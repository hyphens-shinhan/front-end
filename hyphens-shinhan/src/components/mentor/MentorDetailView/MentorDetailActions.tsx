'use client'

import { useRouter } from 'next/navigation'
import type { Mentor } from '@/types/mentor'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

interface MentorDetailActionsProps {
  mentor: Mentor
}

export function MentorDetailActions({ mentor }: MentorDetailActionsProps) {
  const router = useRouter()

  const handleApply = () => {
    router.push(`${ROUTES.MENTORS.MAIN}/${mentor.id}/apply`)
  }

  const handleBackToMatches = () => {
    router.push(ROUTES.MENTORS.MATCHES)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleApply}
        className={cn(
          'flex h-10 min-h-10 w-full items-center justify-center rounded-[16px]',
          'bg-primary-shinhanblue px-[60px] py-3 text-center text-base font-semibold leading-[22px] text-white',
          'shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.04)]',
          'hover:opacity-90 transition-opacity',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
        )}
      >
        멘토링 신청하기
      </button>
      <button
        type="button"
        onClick={handleBackToMatches}
        className={cn(
          'py-3 text-sm font-medium text-grey-7',
          'hover:opacity-80 transition-opacity',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-6 focus-visible:ring-offset-2 rounded-lg'
        )}
      >
        매칭 목록으로 돌아가기
      </button>
    </div>
  )
}
