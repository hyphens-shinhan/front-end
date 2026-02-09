'use client'

import { useEffect, useMemo } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import type { ClubAnonymity } from '@/types/clubs'
import { useGenerateRandomNickname } from '@/hooks/clubs/useClubMutations'

export type JoinProfileType = 'realname' | 'anonymous'

interface JoinProfileOptionsProps {
  value: JoinProfileType
  onChange: (value: JoinProfileType) => void
  /** 익명 선택 시 사용할 닉네임 (랜덤 선택 값) */
  anonymousNickname?: string
  /** 익명 닉네임 변경 시 (랜덤 다시 고르기) */
  onAnonymousNicknameChange?: (nickname: string) => void
  /** 소모임 익명 설정 (PUBLIC=실명만, PRIVATE=익명만, BOTH=둘 다) */
  anonymity?: ClubAnonymity
}

const ALL_OPTIONS: { value: JoinProfileType; label: string }[] = [
  { value: 'realname', label: '실명으로 참여하기' },
  { value: 'anonymous', label: '익명으로 참여하기' },
]

/** 소모임 참여 시 실명/익명 선택 옵션 목록 */
export default function JoinProfileOptions({
  value,
  onChange,
  anonymousNickname = '',
  onAnonymousNicknameChange,
  anonymity = 'BOTH',
}: JoinProfileOptionsProps) {
  const generateNicknameMutation = useGenerateRandomNickname()

  // anonymity 설정에 따라 사용 가능한 옵션 필터링
  const availableOptions = useMemo(() => {
    return ALL_OPTIONS.filter((option) => {
      if (anonymity === 'PUBLIC') {
        // PUBLIC: 실명만 선택 가능
        return option.value === 'realname'
      }
      if (anonymity === 'PRIVATE') {
        // PRIVATE: 익명만 선택 가능
        return option.value === 'anonymous'
      }
      // BOTH: 둘 다 선택 가능
      return true
    })
  }, [anonymity])

  // 사용 가능한 옵션이 하나뿐이면 자동으로 선택
  const effectiveValue = useMemo(() => {
    if (availableOptions.length === 1) {
      return availableOptions[0].value
    }
    return value
  }, [availableOptions, value])

  // anonymity나 availableOptions 변경 시 유효한 값으로 자동 설정
  useEffect(() => {
    if (availableOptions.length === 1) {
      // 옵션이 하나뿐이면 자동 선택
      if (value !== availableOptions[0].value) {
        const newValue = availableOptions[0].value
        onChange(newValue)
        // 익명으로 자동 선택된 경우 닉네임도 자동 생성
        if (newValue === 'anonymous' && onAnonymousNicknameChange) {
          generateNicknameMutation.mutate(undefined, {
            onSuccess: (data) => {
              onAnonymousNicknameChange(data.nickname)
            },
          })
        }
      }
    } else if (availableOptions.length > 0) {
      // 현재 선택된 값이 사용 가능한 옵션에 없으면 첫 번째 옵션으로 변경
      const isValid = availableOptions.some((opt) => opt.value === value)
      if (!isValid) {
        const newValue = availableOptions[0].value
        onChange(newValue)
        // 익명으로 변경된 경우 닉네임도 자동 생성
        if (newValue === 'anonymous' && onAnonymousNicknameChange) {
          generateNicknameMutation.mutate(undefined, {
            onSuccess: (data) => {
              onAnonymousNicknameChange(data.nickname)
            },
          })
        }
      }
    }
  }, [anonymity, availableOptions, value, onChange, onAnonymousNicknameChange, generateNicknameMutation])

  // 익명이 선택되어 있고 닉네임이 없을 때 자동으로 생성
  useEffect(() => {
    if (
      effectiveValue === 'anonymous' &&
      !anonymousNickname &&
      onAnonymousNicknameChange &&
      !generateNicknameMutation.isPending
    ) {
      generateNicknameMutation.mutate(undefined, {
        onSuccess: (data) => {
          onAnonymousNicknameChange(data.nickname)
        },
      })
    }
  }, [effectiveValue, anonymousNickname, onAnonymousNicknameChange, generateNicknameMutation])

  const handleSelectAnonymous = () => {
    onChange('anonymous')
    if (onAnonymousNicknameChange) {
      generateNicknameMutation.mutate(undefined, {
        onSuccess: (data) => {
          onAnonymousNicknameChange(data.nickname)
        },
      })
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
    if (onAnonymousNicknameChange) {
      generateNicknameMutation.mutate(undefined, {
        onSuccess: (data) => {
          onAnonymousNicknameChange(data.nickname)
        },
      })
    }
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent, optionValue: JoinProfileType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOptionClick(optionValue)
    }
  }

  return (
    <div className={styles.optionWrapper}>
      {availableOptions.map((option) => (
        <div
          key={option.value}
          role="button"
          tabIndex={0}
          onClick={() => handleOptionClick(option.value)}
          onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
          className={cn(
            styles.option,
            effectiveValue === option.value && styles.optionSelected,
            option.value === 'anonymous' && effectiveValue === 'anonymous' && styles.optionWithContent
          )}
        >
          <div className={styles.optionRow}>
            <Icon
              name="IconMBoldTickCircle"
              size={20}
              className={cn(
                styles.optionIcon,
                effectiveValue === option.value && styles.optionIconSelected
              )}
            />
            <span className={styles.optionText}>{option.label}</span>
          </div>
          {option.value === 'anonymous' && effectiveValue === 'anonymous' && (
            <div className={styles.randomNameSection} onClick={(e) => e.stopPropagation()}>
              <p className={styles.randomNameLabel}>랜덤 이름을 골라주세요!</p>
              <div className={styles.randomNameField}>
                <span className={styles.randomNameValue}>
                  {anonymousNickname || ''}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShuffleNickname()
                  }}
                  className={cn(styles.shuffleButton)}
                  aria-label="다른 이름 고르기"
                  disabled={generateNicknameMutation.isPending}
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
  shuffleButton: cn('p-1 -m-1 active:opacity-70 text-grey-9 transition-transform active:scale-95'),
}
