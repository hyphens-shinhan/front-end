'use client'

import { useRouter } from 'next/navigation'
import type { MentorshipRequest } from '@/types/mentor'
import { ROUTES } from '@/constants'
import MentorQuestionnaire from '@/components/mentor/MentorQuestionnaire'

export default function MentorQuestionnairePage() {
  const router = useRouter()

  const handleComplete = (request: MentorshipRequest) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mentorship_request', JSON.stringify(request))
    }
    router.push(ROUTES.MENTORS.MATCHES)
  }

  return <MentorQuestionnaire onComplete={handleComplete} />
}
