'use client'

import { useRouter } from 'next/navigation'
import type { Mentor } from '@/types/mentor'
import { ROUTES } from '@/constants'
import Button from '@/components/common/Button'

interface MentorDetailActionsProps {
  mentor: Mentor
}

export function MentorDetailActions({ mentor }: MentorDetailActionsProps) {
  const router = useRouter()

  const handleApply = () => {
    router.push(`${ROUTES.MENTORS.MAIN}/${mentor.id}/apply`)
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Button
        type="primary"
        size="L"
        fullWidth
        onClick={handleApply}
        label="멘토링 신청하기"
      />
    </div>
  )
}
