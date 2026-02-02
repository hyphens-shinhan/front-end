'use client';

import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import Separator from "@/components/common/Separator";
import NoticeCard from "./NoticeCard";
import NoticeCardSkeleton from "./NoticeCardSkeleton";
import { useInfiniteNoticePosts } from "@/hooks/posts/usePosts";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import Link from "next/link";
import React from "react";

export default function NoticeList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteNoticePosts();

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <NoticeCardSkeleton />
                        <Separator />
                    </React.Fragment>
                ))}
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

    const allNotices = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div>
            {allNotices.map((notice) => (
                <React.Fragment key={notice.id}>
                    <Link href={`${ROUTES.COMMUNITY.NOTICE.DETAIL}/${notice.id}`}>
                        <NoticeCard notice={notice} />
                    </Link>
                    <Separator className="mx-4" />
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