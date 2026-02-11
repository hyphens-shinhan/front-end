'use client'

import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useCenterModalStore } from '@/stores'

/**
 * 중앙 모달 (title + content, 오버레이 클릭 시 닫기)
 * 전역 레이아웃에 한 번만 등록해두고, useCenterModalStore().onOpen()으로 엽니다.
 */
export default function CenterModal() {
  const { isOpen, options, onClose } = useCenterModalStore()
  const { title, content, closeOnOverlayClick = true } = options

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        'bg-black/50',
        'flex items-center justify-center',
        'animate-fade-in',
        'px-6',
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'w-full max-w-[320px]',
          'bg-white rounded-[16px]',
          'overflow-hidden',
          'animate-scale-in',
          'px-5 pt-6 pb-5',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="title-18 text-grey-11 text-center pb-4">{title}</h2>
        )}
        {content && <div>{content}</div>}
      </div>
    </div>
  )
}
