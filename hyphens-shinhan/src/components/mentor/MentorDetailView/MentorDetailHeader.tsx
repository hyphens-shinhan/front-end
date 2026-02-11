'use client'

import type { Mentor, MentorCategory } from '@/types/mentor'
import { Icon } from '@/components/common/Icon'
import InfoTag from '@/components/common/InfoTag'
import Avatar from '@/components/common/Avatar'
import { MENTOR_CATEGORY_LABELS } from '@/constants/mentorDetail'

const AVATAR_FALLBACK = '/assets/images/male1.png'

interface MentorDetailHeaderProps {
  mentor: Mentor
}

export function MentorDetailHeader({ mentor }: MentorDetailHeaderProps) {
  const avatarSrc = mentor.avatar || AVATAR_FALLBACK
  const categoryLabel =
    MENTOR_CATEGORY_LABELS[mentor.primaryCategory as MentorCategory] ??
    mentor.primaryCategory
  const typeLabel = mentor.type === 'ob' ? 'OB 선배' : '전문 멘토'

  return (
    <div className={styles.container}>
      <Avatar
        src={avatarSrc}
        alt=""
        size={80}
        containerClassName={styles.avatarContainer}
      />
      <div className={styles.content}>
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{mentor.name}</h1>
          <span className={styles.verifiedIconWrap} aria-hidden>
            <Icon name='IconLBoldVerify' />
          </span>
        </div>
        <div className={styles.tagsRow}>
          <InfoTag label={categoryLabel} color="blue" />
          <InfoTag label={typeLabel} color="yellow" />
          {mentor.university && (
            <InfoTag label={mentor.university} color="green" />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: 'flex items-center gap-6',
  avatarContainer: 'h-20 w-20 shrink-0 overflow-hidden rounded-full bg-grey-2',
  content: 'flex min-w-0 flex-1 flex-col items-start gap-3',
  nameRow: 'flex w-full items-center gap-1',
  name: 'body-1 font-bold text-grey-11',
  verifiedIconWrap: 'shrink-0 text-primary-secondaryroyal',
  tagsRow: 'flex flex-wrap items-center gap-1.5',
} as const
