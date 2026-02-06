'use client'

import { cn } from "@/utils/cn";
import PostCardSkeleton from "@/components/community/feed/PostCardSkeleton";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import Separator from "@/components/common/Separator";
import PostFAB from "@/components/common/PostFAB";
import { EMPTY_CONTENT_MESSAGES, POST_FAB_ITEM_KEY } from "@/constants";
import { useInfinitePublicReportsFeed } from "@/hooks/posts/usePosts";
import React from "react";
import PostCard from "@/components/community/feed/PostCard";
import { FeedPostResponse, PostType, PublicReportResponse } from "@/types/posts";

/** 자치회 리포트 리스트 컴포넌트
 * @returns {React.ReactNode} 자치회 리포트 리스트 컴포넌트
 * @example
 * <CouncilReportList />
 */
export default function CouncilReportList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfinitePublicReportsFeed();

    if (isLoading) {
        return (
            <div className={styles.container}>
                {/** 게시글 카드 리스트 */}
                <div className={styles.postCardWrapper}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <React.Fragment key={index}>
                            <PostCardSkeleton />
                            <Separator className="mx-4" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
    if (isError) {
        return (
            <EmptyContent
                variant="error"
                message={EMPTY_CONTENT_MESSAGES.ERROR.LIST}
                action={
                    <Button
                        label="다시 시도"
                        size="M"
                        type="primary"
                        onClick={() => refetch()}
                    />
                }
            />
        );
    }

    const allReports = data?.pages.flat() || [];

    if (allReports.length === 0) {
        return (
            <EmptyContent
                variant="empty"
                message="자치회 리포트가 없어요."
            />
        );
    }

    return (
        <div className={styles.container}>
            {/** 게시글 카드 리스트 */}
            <div className={styles.postCardWrapper}>
                {allReports.map((report, index) => (
                    <React.Fragment key={report.id}>
                        <CouncilReportItem report={report} />
                        <Separator className="mx-4" />
                    </React.Fragment>
                ))}
            </div>

            {/** 무한 스크롤 트리거 */}
            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="p-4 text-grey-9 font-caption-caption3"
                >
                    {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                </button>
            )}

            <PostFAB type={POST_FAB_ITEM_KEY.WRITE} />
        </div>
    );
}

/** PublicReportResponse를 FeedPostResponse로 변환하여 PostCard에 표시 */
function CouncilReportItem({ report }: { report: PublicReportResponse }) {
    // PublicReportResponse를 FeedPostResponse로 변환
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
        author: null, // 자치회 리포트는 작성자 정보가 없음
    };

    return <PostCard post={feedPost} />;
}

const styles = {
    container: cn(
        'flex-1 flex flex-col',
    ),
    postCardWrapper: cn(
        'flex flex-col',
    ),
};
