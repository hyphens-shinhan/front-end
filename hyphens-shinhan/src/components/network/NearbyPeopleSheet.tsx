'use client'

import { useEffect, useState, useRef } from 'react'
import type { Person } from '@/types/network'
import NearbyPersonCard from './NearbyPersonCard'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface NearbyPeopleSheetProps {
  people: Person[]
  isOpen: boolean
  onClose: () => void
  onPersonClick?: (person: Person) => void
}

const COLLAPSED_HEIGHT = '30vh'
const EXPANDED_HEIGHT = '70vh'

export default function NearbyPeopleSheet({
  people,
  isOpen,
  onClose,
  onPersonClick,
}: NearbyPeopleSheetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTranslateY(0)
      setIsExpanded(false)
    } else {
      document.body.style.overflow = ''
      setTranslateY(0)
      setIsExpanded(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleStart = (clientY: number) => {
    setIsDragging(true)
    setStartY(clientY)
    setCurrentY(clientY)
  }

  const handleMove = (clientY: number) => {
    if (!isDragging) return
    setCurrentY(clientY)
    setTranslateY(clientY - startY)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaY = currentY - startY
    if (deltaY > 100) {
      onClose()
      setTranslateY(0)
      setIsExpanded(false)
    } else if (deltaY < -50) {
      setIsExpanded(true)
      setTranslateY(0)
    } else if (deltaY > 50) {
      setIsExpanded(false)
      setTranslateY(0)
    } else {
      setTranslateY(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (dragHandleRef.current?.contains(target) || headerRef.current?.contains(target)) {
      e.preventDefault()
      handleStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      handleMove(e.touches[0].clientY)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (dragHandleRef.current?.contains(target) || headerRef.current?.contains(target)) {
      e.preventDefault()
      handleStart(e.clientY)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientY)
    }
    const handleMouseUp = () => {
      if (isDragging) handleEnd()
    }
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, startY, currentY])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex flex-col"
        style={{
          height: isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          maxHeight: EXPANDED_HEIGHT,
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, height 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => isDragging && handleEnd()}
      >
        <div
          ref={dragHandleRef}
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-12 h-1.5 bg-grey-3 rounded-full" />
        </div>
        <div
          ref={headerRef}
          className="flex items-center justify-between px-5 pb-3 border-b border-grey-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="font-medium text-lg text-grey-10">
            주변 사람 ({people.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-grey-2 flex items-center justify-center hover:bg-grey-3 transition-colors"
            aria-label="닫기"
          >
            <Icon name="IconLLineClose" size={16} className="text-grey-7" />
          </button>
        </div>
        <div className={cn('flex-1 overflow-y-auto')}>
          <div className="p-5 space-y-3">
            {people.map((person) => (
              <NearbyPersonCard
                key={person.id}
                person={person}
                onClick={() => onPersonClick?.(person)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
