'use client'

import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

interface MemberPreviewRowProps {
  /** 멤버 목록 펼침 여부 */
  isOpen: boolean
  /** 펼침/접힘 토글 */
  onToggle: () => void
  /** 출석 인원 수 (있으면 "N명" 표시) */
  attendanceCount?: number
}

/** 참석 멤버 프로필 미리보기 한 줄 (겹친 아바타 + 이름 + 펼침 버튼) */
export default function MemberPreviewRow({
  isOpen,
  onToggle,
  attendanceCount = 0,
}: MemberPreviewRowProps) {
  const label =
    attendanceCount > 0
      ? attendanceCount <= 3
        ? `참석 멤버 ${attendanceCount}명`
        : `참석 멤버 ${attendanceCount}명`
      : '참석 멤버'

  return (
    <div className={cn(styles.memberRow, isOpen && styles.memberRowOpen)}>
      <div className={styles.memberPreviewContainer}>
        <div className={styles.memberPreviewItem} />
        <div className={styles.memberPreviewItem} />
        <div className={styles.memberPreviewItem} />
      </div>
      <p className={styles.memberNames}>{label}</p>
      <button
        type="button"
        className={cn(styles.arrowWrap, isOpen && styles.arrowOpen)}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? '멤버 목록 접기' : '멤버 목록 펼치기'}
      >
        <Icon name='IconLLineArrowDown' size={24} />
      </button>
    </div>
  )
}

const styles = {
  memberRow: cn('flex items-center gap-3 py-3'),
  memberPreviewContainer: cn('flex -space-x-5'),
  memberPreviewItem: cn('w-10 h-10 rounded-full bg-grey-3 border'),
  memberNames: cn('body-6 text-grey-10'),
  arrowWrap: cn('ml-auto text-grey-9'),
  /** 펼쳤을 때 화살표 위로 */
  arrowOpen: cn('rotate-180'),
  memberRowOpen: cn('py-5'),
}
