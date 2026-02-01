'use client'

import { useRef, useState } from "react";
import Image from "next/image";
import { useFeedPost } from "@/hooks/posts/usePosts";
import { useCreateComment } from "@/hooks/comments/useCommentMutations";
import CommentList from "@/components/community/feed/CommentList";
import PostContent from "@/components/community/feed/PostContent";
import { cn } from "@/utils/cn";
import { formatDateKrWithTime } from "@/utils/date";
import FollowButton from "../FollowButton";
import MessageInput from "@/components/common/MessageInput";
import { INPUT_BAR_TYPE } from "@/constants";

interface FeedDetailContentProps {
    postId: string;
}

/** 피드 상세 페이지 클라이언트 컴포넌트
 * @param {FeedDetailContentProps} props - postId 필요
 * @example
 * <FeedDetailContent postId="abc-123" />
 */
export default function FeedDetailContent({ postId }: FeedDetailContentProps) {
    const { data: post, isLoading, isError } = useFeedPost(postId);
    const { mutate: createComment, isPending: isSubmitting } = useCreateComment();

    // 댓글 입력 상태
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    // 답글 대상 상태
    const [replyTo, setReplyTo] = useState<{ commentId: string; authorName: string } | null>(null);
    // 댓글 입력창 ref (답글 달기 클릭 시 포커스용)
    const commentInputRef = useRef<HTMLInputElement>(null);
    // 전송 중복 방지 (isSubmitting 상태보다 먼저 체크)
    const sendingRef = useRef(false);

    // 답글 달기 클릭 핸들러
    const handleReply = (commentId: string, authorName: string) => {
        // PWA/모바일: 사용자 제스처와 같은 호출 스택에서 먼저 focus() 호출해야 키보드가 뜸
        const input = commentInputRef.current;
        if (input) {
            input.focus({ preventScroll: false });
        }
        setReplyTo({ commentId, authorName });
    };

    // 댓글 전송 핸들러 (연타/엔터+클릭 중복 요청 방지)
    const handleSendComment = () => {
        if (!comment.trim() || isSubmitting || sendingRef.current) return;
        sendingRef.current = true;

        const payload = {
            postId,
            data: {
                content: comment.trim(),
                is_anonymous: isAnonymous,
                parent_id: replyTo?.commentId ?? undefined,
            },
        };

        createComment(payload, {
            onSuccess: () => {
                setComment('');
                setIsAnonymous(false);
                setReplyTo(null);
                sendingRef.current = false;
            },
            onError: (error) => {
                console.error('댓글 작성 실패:', error);
                alert('댓글 작성에 실패했습니다.');
                sendingRef.current = false;
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-grey-7">로딩 중...</p>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-state-red">게시글을 불러오는 중 오류가 발생했습니다.</p>
            </div>
        );
    }

    const { author, created_at, is_anonymous } = post;

    // 다른 영역 클릭 시 답글 선택 해제
    const handleScrollAreaClick = () => {
        if (replyTo) setReplyTo(null);
    };

    return (
        <div className={styles.container}>
            {/** 스크롤 가능한 콘텐츠 영역 */}
            <div className={styles.scrollArea} onClick={handleScrollAreaClick}>
                {/** 유저 정보, 시간, 팔로우 버튼 */}
                <div className={styles.userInfoWrapper}>
                    <div className={styles.userProfileWrapper}>
                        {/* {!is_anonymous && author?.avatar_url && (
                            <Image
                                src={author.avatar_url}
                                alt={author.name || '프로필'}
                                fill
                                sizes="40px"
                                className="rounded-full object-cover"
                            />
                        )} */}
                    </div>
                    <div className={styles.userNameWrapper}>
                        <p className={styles.userName}>
                            {is_anonymous ? '익명' : (author?.name || '알 수 없음')}
                        </p>
                        <time className={styles.time}>{formatDateKrWithTime(created_at)}</time>
                    </div>
                    {/** 익명이 아니고, 팔로우하지 않은 경우에만 팔로우 버튼 표시 */}
                    {!is_anonymous && author && !author.is_following && (
                        <div className={styles.followButtonWrapper}>
                            <FollowButton type="button" />
                        </div>
                    )}
                </div>
                {/** 게시물 영역 */}
                <PostContent
                    content={post.content}
                    imageUrls={post.image_urls}
                    className="p-4"
                />
                {/** 댓글 영역 */}
                <div className={styles.commentListWrapper}>
                    <CommentList
                        postId={postId}
                        post={post}
                        onReply={handleReply}
                        replyToCommentId={replyTo?.commentId ?? null}
                    />
                </div>
            </div>
            {/** 댓글 작성 영역 (하단 고정) */}
            <div className={styles.inputWrapper}>
                <MessageInput
                    type={INPUT_BAR_TYPE.COMMENT}
                    inputRef={commentInputRef}
                    value={comment}
                    onChange={setComment}
                    onSend={handleSendComment}
                    isSubmitting={isSubmitting}
                    isAnonymous={isAnonymous}
                    onAnonymousToggle={() => setIsAnonymous(!isAnonymous)}
                />
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col h-full',
    ),
    scrollArea: cn(
        'flex-1 flex flex-col',
        'overflow-x-hidden overflow-y-auto scrollbar-hide',
    ),
    userInfoWrapper: cn(
        'flex flex-row items-center gap-3.5',
        'px-4 pt-2.5',
    ),
    userProfileWrapper: cn(
        'relative w-10 h-10',
        'rounded-full overflow-hidden',
        'bg-grey-5',
    ),
    userNameWrapper: cn(
        'flex flex-col gap-1',
    ),
    userName: cn(
        'title-16',
        'text-grey-11',
    ),
    time: cn(
        'font-caption-caption4',
        'text-gray-8',
    ),
    followButtonWrapper: cn(
        'ml-auto',
    ),
    commentListWrapper: cn(
        'flex-1',
    ),
    inputWrapper: cn(
        'flex flex-col fixed bottom-0 left-0 right-0',
        'bg-white',
    ),
}