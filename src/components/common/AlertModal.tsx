'use client'

import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useAlertModalStore } from '@/stores'

/**
 * 알림(Alert) 모달 컴포넌트
 *
 * 전역 레이아웃에 한 번만 등록해두면,
 * 어디서든 useAlertModalStore의 open으로 모달을 열 수 있습니다.
 *
 * @example
 * const { open } = useAlertModalStore();
 * open({
 *   title: '저장 완료',
 *   message: '게시글이 저장되었습니다.',
 * });
 */
export default function AlertModal() {
  const { isOpen, options, onClose } = useAlertModalStore()

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleConfirm()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !options) return null

  const { title, message, confirmText = '확인', onConfirm } = options

  const handleConfirm = () => {
    onConfirm?.()
    close()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        'bg-black/50',
        'flex items-center justify-center',
        'animate-fade-in',
        'px-10'
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* 모달 컨텐츠 */}
      <div
        className={cn(
          'w-full max-w-[320px]',
          'bg-white rounded-[16px]',
          'overflow-hidden',
          'animate-scale-in'
        )}
      >
        {/* 헤더 & 메시지 */}
        <div className="px-6 pt-6 pb-4 text-center">
          <h2 className="title-18 text-grey-11">{title}</h2>
          {message && (
            <p className="mt-2 body-8 text-grey-8">{message}</p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="border-t border-grey-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 body-7 text-primary-shinhanblue active:bg-grey-2"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
