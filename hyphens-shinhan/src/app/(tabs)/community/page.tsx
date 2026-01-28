import CommunityTabs from "@/components/community/CommunityTabs";
import GroupList from "@/components/community/GroupList";
import PostList from "@/components/community/PostList";
import { cn } from "@/utils/cn";

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = await searchParams;
    const currentTab = tab || '게시판';

    return (
        <div className={styles.container}>
            <CommunityTabs />
            <div>
                {currentTab === '게시판' && <PostList />}
                {currentTab === '소모임' && <GroupList />}
                {currentTab === '자치회' && <div>자치회</div>}
            </div>
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col',
    ),
};
