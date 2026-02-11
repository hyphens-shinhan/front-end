'use client'

import dynamic from 'next/dynamic'
import type { Location, Person } from '@/types/network'
import { cn } from '@/utils/cn'

/** Leaflet은 SSR 불가 → dynamic import */
const MapViewLeaflet = dynamic(() => import('./MapViewLeaflet'), {
  ssr: false,
  loading: () => (
    <div className={styles.skeleton}>
      <div className={styles.skeletonPulse} />
      <span className={styles.skeletonText}>지도 로딩 중…</span>
    </div>
  ),
})

interface MapViewProps {
  currentLocation: Location
  people?: Person[]
  onLocationChange?: (location: Location) => void
  onMapInteraction?: (bounds: {
    north: number
    south: number
    east: number
    west: number
  }) => void
  onPersonClick?: (person: Person) => void
  className?: string
}

/** 지도 뷰 – nearby 사람들을 원형 프로필 마커로 표시 */
export default function MapView({
  currentLocation,
  people = [],
  onPersonClick,
  className = '',
}: MapViewProps) {
  return (
    <MapViewLeaflet
      currentLocation={currentLocation}
      people={people}
      onPersonClick={onPersonClick}
      className={className}
    />
  )
}

const styles = {
  skeleton: cn(
    'w-full h-full rounded-xl bg-grey-2',
    'flex flex-col items-center justify-center gap-2',
  ),
  skeletonPulse: cn('w-8 h-8 rounded-full bg-grey-3 animate-pulse'),
  skeletonText: cn('text-xs text-grey-6'),
}
