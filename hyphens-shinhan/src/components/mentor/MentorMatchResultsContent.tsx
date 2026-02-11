'use client'

import { useRouter } from 'next/navigation'
import type { MentorMatch } from '@/types/mentor'
import { ROUTES } from '@/constants'
import MentorMatchCard from './MentorMatchCard'
import Separator from '@/components/common/Separator'
import { cn } from '@/utils/cn'
import Button from '../common/Button'
import EmptyContent from '@/components/common/EmptyContent'

interface MentorMatchResultsContentProps {
  matches: MentorMatch[]
  userName?: string | null
}

export default function MentorMatchResultsContent({
  matches,
  userName,
}: MentorMatchResultsContentProps) {
  const router = useRouter()
  const displayName = userName ? `${userName}님` : '회원님'

  // 매칭된 멘토가 하나도 없을 때 빈 상태 표시
  if (!matches || matches.length === 0) {
    return (
      <div className={styles.wrapper}>
        <EmptyContent
          variant="error"
          message="매칭된 멘토가 없어요!"
          subMessage={
            <Button
              label="다시 찾기"
              size="M"
              type="primary"
              fullWidth
              onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
            />
          }
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>
        {displayName}에게 맞는 멘토를 찾았어요!
      </p>

      <div className={styles.list}>
        {matches.map((match, index) => (
          <div key={match.mentor.id}>
            <MentorMatchCard match={match} />
            {index < matches.length - 1 && (
              <Separator className="mx-4" />
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <Button
          label="다시 찾기"
          size="L"
          type="secondary"
          fullWidth
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
        />
      </div>
    </div>
  )
}

const styles = {
  wrapper: cn(
    'flex flex-col',
    'px-4 pt-3 pb-12',
  ),
  subtitle: 'title-16 text-grey-11 font-bold mb-3',
  list: 'flex flex-col',
  footer: 'pt-4 pb-8 flex justify-center',
} as const
