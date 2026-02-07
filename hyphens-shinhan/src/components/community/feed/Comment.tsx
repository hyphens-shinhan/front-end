'use client'

import { memo, useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { formatDateKrWithTime } from "@/utils/date";
import { Icon } from "@/components/common/Icon";
import MoreButton from "@/components/community/MoreButton";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import { CommentResponse } from "@/types/comments";
import { useUserStore } from "@/stores";
import { useFeedCommentMoreMenu } from "@/hooks/useFeedCommentMoreMenu";
import { useAutoResize } from "@/hooks/useAutoResize";

interface CommentProps {
    comment: CommentResponse;
    /** 게시글 ID (더보기 메뉴 수정/삭제용) */
    postId: string;
    /** 답글 달기 클릭 핸들러 */
    onReply?: (commentId: string, authorName: string) => void;
    /** 답글 대상 댓글 여부 (파란 배경 표시) */
    isReplyingTo?: boolean;
    /** 인라인 수정 모드 여부 */
    isEditing?: boolean;
    /** 더보기에서 수정 클릭 시 (수정 모드 진입) */
    onRequestEdit?: () => void;
    /** 수정 저장 시 (내용 전달) */
    onSaveEdit?: (content: string) => void;
    /** 수정 취소 시 */
    onCancelEdit?: () => void;
}

/** 커뮤니티 댓글 컴포넌트
 * @param {CommentProps} props - 댓글 데이터
 * @example
 * <Comment comment={commentData} postId={postId} />
 */
function Comment({
    comment,
    postId,
    onReply,
    isReplyingTo = false,
    isEditing = false,
    onRequestEdit,
    onSaveEdit,
    onCancelEdit,
}: CommentProps) {
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

    const currentUser = useUserStore((s) => s.user);
    const isMyComment = currentUser?.id === author?.id;

    const { openMenu } = useFeedCommentMoreMenu(postId, id, isMyComment, {
        onEditClick: onRequestEdit,
    });

    const [editValue, setEditValue] = useState(content);
    const { textareaRef, handleResize } = useAutoResize();
    useEffect(() => {
        if (isEditing) setEditValue(content);
    }, [isEditing, content]);
    useEffect(() => {
        if (isEditing) handleResize();
    }, [isEditing, editValue, handleResize]);

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
                <Avatar
                    src={is_anonymous ? null : author?.avatar_url}
                    alt={is_anonymous ? '익명' : (author?.name || '프로필')}
                    size={isReply ? 28 : 36}
                    containerClassName={cn(styles.userProfileWrapper, isReply && styles.replyProfileWrapper)}
                />
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
                    <time className={styles.time}>{formatDateKrWithTime(created_at)}</time>
                    {/** 더보기 버튼 */}
                    <div className={styles.moreButtonWrapper}>
                        <MoreButton type="comment" isAuthor={isMyComment} onOpenMenu={openMenu} />
                    </div>
                </div>

                {/** 댓글 본문 영역 (수정 모드일 때는 입력창 + 저장/취소) */}
                <div className={styles.contentWrapper}>
                    {isEditing ? (
                        <div className={styles.editWrapper}>
                            <textarea
                                ref={textareaRef}
                                className={styles.editTextarea}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onInput={handleResize}
                                rows={1}
                                autoFocus
                            />
                            <div className={styles.editActions}>
                                <Button
                                    label="취소"
                                    size="S"
                                    type="secondary"
                                    onClick={() => onCancelEdit?.()}
                                />
                                <Button
                                    label="저장"
                                    size="S"
                                    type="primary"
                                    onClick={() => {
                                        const trimmed = editValue.trim();
                                        if (trimmed) onSaveEdit?.(trimmed);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className={styles.contentText}>{content}</p>
                    )}
                </div>

                {/** 댓글 답글 영역 */}
                {!isReply && !isEditing && onReply && (
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

export default memo(Comment);

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
        'bg-grey-5 overflow-hidden',
    ),
    replyProfileWrapper: cn(
        'relative w-7 h-7 rounded-full', // 대댓글은 프로필 사진이 작음
        'bg-grey-5 overflow-hidden',
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
    editWrapper: cn(
        'flex flex-col gap-2',
    ),
    editTextarea: cn(
        'w-full px-3 py-2 rounded-lg border border-grey-5',
        'body-8 text-grey-11 placeholder:text-grey-6',
        'focus:outline-none focus:border-primary-secondaryroyal',
    ),
    editActions: cn(
        'flex flex-row gap-2 justify-end',
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