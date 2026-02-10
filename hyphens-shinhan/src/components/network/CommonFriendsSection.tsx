'use client'

import FriendRecommendationCard from './FriendRecommendationCard'
import { cn } from '@/utils/cn'

interface Friend {
  userId: string
  name: string
  generation: string
  category: string
  mutualFriends?: number
  imageUrl?: string
}

interface CommonFriendsSectionProps {
  friends?: Friend[]
}

const DEFAULT_FRIENDS: Friend[] = [
  { userId: '1', name: '박지훈', generation: '3기', category: '창의', mutualFriends: 12 },
  { userId: '2', name: '김서연', generation: '2기', category: '리더십', mutualFriends: 8 },
  { userId: '3', name: '이준호', generation: '4기', category: '기술', mutualFriends: 5 },
]

export default function CommonFriendsSection({
  friends = [],
}: CommonFriendsSectionProps) {
  const displayFriends = friends.length > 0 ? friends : DEFAULT_FRIENDS

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>함께 아는 친구</h2>
      <div className={styles.cardList}>
        {displayFriends.map((friend) => (
          <FriendRecommendationCard
            key={friend.userId}
            userId={friend.userId}
            name={friend.name}
            generation={friend.generation}
            category={friend.category}
            mutualFriends={friend.mutualFriends}
            imageUrl={friend.imageUrl}
          />
        ))}
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
}
