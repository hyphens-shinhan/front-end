'use client'

import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import { cn } from '@/utils/cn'

interface FriendRecommendationCardProps {
  userId: string
  name: string
  generation: string
  category: string
  mutualFriends?: number
  /** 함께 아는 친구 프로필 이미지 URL (최대 3개, 미리보기용) */
  mutualFriendAvatarUrls?: (string | null | undefined)[]
  imageUrl?: string
  /** 이미 팔로우 중이면 true (팔로우 취소 버튼 표시) */
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  onClick?: () => void
}

/** 친구 프로필 카드 */
export default function FriendRecommendationCard({
  name,
  mutualFriends = 0,
  mutualFriendAvatarUrls = [],
  imageUrl,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onClick,
}: FriendRecommendationCardProps) {
  const previewAvatars = mutualFriendAvatarUrls.filter(Boolean).slice(0, 3) as string[]

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
      className={styles.card}
    >
      <Avatar
        src={imageUrl ?? undefined}
        alt={name}
        size={64}
        containerClassName={styles.avatarWrap}
      />
      {/** 이름 */}
      <h3 className={styles.name}>{name}</h3>
      {/** 첫번째 친구 외 */}
      {mutualFriends > 0 && (
        <div className={styles.mutualFriendsContainer}>
          <div className={styles.mutualFriendsInfoContainer}>
            <div className={styles.memberPreviewContainer}>
              {(previewAvatars.length > 0 ? previewAvatars : [null, null, null]).map((avatarUrl, index) => (
                <Avatar
                  key={avatarUrl || `avatar-${index}`}
                  src={avatarUrl}
                  alt="친구 프로필"
                  size={20}
                  fill
                  containerClassName={styles.memberPreviewItem}
                />
              ))}
            </div>
            <p className={styles.meta}>오시온님 외</p>
          </div>
          <p className={styles.mutualCount}>함께 아는 친구 {mutualFriends}명</p>
        </div>
      )}
      <div onClick={(e) => e.stopPropagation()} role="presentation">
        {isFollowing ? (
          <Button
            label="팔로우 취소"
            size="XS"
            type="secondary"
            onClick={onUnfollow}
            className={styles.followButton}
          />
        ) : (
          <Button
            label="팔로우 요청"
            size="XS"
            type="primary"
            onClick={onFollow}
            className={styles.followButton}
          />
        )}
      </div>
    </div>
  )
}

const styles = {
  card: cn(
    'w-fit min-w-[145px] flex flex-col items-center cursor-pointer touch-manipulation',
    'px-3.5 py-4 gap-2 border border-grey-2 rounded-[12px]',
  ),
  avatarWrap: cn('w-16 h-16 rounded-full bg-grey-3 overflow-hidden shrink-0'),
  name: cn('body-7 text-black'),
  memberPreviewContainer: cn('flex -space-x-2.5 items-center shrink-0'),
  memberPreviewItem: cn('relative w-5 h-5 rounded-full overflow-hidden border border-white'),
  meta: cn('font-caption-caption4 text-grey-7 whitespace-nowrap leading-none'),
  mutualCount: cn('font-caption-caption4 text-grey-7 text-center'),
  mutualFriendsContainer: cn('flex flex-col items-center gap-1'),
  mutualFriendsInfoContainer: cn('flex items-center justify-center gap-1'),
  followButton: cn('px-6 py-1.5 mt-2'),
}
