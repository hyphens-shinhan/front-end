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

const GOOGLE_MAPS_EMBED_BASE = 'https://www.google.com/maps/embed/v1/view'

/** 지도 뷰. Google Maps API 키가 있으면 임베드 맵, 없으면 OpenStreetMap 링크. */
export default function MapView({
  currentLocation,
  people = [],
  onPersonClick,
  className = '',
}: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const center = `${currentLocation.latitude},${currentLocation.longitude}`
  const osmUrl = `https://www.openstreetmap.org/?mlat=${currentLocation.latitude}&mlon=${currentLocation.longitude}#map=14/${currentLocation.latitude}/${currentLocation.longitude}`

  if (apiKey) {
    const embedSrc = `${GOOGLE_MAPS_EMBED_BASE}?key=${apiKey}&center=${center}&zoom=14`
    return (
      <div className={cn('w-full h-full bg-grey-3 flex flex-col', className)}>
        <div className="relative flex-1 min-h-0 w-full">
          <iframe
            title="지도"
            src={embedSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="shrink-0 px-3 py-2 bg-white/90 backdrop-blur-sm border-t border-grey-2">
          <p className="text-xs text-grey-6">
            주변 사람 {people.length}명
          </p>
          {people.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
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
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full bg-grey-3 flex flex-col items-center justify-center', className)}>
      <a
        href={osmUrl}
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
