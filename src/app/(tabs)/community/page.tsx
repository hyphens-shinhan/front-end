'use client';

import CommunityTabs from "@/components/community/CommunityTabs";
import GroupList from "@/components/community/group/GroupList";
import PostList from "@/components/community/feed/PostList";
import CouncilReportList from "@/components/community/council/CouncilReportList";
import { cn } from "@/utils/cn";
import { use } from "react";

export default function CommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = use(searchParams);
    const currentTab = tab || '게시판';

    return (
        <div className={styles.container}>
            <CommunityTabs />
            <div className={styles.contentContainer}>
                {currentTab === '게시판' && <PostList />}
                {currentTab === '소모임' && <GroupList />}
                {currentTab === '자치회' && <CouncilReportList />}
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col h-full',
    ),
    contentContainer: cn(
        'flex-1 pb-8 overflow-y-auto scrollbar-hide',
    ),
};
