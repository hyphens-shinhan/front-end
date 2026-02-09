'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { MENTOR_CATEGORY_LABELS } from '@/constants/mentorDetail'
import { Icon } from '@/components/common/Icon'
import { getMentorById } from '@/data/mock-mentors'
import type { MentorCategory } from '@/types/mentor'
import type { MentoringRequestResponse } from '@/types/mentoring-api'

/** Mentoring history list item (uses real mentor ids so detail screen loads). */
export interface MentoringHistorySession {
  id: string
  name: string
  avatar: string
  expertise: string
  location: string
  verified: boolean
}

function getExpertiseLabel(primaryCategory: string): string {
  return MENTOR_CATEGORY_LABELS[primaryCategory as MentorCategory] ?? primaryCategory
}

/** Build history list from API sent requests (group by date, mentor info). */
function buildHistoryFromRequests(
  requests: MentoringRequestResponse[]
): { date: string; sessions: MentoringHistorySession[] }[] {
  const byDate: Record<string, MentoringHistorySession[]> = {}
  for (const req of requests) {
    const dateStr = req.created_at.slice(0, 10)
    const session: MentoringHistorySession = {
      id: req.mentor.id,
      name: req.mentor.name,
      avatar: req.mentor.avatar_url || '/assets/images/male1.png',
      expertise: '멘토링',
      location: '',
      verified: req.status === 'ACCEPTED' || req.status === 'COMPLETED',
    }
    if (!byDate[dateStr]) byDate[dateStr] = []
    byDate[dateStr].push(session)
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, sessions]) => ({
      date: date.replace(/-/g, '.'),
      sessions,
    }))
}

/** Build history list from mock mentors (fallback when no API data). */
function getMentoringHistoryByDate(): { date: string; sessions: MentoringHistorySession[] }[] {
  const mentor1 = getMentorById('mentor_1')
  const mentor2 = getMentorById('mentor_2')
  const mentor3 = getMentorById('mentor_3')
  const mentor7 = getMentorById('mentor_7')
  const toSession = (m: ReturnType<typeof getMentorById>) =>
    m
      ? {
          id: m.id,
          name: m.name,
          avatar: m.avatar || '/assets/images/male1.png',
          expertise: getExpertiseLabel(m.primaryCategory),
          location: m.location || '서울',
          verified: true,
        }
      : null

  return [
    {
      date: '2026.01.03',
      sessions: [toSession(mentor1)].filter(Boolean) as MentoringHistorySession[],
    },
    {
      date: '2025.12.29',
      sessions: [toSession(mentor2), toSession(mentor3)].filter(Boolean) as MentoringHistorySession[],
    },
    {
      date: '2025.12.01',
      sessions: [toSession(mentor7)].filter(Boolean) as MentoringHistorySession[],
    },
  ]
}

const MOCK_MENTORING_HISTORY = getMentoringHistoryByDate()

interface MentorNotFoundViewProps {
  /** When provided (e.g. from GET /mentoring/requests/sent), show API data instead of mock */
  sentRequests?: MentoringRequestResponse[]
}

/**
 * When mentor detail is not found, show "나의 멘토링 내역" list.
 * Uses sentRequests from API when provided; otherwise falls back to mock data.
 */
export function MentorNotFoundView({ sentRequests }: MentorNotFoundViewProps) {
  const historyGroups = useMemo(() => {
    if (sentRequests && sentRequests.length > 0) {
      return buildHistoryFromRequests(sentRequests)
    }
    return MOCK_MENTORING_HISTORY
  }, [sentRequests])

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-[600px] px-4 pb-8 pt-2">
        <div className="flex flex-col gap-5">
          {historyGroups.map((group) => (
            <section key={group.date} className="flex flex-col gap-5">
              <p className="body-8 font-semibold text-grey-8 leading-5">
                {group.date}
              </p>
              <div className="flex flex-col gap-0">
                {group.sessions.map((session, idx) => (
                  <div key={`${session.id}-${idx}`}>
                    {idx > 0 && (
                      <div
                        className="my-px h-px w-full bg-grey-2"
                        aria-hidden
                      />
                    )}
                    <Link
                      href={`${ROUTES.MENTORS.DETAIL_PREFIX}${session.id}`}
                      className="flex w-full items-center justify-between py-2"
                      aria-label={`${session.name} 멘토 상세`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full bg-grey-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={session.avatar}
                            alt=""
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col items-start gap-2">
                          <div className="flex items-center gap-1">
                            <span className="title-18 truncate font-bold leading-[22px] text-grey-11">
                              {session.name}
                            </span>
                            {session.verified && (
                              <span className="shrink-0 [&_path]:fill-primary-secondaryroyal" aria-hidden>
                                <Icon name="IconLBoldVerify" className="size-6" />
                              </span>
                            )}
                          </div>
                          <span className="body-8 font-semibold leading-5 text-grey-8">
                            {session.expertise} • {session.location}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-grey-9" aria-hidden>
                        <Icon
                          name="IconLLineArrowRight"
                          className="size-6"
                        />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
