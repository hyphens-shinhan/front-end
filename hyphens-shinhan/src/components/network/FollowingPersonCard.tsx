'use client'

import type { ReactNode } from 'react'
import type { Person } from '@/types/network'
import { cn } from '@/utils/cn'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'

/** 카드에 표시할 최소 정보 (친구 목록은 Person, 팔로우 요청은 id/name/avatar만 넘겨도 됨) */
export type PersonCardDisplay = Pick<Person, 'id' | 'name'> &
  Partial<Pick<Person, 'avatar' | 'mutualConnections' | 'generation' | 'scholarshipType' | 'university' | 'tags'>>

interface FollowingPersonCardProps {
  person: PersonCardDisplay
  onClick?: () => void
  onMessage?: (personId: string) => void
  /** 커스텀 부가 정보 (없으면 person에 generation/scholarshipType 있을 때만 자동 계산) */
  subtitle?: string | null
  /** 커스텀 액션 영역 (수락/거절 등). 있으면 onMessage 대신 사용 */
  actions?: ReactNode
}

function isYB(p: PersonCardDisplay): boolean {
  const tags = p.tags ?? []
  const hasMentorOrObTag = tags.some((t) =>
    t.includes('멘토') ||
    t.includes('OB') ||
    t.toLowerCase().includes('mentor'),
  )
  return !hasMentorOrObTag
}

function getSubtitle(p: PersonCardDisplay): string {
  if (p.generation == null || p.scholarshipType == null) return ''
  return isYB(p)
    ? `${p.generation} · ${p.scholarshipType}${p.university ? ` · ${p.university}` : ''}`
    : (p.university || '소속 없음')
}

export default function FollowingPersonCard({
  person,
  onClick,
  onMessage,
  subtitle: subtitleProp,
  actions,
}: FollowingPersonCardProps) {
  const subtitle =
    subtitleProp !== undefined
      ? subtitleProp
      : (person.generation != null && person.scholarshipType != null
        ? getSubtitle(person)
        : null)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={styles.container}
    >
      <Avatar src={person.avatar} alt={person.name} size={46} />

      <div className={styles.infoWrapper}>
        <h3 className={styles.name}>
          {person.name}
        </h3>
        {/* {subtitle != null && subtitle !== '' && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )} */}
      </div>

      {actions != null ? (
        <div onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      ) : onMessage ? (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="secondary"
            size="S"
            label="메시지"
            onClick={() => onMessage(person.id)}
          />
        </div>
      ) : null}
    </div>
  )
}

const styles = {
  container: cn(
    'flex items-center gap-4 cursor-pointer',
    'active:opacity-95 transition-opacity',
  ),
  infoWrapper: cn('flex-1 min-w-0'),
  name: cn('body-5 text-grey-11'),
  subtitle: cn('body-7 text-grey-8'),
  mutual: cn('text-xs text-grey-6 mt-0.5'),
}

