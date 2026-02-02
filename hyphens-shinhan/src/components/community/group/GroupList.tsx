'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/common/Button";
import EmptyContent from "@/components/common/EmptyContent";
import PillTabs from "@/components/common/PillTabs";
import Separator from "@/components/common/Separator";
import GroupCard from "./GroupCard";
import { EMPTY_CONTENT_MESSAGES, POST_FAB_ITEM_KEY, ROUTES } from "@/constants";
import PostFAB from "@/components/common/PostFAB";
import { useInfiniteClubs } from "@/hooks/clubs/useClubs";
import type { ClubCategory } from "@/types/clubs";

const GROUP_TABS = ['전체', '내가 참여 중인', '스터디', '봉사', '취미'];

/** TODO: 카테고리 목록 추가 */
const TAB_TO_CATEGORY: (ClubCategory | null)[] = [
    null,       // 전체
    null,       // 내가 참여 중인 (필터만)
    'STUDY',    // 스터디
    'VOLUNTEER', // 봉사
    'GLOBAL',   // 취미
];

export default function GroupList() {
    const [activeIndex, setActiveIndex] = useState(0);
    const category = TAB_TO_CATEGORY[activeIndex] ?? undefined;

    const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteClubs(
            category ? { category } : undefined,
            20,
        );

    const clubs = useMemo(() => {
        const pages = data?.pages ?? [];
        const list = pages.flatMap((p) => p.clubs);
        return activeIndex === 1 ? list.filter((c) => c.is_member) : list;
    }, [data?.pages, activeIndex]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <PillTabs tabs={GROUP_TABS} activeIndex={activeIndex} onChange={setActiveIndex} />
                <EmptyContent
                    variant="loading"
                    message={EMPTY_CONTENT_MESSAGES.LOADING.GROUP}
                />
                <PostFAB type={POST_FAB_ITEM_KEY.ADD} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.container}>
                <PillTabs tabs={GROUP_TABS} activeIndex={activeIndex} onChange={setActiveIndex} />
                <EmptyContent
                    variant="error"
                    message={EMPTY_CONTENT_MESSAGES.ERROR.GROUP}
                    subMessage={error?.message}
                    action={
                        <Button
                            label="다시 시도"
                            size="M"
                            type="primary"
                            onClick={() => refetch()}
                        />
                    }
                />
                <PostFAB type={POST_FAB_ITEM_KEY.ADD} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <PillTabs tabs={GROUP_TABS} activeIndex={activeIndex} onChange={setActiveIndex} />

            {clubs.length === 0 ? (
                <EmptyContent
                    variant="empty"
                    message={
                        activeIndex === 1
                            ? EMPTY_CONTENT_MESSAGES.EMPTY.MY_GROUP
                            : EMPTY_CONTENT_MESSAGES.EMPTY.GROUP
                    }
                />
            ) : (
                clubs.map((club, index) => (
                    <div key={club.id}>
                        <Link href={`${ROUTES.COMMUNITY.GROUP.DETAIL}/${club.id}`}>
                            <GroupCard club={club} />
                        </Link>
                        {index < clubs.length - 1 && <Separator className="mx-4" />}
                    </div>
                ))
            )}

            {hasNextPage && (
                <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className={cn(
                        'w-full py-3 body-8 text-grey-8',
                        isFetchingNextPage && 'opacity-60',
                    )}
                >
                    {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                </button>
            )}

            <PostFAB type={POST_FAB_ITEM_KEY.ADD} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-col'),
};
