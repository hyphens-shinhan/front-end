'use client'

import { useMandatoryActivityLookup } from '@/hooks/mandatory/useMandatory'
import { cn } from '@/utils/cn'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants/emptyContent'
import Button from '@/components/common/Button'

interface MandatoryActivityDetailContentProps {
  activityId: string
}

const styles = {
  wrapper: cn('px-4 py-6'),
  title: cn('title-16 text-grey-11 mb-2 text-center mt-10'),
  description: cn('body-6 text-grey-8 mb-6 text-center'),
  buttonWrapper: cn('flex items-center justify-center mt-10'),
}

/** 연간 필수 활동 – 만족도 조사(URL_REDIRECT). 활동 정보 + 외부 링크 안내 */
export default function MandatoryActivityDetailContent({
  activityId,
}: MandatoryActivityDetailContentProps) {
  const { data, isLoading, isError } = useMandatoryActivityLookup(activityId)

  const activity = data?.activity ?? null
  const submission = data?.submission ?? null
  const isCompleted = submission?.is_submitted ?? false
  const externalUrl = activity?.external_url ?? null

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className={styles.wrapper}>
        <EmptyContent
          variant="error"
          message={EMPTY_CONTENT_MESSAGES.ERROR.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className={styles.wrapper}>
        <EmptyContent
          variant="empty"
          message={EMPTY_CONTENT_MESSAGES.EMPTY.MANDATORY_ACTIVITY}
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{activity.title}</h2>
      <p className={styles.description}>
        {isCompleted
          ? '만족도 조사에 참여해 주셔서 감사합니다.'
          : '아래 버튼을 눌러 만족도 조사에 참여해 주세요.'}
      </p>
      {externalUrl && !isCompleted && (
        <div className={styles.buttonWrapper}>
          <Button
            label="만족도 조사 참여하기"
            size="L"
            type="primary"
            onClick={() => window.open(externalUrl, '_blank', 'noopener,noreferrer')}
          />
        </div>
      )}
    </div>
  )
}
