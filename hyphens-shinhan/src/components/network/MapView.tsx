'use client'

import type { Location, Person } from '@/types/network'
import { cn } from '@/utils/cn'

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

/** 지도 뷰. react-leaflet 미사용 시 플레이스홀더(정적 맵 링크) 표시. */
export default function MapView({
  currentLocation,
  people = [],
  onPersonClick,
  className = '',
}: MapViewProps) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${currentLocation.latitude}&mlon=${currentLocation.longitude}#map=14/${currentLocation.latitude}/${currentLocation.longitude}`

  return (
    <div className={cn('w-full h-full bg-grey-3 flex flex-col items-center justify-center', className)}>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-grey-7 hover:text-primary-shinhanblue underline"
      >
        지도에서 보기 (OpenStreetMap)
      </a>
      <p className="text-xs text-grey-6 mt-2">
        주변 사람 {people.length}명
      </p>
      {people.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 justify-center max-w-full px-2">
          {people.slice(0, 5).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPersonClick?.(p)}
              className="text-xs px-2 py-1 rounded-full bg-grey-2 text-grey-8 hover:bg-grey-3"
            >
              {p.name}
            </button>
          ))}
          {people.length > 5 && (
            <span className="text-xs text-grey-6">+{people.length - 5}</span>
          )}
        </div>
      )}
    </div>
  )
}
