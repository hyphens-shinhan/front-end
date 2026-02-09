'use client'

import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useConfirmModalStore } from '@/stores'
import { Icon } from './Icon'
import Button from './Button'

/**
 * 확인(Confirm) 모달 컴포넌트
 *
 * 전역 레이아웃에 한 번만 등록해두면,
 * 어디서든 useConfirmModalStore의 onOpen으로 모달을 열 수 있습니다.
 * content를 넘기면 title/message 대신 또는 함께 커스텀 컨텐츠를 넣을 수 있습니다.
 *
 * @example
 * const { onOpen } = useConfirmModalStore();
 * onOpen({
 *   title: '삭제하시겠습니까?',
 *   message: '삭제된 게시글은 복구할 수 없습니다.',
 *   confirmText: '삭제',
 *   isDanger: true,
 *   onConfirm: () => handleDelete(),
 * });
 *
 * // 커스텀 컨텐츠 사용
 * onOpen({
 *   title: '프로필 선택',
 *   content: <ProfileList />,
 *   confirmText: '참여하기',
 *   onConfirm: () => {},
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
    content,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    isDanger = false,
  } = options

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <div
      className={styles.container}
      role="dialog"
      aria-modal="true"
    >
      {/* 모달 컨텐츠 */}
      <div
        className={styles.modal}
      >
        {/** 헤더: 제목 가운데, 닫기 버튼 오른쪽 상단 */}
        <div className={styles.titleWrapper}>
          <div className={styles.titleTextWrapper}>
            {title.split('\n').map((line, index) => (
              <p key={index} className={styles.titleStyle}>{line}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className={styles.closeButton}
            aria-label="닫기"
          >
            <Icon name="IconLLineClose" />
          </button>
        </div>

        {/** 커스텀 컨텐츠 */}
        {content != null && <div>{content}</div>}

        {/** 메시지 */}
        {message && <p className={styles.messageStyle}>{message}</p>}

        {/** 버튼 영역 */}
        <div className={styles.buttonWrapper}>
          <Button
            label={confirmText}
            onClick={handleConfirm}
            size="M"
            type="primary"
            className='px-9'
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: cn(
    'fixed inset-0 z-[60]',
    'bg-black/50',
    'flex items-center justify-center',
    'animate-fade-in',
  ),
  modal: cn(
    'px-5 pt-7 pb-5',
    'bg-white rounded-[16px]',
    'overflow-hidden',
    'animate-scale-in'
  ),
  titleStyle: cn(
    'title-18 text-grey-11',
  ),
  titleWrapper: cn(
    'relative flex items-start justify-center px-12 pb-4',
  ),
  messageStyle: cn(
    'body-7 text-grey-10',
    'text-center',
  ),
  titleTextWrapper: cn(
    'flex flex-col items-center text-center',
  ),
  closeButton: cn(
    'absolute right-0 top-0 p-1 -m-1 active:opacity-70',
  ),
  buttonWrapper: cn(
    'flex flex-1 items-center justify-center mt-5',
  ),
}
