'use client'

import { cn } from '@/utils/cn'
import { Icon } from './Icon'

export type JoinProfileType = 'realname' | 'anonymous'

const RANDOM_NICKNAMES = [
  '별빛이', '달빛이', '하늘이', '바람이', '구름이', '꽃님이', '나뭇잎', '산들바람',
  '햇살이', '물결이', '숲속이', '강물이', '눈꽃이', '나래이', '노을이', '바다이',
]

function getRandomNickname(current?: string): string {
  const pool = current ? RANDOM_NICKNAMES.filter((n) => n !== current) : RANDOM_NICKNAMES
  return pool[Math.floor(Math.random() * pool.length)] ?? RANDOM_NICKNAMES[0]
}

interface JoinProfileOptionsProps {
  value: JoinProfileType
  onChange: (value: JoinProfileType) => void
  /** 익명 선택 시 사용할 닉네임 (랜덤 선택 값) */
  anonymousNickname?: string
  /** 익명 닉네임 변경 시 (랜덤 다시 고르기) */
  onAnonymousNicknameChange?: (nickname: string) => void
}

const OPTIONS: { value: JoinProfileType; label: string }[] = [
  { value: 'realname', label: '실명으로 참여하기' },
  { value: 'anonymous', label: '익명으로 참여하기' },
]

/** 소모임 참여 시 실명/익명 선택 옵션 목록 */
export default function JoinProfileOptions({
  value,
  onChange,
  anonymousNickname = '',
  onAnonymousNicknameChange,
}: JoinProfileOptionsProps) {
  const handleSelectAnonymous = () => {
    onChange('anonymous')
    if (onAnonymousNicknameChange) {
      onAnonymousNicknameChange(getRandomNickname())
    }
  }

  const handleOptionClick = (optionValue: JoinProfileType) => {
    if (optionValue === 'anonymous') {
      handleSelectAnonymous()
    } else {
      onChange(optionValue)
    }
  }

  const handleShuffleNickname = () => {
    onAnonymousNicknameChange?.(getRandomNickname(anonymousNickname))
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent, optionValue: JoinProfileType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOptionClick(optionValue)
    }
  }

  return (
    <div className={styles.optionWrapper}>
      {OPTIONS.map((option) => (
        <div
          key={option.value}
          role="button"
          tabIndex={0}
          onClick={() => handleOptionClick(option.value)}
          onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
          className={cn(
            styles.option,
            value === option.value && styles.optionSelected,
            option.value === 'anonymous' && value === 'anonymous' && styles.optionWithContent
          )}
        >
          <div className={styles.optionRow}>
            <Icon
              name="IconMBoldTickCircle"
              size={20}
              className={cn(
                styles.optionIcon,
                value === option.value && styles.optionIconSelected
              )}
            />
            <span className={styles.optionText}>{option.label}</span>
          </div>
          {option.value === 'anonymous' && value === 'anonymous' && (
            <div className={styles.randomNameSection} onClick={(e) => e.stopPropagation()}>
              <p className={styles.randomNameLabel}>랜덤 이름을 골라주세요!</p>
              <div className={styles.randomNameField}>
                <span className={styles.randomNameValue}>
                  {anonymousNickname || '아래 버튼을 눌러 주세요'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShuffleNickname()
                  }}
                  className={styles.shuffleButton}
                  aria-label="다른 이름 고르기"
                >
                  <Icon name="IconMBoldRefreshCircle" size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  optionWrapper: cn('flex flex-col gap-1.5'),
  option: cn(
    'flex flex-col items-stretch body-7 w-full text-left cursor-pointer',
    'px-4 py-3 gap-0',
    'border border-grey-3 rounded-[16px]',
    'active:opacity-90'
  ),
  optionWithContent: cn('gap-3'),
  optionRow: cn('flex items-center gap-2'),
  optionSelected: cn('bg-grey-2'),
  optionText: cn('text-grey-11'),
  optionIcon: cn('text-grey-4'),
  optionIconSelected: cn('text-primary-secondarysky'),
  randomNameSection: cn('flex flex-col gap-2.5'),
  randomNameLabel: cn('font-caption-caption3 text-grey-9'),
  randomNameField: cn(
    'flex items-center gap-2',
    'bg-white border border-grey-3 rounded-[12px]',
    'px-3 py-1.5'
  ),
  randomNameValue: cn('flex-1 font-caption-caption3 text-grey-9'),
  shuffleButton: cn('p-1 -m-1 active:opacity-70 text-grey-9'),
}
