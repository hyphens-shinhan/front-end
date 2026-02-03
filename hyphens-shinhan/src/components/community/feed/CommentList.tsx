'use client'

import React, { useCallback, memo } from "react";
import { cn } from "@/utils/cn";
import { useComments } from "@/hooks/comments/useComments";
import { useToggleLike, useToggleScrap } from "@/hooks/posts/usePostMutations";
import Comment from "@/components/community/feed/Comment";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import Separator from "@/components/common/Separator";
import PostInteraction from "@/components/community/feed/PostInteraction";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import { FeedPostResponse } from "@/types/posts";

interface CommentListProps {
    postId: string;
    post: FeedPostResponse;
    /** 답글 달기 클릭 핸들러 */
    onReply?: (commentId: string, authorName: string) => void;
    /** 답글 대상 댓글 ID (해당 댓글에 파란 배경 표시) */
    replyToCommentId?: string | null;
}

/** 댓글 리스트 컴포넌트 (게시글 상호작용 포함)
 * @param {CommentListProps} props - postId, post 정보 필요
 * @example
 * <CommentList postId={post.id} post={post} />
 */
function CommentList({ postId, post, onReply, replyToCommentId }: CommentListProps) {
    const { data, isLoading, isError, refetch } = useComments(postId);
    const { mutate: toggleLike } = useToggleLike();
    const { mutate: toggleScrap } = useToggleScrap();

    const comments = data?.comments || [];

    const handleLikeClick = useCallback(() => {
        toggleLike(postId);
    }, [postId, toggleLike]);

    const handleScrapClick = useCallback(() => {
        toggleScrap(postId);
    }, [postId, toggleScrap]);

    return (
        <div className={styles.container}>
            {/** 게시글 상호작용 (좋아요, 댓글, 스크랩) */}
            <PostInteraction
                likeCount={post.like_count}
                commentCount={post.comment_count}
                scrapCount={post.scrap_count}
                isLiked={post.is_liked}
                isScraped={post.is_scrapped}
                onLikeClick={handleLikeClick}
                onScrapClick={handleScrapClick}
            />

            <Separator className="mx-4" />

            {/** 댓글 리스트 */}
            {isLoading ? (
                <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.COMMENT} className="py-8" />
            ) : isError ? (
                <EmptyContent
                    variant="error"
                    message={EMPTY_CONTENT_MESSAGES.ERROR.COMMENT}
                    className="py-8"
                    action={
                        <Button
                            label="다시 시도"
                            size="M"
                            type="primary"
                            onClick={() => refetch()}
                        />
                    }
                />
            ) : comments.length === 0 ? (
                <EmptyContent variant="empty" message={EMPTY_CONTENT_MESSAGES.EMPTY.COMMENT} className="py-8" />
            ) : (
                <div className={styles.commentWrapper}>
                    {comments.map((comment) => (
                        <React.Fragment key={comment.id}>
                            {/** 댓글 */}
                            <Comment
                                comment={comment}
                                onReply={onReply}
                                isReplyingTo={replyToCommentId === comment.id}
                            />

                            {/** 대댓글 */}
                            {comment.replies?.map((reply) => (
                                <Comment key={reply.id} comment={reply} />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col',
    ),
    headerWrapper: cn(
        'px-4 py-3',
    ),
    headerText: cn(
        'title-16',
        'text-grey-11',
    ),
    commentWrapper: cn(
        'flex flex-col py-1',
    ),
    replyWrapper: cn(
        'flex flex-row items-center',
    ),
};

export default memo(CommentList);