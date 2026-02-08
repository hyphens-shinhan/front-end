'use client'

import { Icon } from '@/components/common/Icon'
import MapView from './MapView'
import { CURRENT_LOCATION, MOCK_NEARBY_PEOPLE } from '@/data/mock-network'
import { cn } from '@/utils/cn'

interface NearbyFriendsSectionProps {
  onToggleMap?: () => void
}

export default function NearbyFriendsSection({ onToggleMap }: NearbyFriendsSectionProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 hover:opacity-80 transition-opacity"
        onClick={onToggleMap}
      >
        <h2 className="font-semibold text-lg text-grey-10 leading-[22px]">
          추천 친구를 살펴봐요
        </h2>
        <Icon name="IconLLineArrowRight" size={20} className="text-grey-5" />
      </button>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 hover:opacity-80 transition-opacity"
        onClick={onToggleMap}
      >
        <h3 className="font-medium text-base text-grey-10 leading-[22px]">
          나와 가까운
        </h3>
        <Icon name="IconLLineArrowRight" size={20} className="text-grey-5" />
      </button>
      <div className={cn('relative w-full h-[153px] rounded-2xl overflow-hidden bg-grey-3')}>
        <MapView
          currentLocation={CURRENT_LOCATION}
          people={MOCK_NEARBY_PEOPLE}
          className="h-full"
        />
      </div>
    </div>
  )
}
