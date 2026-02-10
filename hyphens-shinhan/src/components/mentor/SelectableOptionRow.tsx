'use client'

import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface SelectableOptionRowProps {
  /** 체크박스 value / name 구분용 */
  value: string
  /** 표시 텍스트 */
  label: string
  /** 선택 여부 */
  selected: boolean
  /** 클릭 시 토글 콜백 */
  onToggle: () => void
  /** 체크박스 name (여러 그룹일 때 구분) */
  name?: string
}

/** 설문/선택지에서 사용하는 한 줄 선택 행 (원형 체크 + 라벨) */
export default function SelectableOptionRow({
  value,
  label,
  selected,
  onToggle,
  name = 'option',
}: SelectableOptionRowProps) {
  return (
    <label className={styles.row}>
      <div className={styles.circle}>
        <Icon
          name="IconMBoldTickCircle"
          size={24}
          className={selected ? styles.checkIconSelected : styles.checkIcon}
        />
      </div>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={selected}
        onChange={onToggle}
        className="sr-only"
      />
      <span className={cn(styles.label, selected && styles.labelSelected)}>
        {label}
      </span>
    </label>
  )
}

const styles = {
  row: cn(
    'flex items-center gap-2 py-3 px-0 cursor-pointer',
    'min-h-[48px] border-b border-grey-2 last:border-b-0',
  ),
  circle: cn('shrink-0 w-6 h-6 rounded-full flex items-center justify-center'),
  checkIcon: cn('text-grey-4'),
  checkIconSelected: cn('text-primary-secondaryroyal'),
  label: 'body-5 text-grey-10 flex-1',
  labelSelected: 'text-grey-11',
}
