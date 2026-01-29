'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { useBottomSheetStore } from '@/stores'

const ANIMATION_DURATION = 250 // ms

/**
 * 바텀시트 모달 컴포넌트
 *
 * 전역 레이아웃에 한 번만 등록해두면,
 * 어디서든 useBottomSheetStore의 open으로 모달을 열 수 있습니다.
 *
 * @example
 * // 1. 루트 레이아웃에 등록 (한 번만)
 * <BottomModal />
 *
 * // 2. 어디서든 모달 열기
 * const { open } = useBottomSheetStore();
 * open({
 *   title: '옵션 선택',
 *   content: (
 *     <div className="flex flex-col gap-3">
 *       <button>수정하기</button>
 *       <button>삭제하기</button>
 *     </div>
 *   ),
 * });
 */
export default function BottomModal() {
  const { isOpen, options, onClose } = useBottomSheetStore()
  const modalRef = useRef<HTMLDivElement>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const { title, content, closeOnOverlayClick = true } = options

  // 열림/닫힘 상태 관리
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
    }
  }, [isOpen])

  // 닫힘 애니메이션 처리
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setShouldRender(false)
      setIsClosing(false)
    }, ANIMATION_DURATION)
  }

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isClosing])

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [shouldRender])

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && !isClosing) {
      handleClose()
    }
  }

  if (!shouldRender) return null

  return (
    <div
      className={cn(styles.overlay, isClosing && 'animate-fade-out')}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      {/* 모달 위치 wrapper */}
      <div className={styles.modalWrapper}>
        {/* 모달 컨텐츠 */}
        <div
          ref={modalRef}
          className={cn(styles.modal, isClosing && 'animate-slide-down')}
        >
          {/* 드래그 핸들 */}
          <div className={styles.handleWrapper}>
            <div className={styles.handle} />
          </div>

          {/* 타이틀 */}
          {title && (
            <div className={styles.titleWrapper}>
              <h2 className={styles.title}>{title}</h2>
            </div>
          )}

          {/* 컨텐츠 영역 */}
          <div className={styles.content}>{content}</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: cn(
    'fixed inset-0 z-50',
    'animate-fade-in'
  ),
  modalWrapper: cn(
    'absolute bottom-0 left-0 right-0',
    'flex justify-center'
  ),
  modal: cn(
    'w-full max-w-md',
    'bg-white rounded-t-[24px]',
    'animate-slide-up',
    'pb-[calc(env(safe-area-inset-bottom)+48px)]',
    'shadow-[0_-4px_20px_rgba(0,0,0,0.15)]'
  ),
  handleWrapper: 'flex justify-center pt-3 pb-4',
  handle: 'w-9 h-1.5 bg-grey-7 rounded-full',
  titleWrapper: 'px-5 pb-4',
  title: 'title-18 text-grey-11',
  content: 'px-5 pb-5',
}
