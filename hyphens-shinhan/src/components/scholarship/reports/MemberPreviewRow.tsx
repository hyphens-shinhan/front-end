'use client'

import { Icon } from "@/components/common/Icon"
import { cn } from "@/utils/cn"

interface MemberPreviewRowProps {
    /** 멤버 목록 펼침 여부 */
    isOpen: boolean
    /** 펼침/접힘 토글 */
    onToggle: () => void
}

/** 참석 멤버 프로필 미리보기 한 줄 (겹친 아바타 + 이름 + 펼침 버튼) */
export default function MemberPreviewRow({
    isOpen,
    onToggle,
}: MemberPreviewRowProps) {
    return (
        <div className={cn(styles.memberRow, styles.ybMemberRow)}>
            <div className={styles.memberPreviewContainer}>
                <div className={styles.memberPreviewItem} />
                <div className={styles.memberPreviewItem} />
                <div className={styles.memberPreviewItem} />
            </div>
            <p className={styles.memberNames}>오시온, 김지우 외 7명</p>
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
    memberRow: cn('flex items-center gap-3 py-2'),
    /** YB 화면에서만 적용 - 상단 여백 */
    ybMemberRow: cn('py-5'),
    memberPreviewContainer: cn('flex -space-x-5'),
    memberPreviewItem: cn('w-10 h-10 rounded-full bg-grey-3 border'),
    memberNames: cn('body-6 text-grey-10'),
    arrowWrap: cn('ml-auto text-grey-9'),
    /** 펼쳤을 때 화살표 위로 */
    arrowOpen: cn('rotate-180'),
}
