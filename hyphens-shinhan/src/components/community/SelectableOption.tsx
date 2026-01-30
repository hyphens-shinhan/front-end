'use client'
import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface Option {
  value: string
  label: string
}

interface SelectableOptionProps {
  options: Option[]
  defaultValue?: string
  onChange?: (value: string) => void
}

/**
 * 선택 가능한 옵션 리스트 컴포넌트 (단일 선택)
 *
 * @example
 * <SelectableOption
 *   options={[
 *     { value: 'anonymous', label: '익명으로 글 쓰기' },
 *     { value: 'real', label: '실명으로 글 쓰기' },
 *   ]}
 *   defaultValue="anonymous"
 *   onChange={(value) => console.log(value)}
 * />
 */
export default function SelectableOption({
  options,
  defaultValue,
  onChange,
}: SelectableOptionProps) {
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value)

  const handleSelect = (value: string) => {
    setSelected(value)
    onChange?.(value)
  }

  return (
    <div className={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === selected

        return (
          <button
            key={option.value}
            type="button"
            className={styles.button}
            onClick={() => handleSelect(option.value)}
          >
            <p className={cn(styles.label, isSelected && styles.labelSelected)}>
              {option.label}
            </p>
            <Icon
              name="IconLBoldTickCircle"
              className={isSelected ? styles.iconSelected : styles.icon}
            />
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  container: 'flex flex-col gap-1.5',
  button: 'flex items-center justify-between py-1',
  label: 'body-5 text-grey-7',
  labelSelected: 'text-grey-11',
  icon: 'text-grey-5',
  iconSelected: 'text-primary-shinhanblue',
}
