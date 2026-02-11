'use client'

import { Icon } from '@/components/common/Icon'
import Radio from '@/components/common/Radio'
import { cn } from '@/utils/cn'

type SelectableVariant = 'checkbox' | 'radio'

interface SelectableOptionRowProps {
  /** 체크박스 value / name 구분용 */
  value: string
  /** 표시 텍스트 */
  label: string
  /** 선택 여부 */
  selected: boolean
  /** 클릭 시 토글(checkbox) 또는 선택(radio) 콜백 */
  onToggle: () => void
  /** 체크박스/라디오 name (그룹 구분, radio일 때 동일 name으로 단일 선택) */
  name?: string
  /** checkbox: 체크 아이콘 / radio: 원형+체크 모양 */
  variant?: SelectableVariant
}

/** 설문/선택지에서 사용하는 한 줄 선택 행 (원형 + 라벨). variant로 체크 모양 구분 */
export default function SelectableOptionRow({
  value,
  label,
  selected,
  onToggle,
  name = 'option',
  variant = 'checkbox',
}: SelectableOptionRowProps) {
  const isRadio = variant === 'radio'

  return (
    <label className={styles.row}>
      <div className={styles.circle}>
        {isRadio ? (
          <Radio selected={selected} />
        ) : (
          <Icon
            name="IconMBoldTickCircle"
            size={24}
            className={selected ? styles.checkIconSelected : styles.checkIcon}
          />
        )}
      </div>
      <input
        type={isRadio ? 'radio' : 'checkbox'}
        name={name}
        value={value}
        checked={selected}
        onChange={onToggle}
        className="sr-only"
      />
      <span className={styles.label}>
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
}
