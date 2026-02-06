'use client'

import Link from 'next/link'
import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"
import Avatar from "@/components/common/Avatar"
import type { AttendanceResponse } from "@/types/reports"

interface MemberPreviewRowProps {
  /** 멤버 목록 (이름만) - 기존 호환성 유지 */
  members?: string[]
  /** 출석 목록 (아바타 포함) - members보다 우선 */
  attendance?: AttendanceResponse[]
  /** 멤버 목록 펼침 여부 (href 없을 때만 사용) */
  isOpen?: boolean
  /** 펼침/접힘 토글 (href 없을 때만 사용) */
  onToggle?: () => void
  /** 출석 인원 수 (있으면 "N명" 표시) */
  attendanceCount?: number
  /** 멤버 미리보기 컨테이너 클래스 */
  className?: string
  /**
   * 제출 완료 뷰: 링크 URL이 있으면 링크로 렌더링하고 오른쪽 화살표(>) 표시.
   * 없으면 기존처럼 펼침/접힘 버튼 + 아래 화살표.
   */
  href?: string
}

/** 참석 멤버 프로필 미리보기 한 줄 (겹친 아바타 + 이름 + 펼침 버튼 또는 링크) */
export default function MemberPreviewRow({
  members,
  attendance,
  isOpen = false,
  onToggle = () => {},
  attendanceCount = 0,
  className,
  href,
}: MemberPreviewRowProps) {
  // attendance가 있으면 사용, 없으면 members 사용 (기존 호환성)
  const memberNames = attendance?.map(a => a.name) || members || []
  const memberAvatars = attendance?.map(a => a.avatar_url) || []
  const actualCount = attendanceCount || memberNames.length

  const label =
    actualCount > 0
      ? actualCount <= 3
        ? `${memberNames.slice(0, 2).join(', ')}`
        : `${memberNames.slice(0, 2).join(', ')} 외 ${memberNames.length - 2}명`
      : '참석한 멤버가 없어요'

  // 최대 3개의 아바타만 표시
  const previewAvatars = memberAvatars.slice(0, 3)

  const content = (
    <>
      <div className={styles.memberPreviewContainer}>
        {previewAvatars.length > 0 ? (
          previewAvatars.map((avatarUrl, index) => (
            <Avatar
              key={avatarUrl || `avatar-${index}`}
              src={avatarUrl}
              alt="멤버 프로필"
              fill
              containerClassName={styles.memberPreviewItem}
            />
          ))
        ) : (
          // 아바타가 없을 때는 회색 배경 표시
          <>
            <div className={cn(styles.memberPreviewItem, 'bg-grey-7')} />
            <div className={cn(styles.memberPreviewItem, 'bg-grey-8')} />
            <div className={cn(styles.memberPreviewItem, 'bg-grey-9')} />
          </>
        )}
      </div>
      <p className={styles.memberNames}>{label}</p>
      {href ? (
        <span className={styles.arrowWrap} aria-hidden>
          <Icon name="IconLLineArrowRight" size={24} />
        </span>
      ) : (
        <button
          type="button"
          className={cn(styles.arrowWrap, isOpen && styles.arrowOpen)}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? '멤버 목록 접기' : '멤버 목록 펼치기'}
        >
          <Icon name="IconLLineArrowDown" size={24} />
        </button>
      )}
    </>
  )

  const rowClass = cn(styles.memberRow, !href && isOpen && styles.memberRowOpen, className)

  if (href) {
    return (
      <Link href={href} className={rowClass} aria-label="참여 멤버 상세 보기">
        {content}
      </Link>
    )
  }

  return <div className={rowClass}>{content}</div>
}

const styles = {
  memberRow: cn('flex items-center gap-3'),
  memberPreviewContainer: cn('flex -space-x-5'),
  memberPreviewItem: cn('relative w-9 h-9 rounded-full overflow-hidden'),
  memberNames: cn('body-6 text-grey-10'),
  arrowWrap: cn('ml-auto text-grey-9'),
  /** 펼쳤을 때 화살표 위로 */
  arrowOpen: cn('rotate-180'),
  memberRowOpen: cn('py-5'),
}

