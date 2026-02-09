'use client';

import Link from "next/link";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import Separator from "@/components/common/Separator";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useInfiniteEventPosts } from "@/hooks/posts/usePosts";
import { EMPTY_CONTENT_MESSAGES, ROUTES } from "@/constants";
import React from "react";

export default function EventList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
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

    const allEvents = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div>
            {allEvents.map((event) => (
                <React.Fragment key={event.id}>
                    <Link href={`${ROUTES.COMMUNITY.EVENT.DETAIL}/${event.id}`}>
                        <EventCard event={event} />
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