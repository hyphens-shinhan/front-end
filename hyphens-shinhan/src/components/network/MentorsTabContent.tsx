'use client'

import type { Person } from '@/types/network'
import MentorsSection from '@/components/network/MentorsSection'

interface MentorsTabContentProps {
  mentors: Person[]
  isLoading?: boolean
  onFollowRequest?: (personId: string) => void
  onPersonClick?: (person: Person) => void
}

export default function MentorsTabContent({
  mentors,
  isLoading = false,
  onFollowRequest,
  onPersonClick,
}: MentorsTabContentProps) {
  return (
    <MentorsSection
      mentors={isLoading ? [] : mentors}
      onFollowRequest={onFollowRequest}
      onPersonClick={onPersonClick}
    />
  )
}
