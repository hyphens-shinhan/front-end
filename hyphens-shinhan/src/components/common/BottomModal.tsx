'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'
import { useBottomSheetStore } from '@/stores'

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

  const { title, content, closeOnOverlayClick = true } = options

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      {/* 모달 컨텐츠 */}
      <div ref={modalRef} className={styles.modal}>
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
  )
}

const styles = {
  overlay: cn(
    'fixed inset-0 z-50',
    'bg-black/50',
    'animate-fade-in',
    'flex flex-col justify-end items-center'
  ),
  modal: cn(
    'w-full max-w-md',
    'bg-white rounded-t-[20px]',
    'max-h-[80vh] overflow-y-auto',
    'animate-slide-up',
    'pb-[env(safe-area-inset-bottom)]'
  ),
  handleWrapper: 'flex justify-center pt-3 pb-2',
  handle: 'w-10 h-1 bg-grey-5 rounded-full',
  titleWrapper: 'px-5 pb-4',
  title: 'title-18 text-grey-11',
  content: 'px-5 pb-5',
}
