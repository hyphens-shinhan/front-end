'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import Avatar from '@/components/common/Avatar'
import InfoTag from '@/components/common/InfoTag'
import EmptyContent from '@/components/common/EmptyContent'
import { Icon } from '@/components/common/Icon'
import { useSentMentoringRequests } from '@/hooks/mentoring/useMentoring'
import type { MentoringRequestResponse, MentoringRequestStatus } from '@/types/mentoring-api'

const STATUS_LABELS: Record<MentoringRequestStatus, string> = {
  PENDING: '대기중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
  COMPLETED: '완료됨',
  CANCELED: '취소됨',
}

const STATUS_COLORS: Record<
  MentoringRequestStatus,
  'blue' | 'grey' | 'green' | 'yellow' | 'red'
> = {
  PENDING: 'yellow',
  ACCEPTED: 'green',
  REJECTED: 'red',
  COMPLETED: 'green',
  CANCELED: 'grey',
}

export interface MentoringHistorySession {
  id: string
  name: string
  avatar: string
  message: string
  status: MentoringRequestStatus
  verified: boolean
}

type MentoringHistoryGroup = { date: string; sessions: MentoringHistorySession[] }

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
      message: req.message || '',
      status: req.status,
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

interface MentoringHistoryViewProps {
  sentRequests?: MentoringRequestResponse[]
}

/** 나의 멘토링 내역 페이지 */
export function MentoringHistoryView({ sentRequests }: MentoringHistoryViewProps) {
  const { data, isLoading, error } = useSentMentoringRequests()
  const resolvedRequests = sentRequests ?? data?.requests
  const isApiDataResolved = sentRequests !== undefined || data?.requests !== undefined

  const historyGroups = useMemo(() => {
    if (!resolvedRequests || resolvedRequests.length === 0) return []
    return buildHistoryFromRequests(resolvedRequests)
  }, [resolvedRequests])

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
                            <InfoTag
                              label={STATUS_LABELS[session.status]}
                              color={STATUS_COLORS[session.status]}
                            />
                          </div>
                          {session.message && (
                            <div className={styles.messageContainer}>
                              <p className={styles.messageText}>요청한 메시지</p>
                              <p className={styles.messageTextBody}>{session.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
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
  dateText: 'font-caption-caption1 text-grey-8',
  sessions: 'flex flex-col gap-0',
  divider: 'my-px h-px w-full bg-grey-2',
  link: 'flex w-full py-2',
  left: 'flex min-w-0 flex-1 gap-4',
  avatarContainer: 'h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full bg-grey-2',
  info: 'flex min-w-0 flex-col items-start gap-2 flex-1',
  nameRow: 'flex items-center gap-2.5 justify-between',
  name: 'title-18 truncate font-bold leading-[22px] text-grey-11',
  verifiedIconWrap: 'shrink-0 [&_path]:fill-primary-secondaryroyal',
  rightIconWrap: 'shrink-0 text-grey-9',
  messageText: 'body-7 text-grey-7',
  messageTextBody: 'body-7 text-grey-9',
  messageContainer: 'w-full min-w-0 flex flex-col gap-1 border border-grey-2 px-2 py-1.5 rounded-lg',
} as const
