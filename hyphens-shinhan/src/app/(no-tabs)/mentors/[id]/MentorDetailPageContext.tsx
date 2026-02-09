'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Mentor } from '@/types/mentor'
import { useMentorById } from '@/hooks/mentoring/useMentoring'

interface MentorDetailPageState {
  mentor: Mentor | null
  loading: boolean
}

const MentorDetailPageContext = createContext<MentorDetailPageState | null>(
  null
)

export function useMentorDetailPage() {
  const ctx = useContext(MentorDetailPageContext)
  if (!ctx) {
    throw new Error(
      'useMentorDetailPage must be used within MentorDetailPageProvider'
    )
  }
  return ctx
}

interface MentorDetailPageProviderProps {
  mentorId: string
  children: React.ReactNode
}

export function MentorDetailPageProvider({
  mentorId,
  children,
}: MentorDetailPageProviderProps) {
  const { data: mentor, isLoading: loading } = useMentorById(mentorId)

  const value = useMemo<MentorDetailPageState>(
    () => ({ mentor: mentor ?? null, loading }),
    [mentor, loading]
  )

  return (
    <MentorDetailPageContext.Provider value={value}>
      {children}
    </MentorDetailPageContext.Provider>
  )
}
