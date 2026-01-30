'use client'

import React from "react";
import { cn } from "@/utils/cn";
import { useComments } from "@/hooks/comments/useComments";
import { useToggleLike, useToggleScrap } from "@/hooks/posts/usePostMutations";
import Comment from "@/components/community/feed/Comment";
import Separator from "@/components/common/Separator";
import PostInteraction from "@/components/community/feed/PostInteraction";
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
export default function CommentList({ postId, post, onReply, replyToCommentId }: CommentListProps) {
    const { data, isLoading, isError } = useComments(postId);
    const { mutate: toggleLike } = useToggleLike();
    const { mutate: toggleScrap } = useToggleScrap();

    const comments = data?.comments || [];

    const handleLikeClick = () => {
        toggleLike(postId);
    };

    const handleScrapClick = () => {
        toggleScrap(postId);
    };

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

            <Separator />

            {/** 댓글 리스트 */}
            {isLoading ? (
                <div className={styles.loadingWrapper}>
                    <p className={styles.loadingText}>댓글을 불러오는 중...</p>
                </div>
            ) : isError ? (
                <p className={styles.errorText}>댓글을 불러오는 중 오류가 발생했습니다.</p>
            ) : comments.length === 0 ? (
                <p className={styles.emptyText}>아직 댓글이 없습니다.</p>
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
    loadingWrapper: cn(
        'flex items-center justify-center',
        'py-8',
    ),
    loadingText: cn(
        'font-caption-caption3',
        'text-grey-7',
    ),
    errorText: cn(
        'p-4 text-center',
        'font-caption-caption3',
        'text-state-red',
    ),
    emptyText: cn(
        'p-8 text-center',
        'font-caption-caption3',
        'text-grey-7',
    ),
    replyWrapper: cn(
        'flex flex-row items-center',
    ),
};