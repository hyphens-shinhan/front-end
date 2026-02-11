'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import JoinProfileOptions from './JoinProfileOptions'
import type { JoinProfileType } from './JoinProfileOptions'
import type { UserClubProfile } from '@/types/clubs'

const MODAL_TITLE = '그룹에 참여할 프로필을 선택해주세요'

export interface JoinProfileModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean
  /** 닫기 (X 또는 배경) */
  onClose: () => void
  /** 참여하기 클릭 시 선택한 프로필로 참여 처리 */
  onConfirm: (profile: UserClubProfile) => void
}

/**
 * 소모임 참여 시 실명/익명 프로필 선택 모달.
 * 디자인: rounded-20, 제목 18px bold, 두 옵션 카드, 참여하기 버튼, 우측 상단 X.
 */
export default function JoinProfileModal({
  isOpen,
  onClose,
  onConfirm,
}: JoinProfileModalProps) {
  const [profileType, setProfileType] = useState<JoinProfileType>('realname')
  const [anonymousNickname, setAnonymousNickname] = useState('')

  useEffect(() => {
    if (isOpen) {
      setProfileType('realname')
      setAnonymousNickname('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleConfirm = () => {
    const isAnonymous = profileType === 'anonymous'
    const profile: UserClubProfile = {
      is_anonymous: isAnonymous,
      nickname: isAnonymous ? anonymousNickname : null,
      avatar_url: null,
    }
    onConfirm(profile)
    onClose()
  }

  const canConfirm = profileType === 'realname' || (profileType === 'anonymous' && anonymousNickname.trim().length > 0)

  if (!isOpen) return null

  const modalContent = (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-profile-modal-title"
    >
      <div className={styles.modal}>
        {/* 우측 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="닫기"
        >
          <Icon name="IconLLineClose" size={24} className="text-grey-9" />
        </button>

        <div className={styles.content}>
          <h2 id="join-profile-modal-title" className={styles.title}>
            {MODAL_TITLE}
          </h2>

          <div className={styles.optionsWrapper}>
            <JoinProfileOptions
              value={profileType}
              onChange={setProfileType}
              anonymousNickname={anonymousNickname}
              onAnonymousNicknameChange={setAnonymousNickname}
            />
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn(
              styles.confirmButton,
              !canConfirm && styles.confirmButtonDisabled
            )}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}

const styles = {
  overlay: cn(
    'fixed inset-0 z-[100]',
    'bg-black/50 flex items-center justify-center',
    'animate-fade-in'
  ),
  modal: cn(
    'relative w-full max-w-[317px]',
    'bg-white rounded-[20px]',
    'pt-[26px] pb-5 px-5',
    'animate-scale-in'
  ),
  closeButton: cn(
    'absolute right-5 top-5 p-0 w-6 h-6 flex items-center justify-center',
    'text-grey-9 active:opacity-70'
  ),
  content: cn(
    'flex flex-col items-center gap-[22px]'
  ),
  title: cn(
    'text-center text-grey-11',
    'text-[18px] font-bold leading-[22px]',
    'px-2'
  ),
  optionsWrapper: cn(
    'w-full flex flex-col gap-1.5'
  ),
  confirmButton: cn(
    'flex items-center justify-center',
    'px-[37px] py-2.5 rounded-[12px]',
    'text-[14px] font-semibold leading-5 text-white',
    'bg-primary-shinhanblue hover:bg-primary-dark',
    'shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_1px_2px_rgba(0,0,0,0.04)]',
    'transition-all duration-100 active:scale-[0.98]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-shinhanblue focus-visible:ring-offset-2'
  ),
  confirmButtonDisabled: cn(
    'bg-grey-3 text-grey-6 cursor-not-allowed hover:bg-grey-3'
  ),
}
