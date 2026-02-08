'use client'

/** 지도 이벤트 핸들러. react-leaflet 사용 시 useMapEvents로 bounds 전달. 현재는 no-op. */
interface MapEventsHandlerProps {
  onMapInteraction?: (bounds: {
    north: number
    south: number
    east: number
    west: number
  }) => void
}

export default function MapEventsHandler(_props: MapEventsHandlerProps) {
  return null
}
