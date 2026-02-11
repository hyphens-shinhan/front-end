'use client'

import { cn } from '@/utils/cn'

interface GroupMoreOptionsMenuProps {
  /** 멤버보기 핸들러 */
  onViewMembers?: () => void
  /** 채팅방 가기 핸들러 (멤버일 때만 표시) */
  onGoToChat?: () => void
  /** 소모임 나가기 핸들러 */
  onLeaveClub: () => void
  /** 멤버 여부 (채팅방 가기, 소모임 나가기 표시 여부 결정) */
  isMember?: boolean
  /** 그룹 정보 보기 핸들러 (선택적) */
  onViewGroupInfo?: () => void
}

/**
 * 소모임 더보기 메뉴 컴포넌트
 * GroupDetailContent와 GroupChatView에서 공통으로 사용
 */
export default function GroupMoreOptionsMenu({
  onViewMembers,
  onGoToChat,
  onLeaveClub,
  isMember = false,
  onViewGroupInfo,
}: GroupMoreOptionsMenuProps) {
  const handleClick = (handler?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    handler?.()
  }

  return (
    <div className={styles.menuList}>
      {onViewMembers && (
        <button type="button" className={styles.menuItem} onClick={handleClick(onViewMembers)}>
          <span className={styles.menuLabel}>멤버보기</span>
        </button>
      )}
      {onViewGroupInfo && (
        <button type="button" className={styles.menuItem} onClick={handleClick(onViewGroupInfo)}>
          <span className={styles.menuLabel}>그룹 정보 보기</span>
        </button>
      )}
      {isMember && (
        <>
          {onGoToChat && (
            <button type="button" className={styles.menuItem} onClick={handleClick(onGoToChat)}>
              <span className={styles.menuLabel}>채팅방 가기</span>
            </button>
          )}
          <button type="button" className={styles.menuItem} onClick={handleClick(onLeaveClub)}>
            <span className={styles.menuLabel}>소모임 나가기</span>
          </button>
        </>
      )}
    </div>
  )
}

const styles = {
  menuList: 'flex flex-col gap-0',
  menuItem: cn(
    'w-full py-3 text-left',
    'body-5 text-grey-11',
    'transition-colors active:bg-grey-1-1',
  ),
  menuLabel: 'block',
}
