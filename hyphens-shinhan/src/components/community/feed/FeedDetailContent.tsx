'use client'

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFeedPost, useCouncilReport } from "@/hooks/posts/usePosts";
import { useCreateComment } from "@/hooks/comments/useCommentMutations";
import CommentList from "@/components/community/feed/CommentList";
import PostContent from "@/components/community/feed/PostContent";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import Avatar from "@/components/common/Avatar";
import { cn } from "@/utils/cn";
import { formatDateKrWithTime } from "@/utils/date";
import FollowButton from "../FollowButton";
import MessageInput from "@/components/common/MessageInput";
import { EMPTY_CONTENT_MESSAGES, INPUT_BAR_TYPE, ROUTES } from "@/constants";
import { FeedPostResponse, PostType, PublicReportResponse } from "@/types/posts";

interface FeedDetailContentProps {
    postId: string;
    /** 게시글 타입 ('feed' | 'council') */
    postType?: 'feed' | 'council';
}

/** 피드 상세 페이지 클라이언트 컴포넌트 (피드 + 자치회 리포트 공통)
 * @param {FeedDetailContentProps} props - postId 필요, postType은 선택 (기본값: 'feed')
 * @example
 * <FeedDetailContent postId="abc-123" />
 * <FeedDetailContent postId="abc-123" postType="council" />
 */
export default function FeedDetailContent({ postId, postType = 'feed' }: FeedDetailContentProps) {
    const router = useRouter();
    const { data: feedPost, isLoading: isLoadingFeed, isError: isErrorFeed } = useFeedPost(postId, { enabled: postType === 'feed' });
    const { data: councilReport, isLoading: isLoadingCouncil, isError: isErrorCouncil } = useCouncilReport(postId, { enabled: postType === 'council' });
    const { mutate: createComment, isPending: isSubmitting } = useCreateComment();

    // 타입에 따라 적절한 데이터와 로딩/에러 상태 사용
    const isLoading = postType === 'council' ? isLoadingCouncil : isLoadingFeed;
    const isError = postType === 'council' ? isErrorCouncil : isErrorFeed;

    // 자치회 리포트인 경우 FeedPostResponse로 변환
    let post: FeedPostResponse | null = null;
    if (postType === 'council' && councilReport) {
        const content = councilReport.content || councilReport.title || '';
        post = {
            id: councilReport.id,
            created_at: councilReport.submitted_at,
            like_count: councilReport.like_count ?? 0,
            is_liked: councilReport.is_liked ?? false,
            image_urls: councilReport.image_urls || [],
            type: PostType.FEED,
            content: content,
            is_anonymous: false,
            scrap_count: councilReport.scrap_count ?? 0,
            comment_count: councilReport.comment_count ?? 0,
            is_scrapped: councilReport.is_scrapped ?? false,
            author: councilReport.author || null,
        };
    } else if (feedPost) {
        post = feedPost;
    }

    // 댓글 입력 상태
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    // 답글 대상 상태
    const [replyTo, setReplyTo] = useState<{ commentId: string; authorName: string } | null>(null);
    // 댓글 입력창 ref (답글 달기 클릭 시 포커스용)
    const commentInputRef = useRef<HTMLInputElement>(null);
    // 전송 중복 방지 (isSubmitting 상태보다 먼저 체크)
    const sendingRef = useRef(false);

    // 답글 달기 클릭 핸들러 (참조 고정 → CommentList/Comment 불필요 리렌더 방지)
    const handleReply = useCallback((commentId: string, authorName: string) => {
        const input = commentInputRef.current;
        if (input) {
            input.focus({ preventScroll: false });
        }
        setReplyTo({ commentId, authorName });
    }, []);

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
        return <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />;
    }

    if (isError || !post) {
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.FEED}
                action={
                    <Button
                        label="목록으로 돌아가기"
                        size="M"
                        type="primary"
                        onClick={() => router.back()}
                    />
                }
            />
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
                    <Avatar
                        src={is_anonymous ? null : author?.avatar_url}
                        alt={is_anonymous ? '익명' : (author?.name || '프로필')}
                        fill
                        containerClassName={styles.userProfileWrapper}
                    />
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