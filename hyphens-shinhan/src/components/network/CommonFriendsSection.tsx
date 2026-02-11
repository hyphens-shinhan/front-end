'use client'

import { EMPTY_CONTENT_MESSAGES } from '@/constants'
import EmptyContent from '../common/EmptyContent'
import FriendRecommendationCard from './FriendRecommendationCard'
import { cn } from '@/utils/cn'

interface Friend {
  userId: string
  name: string
  generation: string
  category: string
  mutualFriends?: number
  imageUrl?: string
  mutualFriendAvatarUrls?: (string | null)[]
  isFollowing?: boolean
}

interface CommonFriendsSectionProps {
  friends?: Friend[]
  /** 카드 클릭 시 (퍼블릭 프로필로 이동 등) */
  onClick?: (userId: string) => void
  /** 팔로우 요청 클릭 시 */
  onFollow?: (userId: string) => void
  /** 팔로우 취소 클릭 시 */
  onUnfollow?: (userId: string) => void
}

export default function CommonFriendsSection({
  friends = [],
  onClick,
  onFollow,
  onUnfollow,
}: CommonFriendsSectionProps) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>함께 아는 친구</h2>
      <div className={styles.cardList}>
        {friends.length > 0 ? friends.map((friend) => (
          <FriendRecommendationCard
            key={friend.userId}
            userId={friend.userId}
            name={friend.name}
            generation={friend.generation}
            category={friend.category}
            mutualFriends={friend.mutualFriends}
            imageUrl={friend.imageUrl}
            mutualFriendAvatarUrls={friend.mutualFriendAvatarUrls}
            isFollowing={friend.isFollowing}
            onFollow={onFollow ? () => onFollow(friend.userId) : undefined}
            onUnfollow={onUnfollow ? () => onUnfollow(friend.userId) : undefined}
            onClick={onClick ? () => onClick(friend.userId) : undefined}
          />
        )) : (
          <EmptyContent
            variant="empty"
            message={EMPTY_CONTENT_MESSAGES.NETWORK.COMMON_FRIENDS_EMPTY}
            className={styles.emptyContent}
          />
        )}
      </div>
    </div>
  )
}

const styles = {
  section: cn('flex flex-col gap-3'),
  title: cn('title-16 text-grey-10'),
  cardList: cn(
    'flex gap-3 overflow-x-auto pb-2 scrollbar-hide',
    'scrollbar-hide',
  ),
  emptyContent: cn('w-full'),
}
