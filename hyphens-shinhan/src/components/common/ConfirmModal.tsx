'use client'

import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useConfirmModalStore } from '@/stores'

/**
 * 확인(Confirm) 모달 컴포넌트
 *
 * 전역 레이아웃에 한 번만 등록해두면,
 * 어디서든 useConfirmModalStore의 open으로 모달을 열 수 있습니다.
 *
 * @example
 * const { open } = useConfirmModalStore();
 * open({
 *   title: '삭제하시겠습니까?',
 *   message: '삭제된 게시글은 복구할 수 없습니다.',
 *   confirmText: '삭제',
 *   isDanger: true,
 *   onConfirm: () => handleDelete(),
 * });
 */
export default function ConfirmModal() {
  const { isOpen, options, onClose } = useConfirmModalStore()

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel()
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

  const {
    title,
    message,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    isDanger = false,
  } = options

  const handleConfirm = () => {
    onConfirm?.()
    close()
  }

  const handleCancel = () => {
    onCancel?.()
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
        <div className="flex border-t border-grey-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 body-7 text-grey-8 border-r border-grey-3 active:bg-grey-2"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              'flex-1 py-4 body-7 active:bg-grey-2',
              isDanger ? 'text-state-red' : 'text-primary-shinhanblue'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
