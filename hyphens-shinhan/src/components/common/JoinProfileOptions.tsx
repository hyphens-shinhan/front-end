'use client'

import { cn } from '@/utils/cn'
import { Icon } from './Icon'

export type JoinProfileType = 'realname' | 'anonymous'

interface JoinProfileOptionsProps {
  value: JoinProfileType
  onChange: (value: JoinProfileType) => void
}

const OPTIONS: { value: JoinProfileType; label: string }[] = [
  { value: 'realname', label: '실명으로 참여하기' },
  { value: 'anonymous', label: '익명으로 참여하기' },
]

/** 소모임 참여 시 실명/익명 선택 옵션 목록 */
export default function JoinProfileOptions({ value, onChange }: JoinProfileOptionsProps) {
  return (
    <div className={styles.optionWrapper}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            styles.option,
            value === option.value && styles.optionSelected
          )}
        >
          <Icon
            name="IconMBoldTickCircle"
            size={20}
            className={cn(
              styles.optionIcon,
              value === option.value && styles.optionIconSelected
            )}
          />
          <span className={styles.optionText}>{option.label}</span>
        </button>
      ))}
    </div>
  )
}

const styles = {
  optionWrapper: cn('flex flex-col gap-1.5 mt-[22px]'),
  option: cn(
    'flex items-center gap-2 body-7 w-full text-left',
    'px-4 py-3',
    'border border-grey-3 rounded-[16px]',
    'active:opacity-90'
  ),
  optionSelected: cn('bg-grey-2'),
  optionText: cn('text-grey-11'),
  optionIcon: cn('text-grey-4'),
  optionIconSelected: cn('text-primary-secondarysky'),
}
