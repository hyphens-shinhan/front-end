'use client'

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCouncilReport } from "@/hooks/posts/usePosts";
import { useCreateComment } from "@/hooks/comments/useCommentMutations";
import CommentList from "@/components/community/feed/CommentList";
import PostContent from "@/components/community/feed/PostContent";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import { cn } from "@/utils/cn";
import { formatDateKrWithTime } from "@/utils/date";
import MessageInput from "@/components/common/MessageInput";
import { EMPTY_CONTENT_MESSAGES, INPUT_BAR_TYPE, ROUTES } from "@/constants";
import { FeedPostResponse, PostType } from "@/types/posts";

interface CouncilReportDetailContentProps {
    postId: string;
}

/** 자치회 리포트 상세 페이지 클라이언트 컴포넌트
 * @param {CouncilReportDetailContentProps} props - postId 필요
 * @example
 * <CouncilReportDetailContent postId="abc-123" />
 */
export default function CouncilReportDetailContent({ postId }: CouncilReportDetailContentProps) {
    const router = useRouter();
    const { data: report, isLoading, isError } = useCouncilReport(postId);
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
    const handleReply = useCallback((commentId: string, authorName: string) => {
        const input = commentInputRef.current;
        if (input) {
            input.focus({ preventScroll: false });
        }
        setReplyTo({ commentId, authorName });
    }, []);

    // 댓글 전송 핸들러
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

    if (isError || !report) {
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.FEED}
                action={
                    <Button
                        label="목록으로 돌아가기"
                        size="M"
                        type="primary"
                        onClick={() => router.push(ROUTES.COMMUNITY.MAIN)}
                    />
                }
            />
        );
    }

    // PublicReportResponse를 FeedPostResponse로 변환 (댓글용)
    const content = report.content || report.title || '';
    const feedPost: FeedPostResponse = {
        id: report.id,
        created_at: report.submitted_at,
        like_count: 0,
        is_liked: false,
        image_urls: report.image_urls || [],
        type: PostType.FEED,
        content: content,
        is_anonymous: false,
        scrap_count: 0,
        comment_count: 0,
        is_scrapped: false,
        author: report.author || null, // API에서 받은 작성자 정보 사용
    };

    // 다른 영역 클릭 시 답글 선택 해제
    const handleScrollAreaClick = () => {
        if (replyTo) setReplyTo(null);
    };

    return (
        <div className={styles.container}>
            {/** 스크롤 가능한 콘텐츠 영역 */}
            <div className={styles.scrollArea} onClick={handleScrollAreaClick}>
                {/** 제목 및 시간 */}
                <div className={styles.headerWrapper}>
                    <h1 className={styles.title}>{report.title}</h1>
                    <time className={styles.time}>{formatDateKrWithTime(report.submitted_at)}</time>
                    {report.location && (
                        <p className={styles.location}>{report.location}</p>
                    )}
                </div>
                {/** 게시물 영역 */}
                <PostContent
                    content={content}
                    imageUrls={report.image_urls}
                    className="p-4"
                />
                {/** 댓글 영역 */}
                <div className={styles.commentListWrapper}>
                    <CommentList
                        postId={postId}
                        post={feedPost}
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
    headerWrapper: cn(
        'flex flex-col gap-2',
        'px-4 pt-2.5 pb-4',
    ),
    title: cn(
        'title-20',
        'text-grey-11',
    ),
    time: cn(
        'font-caption-caption4',
        'text-grey-8',
    ),
    location: cn(
        'body-6',
        'text-grey-9',
    ),
    commentListWrapper: cn(
        'flex-1',
    ),
    inputWrapper: cn(
        'flex flex-col fixed bottom-0 left-0 right-0',
        'bg-white',
    ),
}
