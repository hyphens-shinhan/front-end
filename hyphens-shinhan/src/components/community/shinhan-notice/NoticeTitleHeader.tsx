import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";

interface NoticeTitleHeaderProps {
    /** 공지 제목 */
    title: string;
    /** 상단 고정 여부 */
    is_pinned?: boolean;
    /** New 뱃지 노출 여부 (오늘 포함 3일 이내 등) */
    showNewBadge?: boolean;
    /** 제목 레벨 - 카드용 h3, 상세용 h1 */
    titleAs?: 'h1' | 'h3';
    /** 카드용(제목 말줄임 1줄) / 상세용(전체) */
    variant?: 'card' | 'detail';
    className?: string;
}

/** 공지 제목 + 핀 아이콘 + New 뱃지 (목록/상세 공통) */
export default function NoticeTitleHeader({
    title,
    is_pinned = false,
    showNewBadge = false,
    titleAs: TitleTag = 'h3',
    variant = 'detail',
    className,
}: NoticeTitleHeaderProps) {
    const isCard = variant === 'card';
    return (
        <header className={cn(styles.container, isCard && styles.containerCard, className)}>
            <TitleTag className={cn(styles.title, isCard && styles.titleCard)}>{title}</TitleTag>
            {is_pinned && <Icon name="IconLBoldPin" size={20} className={styles.pinIcon} />}
            {showNewBadge && <Icon name="IconMVectorNewbadge" size={20} />}
        </header>
    );
}

const styles = {
    container: cn('flex items-center gap-1 pr-4'),
    containerCard: cn('min-w-0'),
    title: cn('title-18 text-grey-11'),
    titleCard: cn('min-w-0 line-clamp-1'),
    pinIcon: cn('text-grey-9'),
};