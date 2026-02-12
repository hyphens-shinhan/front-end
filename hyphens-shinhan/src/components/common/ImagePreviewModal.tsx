'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ImagePreviewModalProps {
  /** 이미지 URL 목록 */
  images: string[]
  /** 처음 보여줄 이미지 인덱스 */
  initialIndex?: number
  /** 모달 닫기 핸들러 */
  onClose: () => void
}

/**
 * 전체화면 이미지 미리보기 모달
 * - 좌우 스와이프로 이미지 전환
 * - 배경 탭 또는 X 버튼으로 닫기
 * - 하단 인디케이터 표시
 */
export default function ImagePreviewModal({
  images,
  initialIndex = 0,
  onClose,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(-1)
      if (e.key === 'ArrowRight') goTo(1)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const goTo = useCallback(
    (dir: number) => {
      const nextIndex = currentIndex + dir
      if (nextIndex < 0 || nextIndex >= images.length) return
      setDirection(dir)
      setCurrentIndex(nextIndex)
    },
    [currentIndex, images.length],
  )

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      goTo(1)
    } else if (info.offset.x > threshold) {
      goTo(-1)
    }
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="닫기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* 이미지 영역 */}
      <div
        className={styles.imageArea}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className={styles.imageContainer}
          >
            <Image
              src={images[currentIndex]}
              alt={`미리보기 ${currentIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 인디케이터 */}
      {images.length > 1 && (
        <div className={styles.indicatorWrapper}>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                styles.dot,
                idx === currentIndex ? styles.dotActive : styles.dotInactive,
              )}
              onClick={(e) => {
                e.stopPropagation()
                setDirection(idx > currentIndex ? 1 : -1)
                setCurrentIndex(idx)
              }}
              aria-label={`이미지 ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

const styles = {
  overlay: cn(
    'fixed inset-0 z-[9999]',
    'flex flex-col items-center justify-center',
    'bg-black/90',
  ),
  closeButton: cn(
    'absolute top-4 right-4 z-10',
    'w-10 h-10 flex items-center justify-center',
    'rounded-full bg-white/10',
    'active:bg-white/20 transition-colors',
  ),
  counter: cn(
    'absolute top-5 left-1/2 -translate-x-1/2 z-10',
    'text-sm text-white/80',
  ),
  imageArea: cn(
    'relative w-full flex-1',
    'flex items-center justify-center',
    'overflow-hidden',
  ),
  imageContainer: cn(
    'relative w-full h-full',
    'cursor-grab active:cursor-grabbing',
  ),
  indicatorWrapper: cn(
    'flex gap-1.5 pb-8 pt-4',
  ),
  dot: cn(
    'w-2 h-2 rounded-full transition-colors',
  ),
  dotActive: cn('bg-white'),
  dotInactive: cn('bg-white/40'),
}
