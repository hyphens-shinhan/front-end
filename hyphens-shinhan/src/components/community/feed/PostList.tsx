'use client'

import { cn } from "@/utils/cn";

import PostCardSkeleton from "@/components/community/feed/PostCardSkeleton";
import ShinhanNoticeCard from "@/components/community/ShinhanNoticeCard";
import Separator from "@/components/common/Separator";
import PostFAB from "@/components/common/PostFAB";
import { POST_FAB_ITEM_KEY } from "@/constants";
import { useInfiniteFeedPosts } from "@/hooks/posts/usePosts";
import React from "react";
import PostCard from "@/components/community/feed/PostCard";

/** 커뮤니티 게시판 리스트 컴포넌트
 * @returns {React.ReactNode} 커뮤니티 게시판 리스트 컴포넌트
 * @example
 * <PostList />
 */
export default function PostList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteFeedPosts();

    if (isLoading) {
        return (
            <div className={styles.container}>
                {/** 신한 공지사항 카드 */}
                <div className={styles.noticeCardWrapper}>
                    <ShinhanNoticeCard />
                </div>
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
    if (isError) return <div className="p-4 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;

    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div className={styles.container}>
            {/** 신한 공지사항 카드 */}
            <div className={styles.noticeCardWrapper}>
                <ShinhanNoticeCard />
            </div>
            {/** 게시글 카드 리스트 */}
            <div className={styles.postCardWrapper}>
                {allPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                        <PostCard post={post} />
                        <Separator className="mx-4" />
                    </React.Fragment>
                ))}
            </div>

            {/** 무한 스크롤 트리거 (임시) */}
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

const styles = {
    container: cn(
        'flex-1 flex flex-col',
    ),
    noticeCardWrapper: cn(
        'flex-1 m-4 mb-3',
    ),
    postCardSeparator: cn(
        'h-[1px] bg-grey-3 mx-4',
    ),
    postCardWrapper: cn(
        'flex flex-col',
    ),
};