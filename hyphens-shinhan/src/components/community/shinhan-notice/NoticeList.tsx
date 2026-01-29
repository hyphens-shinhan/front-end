'use client';

import Separator from "@/components/common/Separator";
import NoticeCard from "./NoticeCard";
import NoticeCardSkeleton from "./NoticeCardSkeleton";
import { useInfiniteNoticePosts } from "@/hooks/posts/usePosts";
import React from "react";

export default function NoticeList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteNoticePosts();

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <NoticeCardSkeleton />
                        {index < 2 && <Separator />}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div className="p-4 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const allNotices = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div>
            {allNotices.map((notice, index) => (
                <React.Fragment key={notice.id}>
                    <NoticeCard notice={notice} />
                    {index < allNotices.length - 1 && <Separator />}
                </React.Fragment>
            ))}

            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full p-4 text-grey-9 font-caption-caption3"
                >
                    {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                </button>
            )}
        </div>
    );
}