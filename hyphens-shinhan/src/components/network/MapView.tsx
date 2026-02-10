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

/** TODO: 지도 뷰 컴포넌트 작동 확인 필요 */
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
      <div className={cn(styles.root, className)}>
        <div className={styles.mapContainer}>
          <iframe
            title="지도"
            src={embedSrc}
            className={styles.iframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className={styles.footer}>
          <p className={styles.countText}>주변 사람 {people.length}명</p>
          {people.length > 0 && (
            <div className={styles.personChipsWrap}>
              {people.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPersonClick?.(p)}
                  className={styles.personChip}
                >
                  {p.name}
                </button>
              ))}
              {people.length > 5 && (
                <span className={styles.countExtra}>+{people.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(styles.rootFallback, className)}>
      <a
        href={osmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.osmLink}
      >
        지도에서 보기 (OpenStreetMap)
      </a>
      <p className={styles.fallbackCountText}>주변 사람 {people.length}명</p>
      {people.length > 0 && (
        <div className={styles.fallbackChipsWrap}>
          {people.slice(0, 5).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPersonClick?.(p)}
              className={styles.personChip}
            >
              {p.name}
            </button>
          ))}
          {people.length > 5 && (
            <span className={styles.countExtra}>+{people.length - 5}</span>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  root: cn('w-full h-full bg-grey-3 flex flex-col'),
  rootFallback: cn(
    'w-full h-full bg-grey-3 flex flex-col items-center justify-center',
  ),
  mapContainer: cn('relative flex-1 min-h-0 w-full'),
  iframe: cn('absolute inset-0 w-full h-full border-0'),
  footer: cn(
    'shrink-0 px-3 py-2 bg-white/90 backdrop-blur-sm border-t border-grey-2',
  ),
  countText: cn('text-xs text-grey-6'),
  personChipsWrap: cn('mt-1.5 flex flex-wrap gap-1'),
  personChip: cn(
    'text-xs px-2 py-1 rounded-full bg-grey-2 text-grey-8 hover:bg-grey-3',
  ),
  countExtra: cn('text-xs text-grey-6'),
  osmLink: cn(
    'text-sm text-grey-7 hover:text-primary-shinhanblue underline',
  ),
  fallbackCountText: cn('text-xs text-grey-6 mt-2'),
  fallbackChipsWrap: cn(
    'mt-2 flex flex-wrap gap-1 justify-center max-w-full px-2',
  ),
}
