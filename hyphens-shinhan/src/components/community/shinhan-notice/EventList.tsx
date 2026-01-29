'use client';

import Separator from "@/components/common/Separator";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useInfiniteEventPosts } from "@/hooks/posts/usePosts";
import React from "react";

export default function EventList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteEventPosts();

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <React.Fragment key={index}>
                        <EventCardSkeleton />
                        <Separator />
                    </React.Fragment>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div className="p-4 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
    }

    const allEvents = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div>
            {allEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                    <EventCard event={event} />
                    <Separator />
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