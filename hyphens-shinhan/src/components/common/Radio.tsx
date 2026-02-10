'use client'

import { cn } from '@/utils/cn'

/** Figma Radio (Selected=off / Selected=on): 24px 원형, 선택 시 파란 테두리 + 내부 dot */
interface RadioProps {
  selected?: boolean
  className?: string
  /** 스크린리더용 (시각만 쓸 때는 부모 label로 처리) */
  'aria-hidden'?: boolean
}

/** 라디오 버튼 컴폰너트 */
export default function Radio({
  selected = false,
  className,
  'aria-hidden': ariaHidden = true,
}: RadioProps) {
  return (
    <div
      className={cn(
        styles.wrapper,
        selected ? styles.wrapperSelected : styles.wrapperUnselected,
        className,
      )}
      aria-hidden={ariaHidden}
    >
      {selected && <span className={styles.dot} aria-hidden />}
    </div>
  )
}

const styles = {
  wrapper: cn(
    'shrink-0 flex items-center justify-center rounded-full transition-colors',
    'w-5 h-5 border bg-white',
  ),
  wrapperSelected: 'border-primary-light',
  wrapperUnselected: 'border-grey-4',
  dot: 'w-3 h-3 rounded-full bg-primary-light',
} 
