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
    <div className="space-y-3 px-4">
      <h2 className="font-semibold text-lg text-grey-10">함께 아는 친구</h2>
      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 scrollbar-hide',
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        )}
      >
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
