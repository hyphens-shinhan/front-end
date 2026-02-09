'use client'

import { useRouter } from 'next/navigation'
import type { MentorMatch } from '@/types/mentor'
import { ROUTES } from '@/constants'
import MentorMatchCard from './MentorMatchCard'
import Separator from '@/components/common/Separator'
import { cn } from '@/utils/cn'

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
        <button
          type="button"
          onClick={() => router.push(ROUTES.MENTORS.QUESTIONNAIRE)}
          className={styles.refreshButton}
        >
          다시 찾기
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: cn(
    'flex flex-col',
    'px-4 pt-3 pb-12',
  ),
  subtitle: 'title-16 text-grey-11 font-bold mb-4',
  list: 'flex flex-col',
  footer: 'pt-4 pb-8 flex justify-center',
  refreshButton: cn(
    'body-5 text-grey-9',
    'px-[60px] py-3',
    'rounded-2xl border border-grey-2 bg-white',
    'shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.04)]',
    'hover:bg-grey-1-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2',
  ),
} as const
