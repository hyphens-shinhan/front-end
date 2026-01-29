'use client';

import { cn } from "@/utils/cn";
import { Icon } from "@/components/common/Icon";

interface PostInteractionProps {
    likeCount: number;
    commentCount: number;
    scrapCount: number;
    isLiked?: boolean;
    isScraped?: boolean;
    onLikeClick?: () => void;
    onScrapClick?: () => void;
    onCommentClick?: () => void;
}

/** 게시글 상호작용 컴포넌트 (좋아요, 댓글, 스크랩)
 * @param {PostInteractionProps} props
 * @example
 * <PostInteraction 
 *   likeCount={12} 
 *   commentCount={19} 
 *   scrapCount={23}
 *   isLiked={false}
 *   isScraped={true}
 *   onLikeClick={() => {}}
 *   onScrapClick={() => {}}
 * />
 */
export default function PostInteraction({
    likeCount,
    commentCount,
    scrapCount,
    isLiked = false,
    isScraped = false,
    onLikeClick,
    onScrapClick,
    onCommentClick,
}: PostInteractionProps) {
    return (
        <div className={styles.container}>
            {/** 좋아요 버튼 */}
            <button className={styles.item} onClick={onLikeClick}>
                <Icon
                    name="IconMBoldHeart"
                    className={isLiked ? styles.iconActive.like : styles.icon}
                />
                <p className={styles.text}>좋아요 {likeCount}</p>
            </button>

            {/** 댓글 버튼 */}
            <button className={styles.item} onClick={onCommentClick}>
                <Icon name='IconMBoldMessageText' className={styles.icon} />
                <p className={styles.text}>댓글 {commentCount}</p>
            </button>

            {/** 스크랩 버튼 */}
            <button className={styles.item} onClick={onScrapClick}>
                <Icon
                    name='IconLBoldSave2'
                    className={isScraped ? styles.iconActive.scrap : styles.icon}
                />
                <p className={styles.text}>스크랩 {scrapCount}</p>
            </button>
        </div>
    );
}

const styles = {
    container: cn(
        'flex items-center justify-between gap-2',
        'px-6 py-3',
    ),
    item: cn(
        'flex items-center gap-1',
    ),
    icon: cn(
        'text-grey-5',
        'transition-colors',
        'transition-transform active:scale-95',
    ),
    iconActive: {
        like: cn('text-state-red transition-colors'),
        scrap: cn('text-state-yellow transition-colors'),
    },
    text: cn(
        'font-caption-caption1 text-grey-9',
    ),
}