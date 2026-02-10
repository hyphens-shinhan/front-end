'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { MENTOR_CATEGORY_LABELS } from '@/constants/mentorDetail'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import Avatar from '@/components/common/Avatar'
import EmptyContent from '@/components/common/EmptyContent'
import { Icon } from '@/components/common/Icon'
import { useSentMentoringRequests } from '@/hooks/mentoring/useMentoring'
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

type MentoringHistoryGroup = { date: string; sessions: MentoringHistorySession[] }

function getExpertiseLabel(primaryCategory: string): string {
  return MENTOR_CATEGORY_LABELS[primaryCategory as MentorCategory] ?? primaryCategory
}

/** Build history list from API sent requests (group by date, mentor info). */
function buildHistoryFromRequests(
  requests: MentoringRequestResponse[]
): MentoringHistoryGroup[] {
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

interface MentorNotFoundViewProps {
  /** When provided (e.g. from GET /mentoring/requests/sent), show API data instead of mock */
  sentRequests?: MentoringRequestResponse[]
}

/**
 * When mentor detail is not found, show "나의 멘토링 내역" list.
 * Uses sentRequests from API when provided; otherwise falls back to mock data.
 */
export function MentorNotFoundView({ sentRequests }: MentorNotFoundViewProps) {
  const { data, isLoading, error } = useSentMentoringRequests()
  const resolvedRequests = sentRequests ?? data?.requests
  const isApiDataResolved = sentRequests !== undefined || data?.requests !== undefined

  const historyGroups = useMemo(() => {
    if (!resolvedRequests || resolvedRequests.length === 0) return []
    return buildHistoryFromRequests(resolvedRequests)
  }, [resolvedRequests])

  // prop이 없으면(멘토 상세에서 직접 사용) 훅 상태를 그대로 보여준다.
  if (sentRequests === undefined) {
    if (isLoading) {
      return (
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      )
    }

    if (error) {
      return (
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.DEFAULT}
        />
      )
    }
  }

  // API로 연동됐고, 내역이 비어있으면 빈 상태를 보여준다.
  if (isApiDataResolved && (resolvedRequests?.length ?? 0) === 0) {
    return (
      <EmptyContent
        variant="empty"
        message="신청한 멘토링 내역이 없어요."
      />
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.groups}>
          {historyGroups.map((group) => (
            <section key={group.date} className={styles.groupSection}>
              <p className={styles.dateText}>{group.date}</p>
              <div className={styles.sessions}>
                {group.sessions.map((session, idx) => (
                  <div key={`${session.id}-${idx}`}>
                    {idx > 0 && (
                      <div
                        className={styles.divider}
                        aria-hidden
                      />
                    )}
                    <Link
                      href={`${ROUTES.MENTORS.MAIN}/${session.id}`}
                      className={styles.link}
                      aria-label={`${session.name} 멘토 상세`}
                    >
                      <div className={styles.left}>
                        <Avatar
                          src={session.avatar}
                          alt={`${session.name} 프로필`}
                          size={50}
                          containerClassName={styles.avatarContainer}
                        />
                        <div className={styles.info}>
                          <div className={styles.nameRow}>
                            <span className={styles.name}>{session.name}</span>
                            {session.verified && (
                              <span className={styles.verifiedIconWrap} aria-hidden>
                                <Icon name="IconLBoldVerify" className="size-6" />
                              </span>
                            )}
                          </div>
                          <span className={styles.meta}>
                            {session.location
                              ? `${session.expertise} • ${session.location}`
                              : session.expertise}
                          </span>
                        </div>
                      </div>
                      <span className={styles.rightIconWrap} aria-hidden>
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

const styles = {
  fullHeight: 'min-h-dvh bg-white',
  page: 'min-h-dvh bg-white',
  inner: 'mx-auto max-w-[600px] px-4 pb-8 pt-2',
  groups: 'flex flex-col gap-5',
  groupSection: 'flex flex-col gap-5',
  dateText: 'body-8 font-semibold text-grey-8 leading-5',
  sessions: 'flex flex-col gap-0',
  divider: 'my-px h-px w-full bg-grey-2',
  link: 'flex w-full items-center justify-between py-2',
  left: 'flex items-center gap-4',
  avatarContainer: 'h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full bg-grey-2',
  info: 'flex min-w-0 flex-col items-start gap-2',
  nameRow: 'flex items-center gap-1',
  name: 'title-18 truncate font-bold leading-[22px] text-grey-11',
  verifiedIconWrap: 'shrink-0 [&_path]:fill-primary-secondaryroyal',
  meta: 'body-8 font-semibold leading-5 text-grey-8',
  rightIconWrap: 'shrink-0 text-grey-9',
} as const
