'use client'

import { Icon } from '@/components/common/Icon'
import MapView from './MapView'
import { CURRENT_LOCATION, MOCK_NEARBY_PEOPLE } from '@/data/mock-network'
import { cn } from '@/utils/cn'
import type { Person, Location } from '@/types/network'

interface NearbyFriendsSectionProps {
  onToggleMap?: () => void
  /** From GET /networking/nearby; when provided, replaces mock data */
  people?: Person[]
  currentLocation?: Location
}

/** 주변 친구 목록 */
export default function NearbyFriendsSection({
  onToggleMap,
  people: peopleProp,
  currentLocation: currentLocationProp,
}: NearbyFriendsSectionProps) {
  const people = peopleProp ?? MOCK_NEARBY_PEOPLE
  const currentLocation = currentLocationProp ?? CURRENT_LOCATION

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitleBlock}>
        <h2 className={styles.sectionTitle}>추천 친구를 살펴봐요</h2>
      </div>
      <button
        type="button"
        className={styles.rowButton}
        onClick={onToggleMap}
      >
        <h3 className={styles.subsectionTitle}>나와 가까운</h3>
        <Icon name="IconLLineArrowRight" size={24} className={styles.arrowIcon} />
      </button>
      <div className={styles.mapWrapper}>
        <MapView
          currentLocation={currentLocation}
          people={people}
          className={styles.mapView}
        />
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col gap-3'),
  sectionTitleBlock: cn('w-full flex items-center pt-5'),
  rowButton: cn('w-full flex items-center justify-between py-1'),
  sectionTitle: cn('title-18 text-grey-11'),
  subsectionTitle: cn('title-16 text-grey-10'),
  arrowIcon: cn('text-grey-9'),
  mapWrapper: cn('relative w-full h-[153px] overflow-hidden bg-grey-3'),
  mapView: cn('h-full'),
}
