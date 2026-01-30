import { cn } from "@/utils/cn";
import { Icon } from "@/components/common/Icon";
import MoreButton from "@/components/community/MoreButton";
import { CommentResponse } from "@/types/comments";

interface CommentProps {
    comment: CommentResponse;
    /** 답글 달기 클릭 핸들러 */
    onReply?: (commentId: string, authorName: string) => void;
    /** 답글 대상 댓글 여부 (파란 배경 표시) */
    isReplyingTo?: boolean;
}

/** 커뮤니티 댓글 컴포넌트
 * @param {CommentProps} props - 댓글 데이터
 * @example
 * <Comment comment={commentData} />
 */
export default function Comment({ comment, onReply, isReplyingTo = false }: CommentProps) {
    const {
        id,
        author,
        content,
        created_at,
        is_anonymous,
        is_deleted,
        parent_id,
    } = comment;

    // 대댓글 여부 (parent_id가 있으면 대댓글)
    const isReply = !!parent_id;

    // 날짜 포맷팅 (예: 12월 14일 12:20)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // TODO: 삭제된 댓글 처리

    return (
        <div
            className={cn(
                styles.container,
                isReply && styles.replyContainer,
                isReplyingTo && styles.replyingToContainer,
            )}
        >
            <div className={styles.commentHeader}>
                {/** 대댓글일 때만 화살표 아이콘 */}
                {isReply && (
                    <Icon name="IconLLineArrowSend2" className={styles.replyIcon} />
                )}
                {/** 유저 프로필 사진 */}
                <div className={cn(styles.userProfileWrapper, isReply && styles.replyProfileWrapper)} />
            </div>

            {/** 유저 정보, 본문 영역 */}
            <div className={styles.commentContent}>
                {/** 유저 이름, 시간, 더보기 버튼 */}
                <div className={styles.infoWrapper}>
                    {/** 유저 이름 */}
                    <p className={styles.userName}>
                        {is_anonymous ? '익명' : (author?.name || '알 수 없음')}
                    </p>
                    {/** 시간 */}
                    <time className={styles.time}>{formatDate(created_at)}</time>
                    {/** 더보기 버튼 */}
                    <div className={styles.moreButtonWrapper}>
                        <MoreButton />
                    </div>
                </div>

                {/** 댓글 본문 영역 */}
                <div className={styles.contentWrapper}>
                    <p className={styles.contentText}>{content}</p>
                </div>

                {/** 댓글 답글 영역 */}
                {!isReply && onReply && (
                    <button
                        type="button"
                        className={styles.replyButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onReply(id, is_anonymous ? '익명' : (author?.name || '알 수 없음'));

                        }}
                    >
                        <p className={styles.replyText}>답글 달기</p>
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'w-full flex flex-row',
        'bg-white gap-3',
        'px-4 pt-4 pb-2',
    ),
    commentHeader: cn(
        'flex flex-row gap-2',
    ),
    replyingToContainer: cn(
        'bg-primary-shinhanblue/10',
    ),
    replyContainer: cn(
        'pl-4 py-2', // 대댓글 들여쓰기 (아이콘 공간 포함)
    ),
    replyIcon: cn(
        'text-grey-6',
    ),
    commentContent: cn(
        'flex-1 flex-col',
    ),
    userProfileWrapper: cn(
        'relative w-9 h-9 rounded-full',
        'bg-grey-5',
    ),
    replyProfileWrapper: cn(
        'w-7 h-7', // 대댓글은 프로필 사진이 작음
    ),
    infoWrapper: cn(
        'flex flex-row items-center gap-2',
    ),
    moreButtonWrapper: cn(
        'flex flex-row gap-4 ml-auto',
    ),
    userName: cn(
        'title-14',
        'text-grey-11',
    ),
    time: cn(
        'font-caption-caption4 text-gray-8',
    ),
    contentWrapper: cn(
        'flex flex-col mt-1',
    ),
    contentText: cn(
        'pr-7',
        'body-8',
        'text-grey-11',
    ),
    deletedText: cn(
        'body-8',
        'text-grey-7',
        'py-2',
    ),
    replyButton: cn(
        'flex flex-col mt-1',
    ),
    replyText: cn(
        'font-caption-caption4',
        'text-grey-8',
    ),
}