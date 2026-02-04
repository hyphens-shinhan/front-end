'use client'

import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

interface MemberPreviewRowProps {
  /** 멤버 목록 */
  members: string[]
  /** 멤버 목록 펼침 여부 */
  isOpen: boolean
  /** 펼침/접힘 토글 */
  onToggle: () => void
  /** 출석 인원 수 (있으면 "N명" 표시) */
  attendanceCount?: number
  /** 멤버 미리보기 컨테이너 클래스 */
  className?: string
}

/** 참석 멤버 프로필 미리보기 한 줄 (겹친 아바타 + 이름 + 펼침 버튼) */
export default function MemberPreviewRow({
  members,
  isOpen,
  onToggle,
  attendanceCount = 0,
  className,
}: MemberPreviewRowProps) {
  const label =
    attendanceCount > 0
      ? attendanceCount <= 3
        ? `${members.slice(0, 2).join(', ')}`
        : `${members.slice(0, 2).join(', ')} 외 ${members.length - 2}명`
      : '참석한 멤버가 없어요'

  return (
    <div className={cn(styles.memberRow, isOpen && styles.memberRowOpen, className)}>
      {/** TODO: 사진 추가 필요 */}
      <div className={styles.memberPreviewContainer}>
        <div className={cn(styles.memberPreviewItem, 'bg-grey-7')} />
        <div className={cn(styles.memberPreviewItem, 'bg-grey-8')} />
        <div className={cn(styles.memberPreviewItem, 'bg-grey-9')} />
      </div>
      {/** 참석 멤버 2명 이름 외 N명 */}
      <p className={styles.memberNames}>{label}</p>
      {/** 펼침/접힘 버튼 */}
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
  memberRow: cn('flex items-center gap-3'),
  memberPreviewContainer: cn('flex -space-x-5'),
  memberPreviewItem: cn('w-9 h-9 rounded-full'),
  memberNames: cn('body-6 text-grey-10'),
  arrowWrap: cn('ml-auto text-grey-9'),
  /** 펼쳤을 때 화살표 위로 */
  arrowOpen: cn('rotate-180'),
  memberRowOpen: cn('py-5'),
}
