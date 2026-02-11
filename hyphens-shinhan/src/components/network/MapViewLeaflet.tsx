'use client'

import { useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Location, Person } from '@/types/network'
import { cn } from '@/utils/cn'

/* ---------- 커스텀 프로필 마커 아이콘 ---------- */

/** 프로필 이미지가 있으면 원형 이미지, 없으면 이니셜 원 */
function createProfileIcon(person: Person, size = 44): L.DivIcon {
  const borderColor = '#0046FF' // primary-shinhanblue
  const bgColor = '#E8EEFF'
  const initial = person.name.charAt(0)

  const avatarSrc = person.avatar || person.location ? person.avatar : undefined

  const html = avatarSrc
    ? `<div style="
        width:${size}px;height:${size}px;border-radius:50%;
        border:3px solid ${borderColor};overflow:hidden;
        box-shadow:0 2px 8px rgba(0,0,0,0.18);background:${bgColor};
      ">
        <img
          src="${avatarSrc}"
          alt="${person.name}"
          style="width:100%;height:100%;object-fit:cover;"
          onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:${Math.round(size * 0.4)}px;font-weight:700;color:${borderColor}\\'>${initial}</span>'"
        />
      </div>`
    : `<div style="
        width:${size}px;height:${size}px;border-radius:50%;
        border:3px solid ${borderColor};
        background:${bgColor};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.18);
        font-size:${Math.round(size * 0.4)}px;font-weight:700;color:${borderColor};
      ">${initial}</div>`

  return L.divIcon({
    html,
    className: 'leaflet-profile-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

/* ---------- 지도 중심·줌 자동 맞춤 ---------- */

function FitBounds({
  center,
  people,
}: {
  center: Location
  people: Person[]
}) {
  const map = useMap()
  const hasFitted = useRef(false)

  useEffect(() => {
    if (hasFitted.current) return
    hasFitted.current = true

    const points: L.LatLngExpression[] = [
      [center.latitude, center.longitude],
    ]

    people.forEach((p) => {
      if (p.location) {
        points.push([p.location.latitude, p.location.longitude])
      }
    })

    if (points.length > 1) {
      const bounds = L.latLngBounds(points as [number, number][])
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
    } else {
      map.setView([center.latitude, center.longitude], 14)
    }
  }, [map, center, people])

  return null
}

/* ---------- 메인 컴포넌트 ---------- */

interface MapViewLeafletProps {
  currentLocation: Location
  people?: Person[]
  onPersonClick?: (person: Person) => void
  className?: string
}

export default function MapViewLeaflet({
  currentLocation,
  people = [],
  onPersonClick,
  className = '',
}: MapViewLeafletProps) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <MapContainer
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds center={currentLocation} people={people} />

        {people.map((person) => {
          if (!person.location) return null
          return (
            <Marker
              key={person.id}
              position={[person.location.latitude, person.location.longitude]}
              icon={createProfileIcon(person)}
              eventHandlers={{
                click: () => onPersonClick?.(person),
              }}
            >
              <Popup>
                <div className={styles.popup}>
                  <strong className={styles.popupName}>{person.name}</strong>
                  {person.university && (
                    <span className={styles.popupInfo}>{person.university}</span>
                  )}
                  {person.distance != null && (
                    <span className={styles.popupDistance}>
                      {person.distance < 1
                        ? `${Math.round(person.distance * 1000)}m`
                        : `${person.distance.toFixed(1)}km`}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* 하단 주변 인원 카운트 */}
      <div className={styles.badge}>
        <span className={styles.badgeText}>주변 {people.length}명</span>
      </div>

      {/* 커스텀 마커 기본 leaflet 스타일 제거 */}
      <style>{`
        .leaflet-profile-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}

const styles = {
  popup: cn('flex flex-col items-center gap-0.5 px-1 py-0.5'),
  popupName: cn('text-sm font-semibold text-grey-11'),
  popupInfo: cn('text-xs text-grey-7'),
  popupDistance: cn('text-xs text-primary-shinhanblue font-medium'),
  badge: cn(
    'absolute bottom-2 left-2 z-[1000]',
    'rounded-full bg-white/90 backdrop-blur-sm px-3 py-1',
    'shadow-sm border border-grey-2',
  ),
  badgeText: cn('text-xs font-medium text-grey-8'),
}
