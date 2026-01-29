import EventList from "@/components/community/shinhan-notice/EventList";
import NoticeList from "@/components/community/shinhan-notice/NoticeList";
import NoticeTabs from "@/components/community/shinhan-notice/NoticeTabs";
import { cn } from "@/utils/cn";

export default async function ShinhanNoticePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = await searchParams;
    const currentTab = tab || '공지사항';
    return (
        <div className={styles.container}>
            <NoticeTabs />
            <div className={styles.contentContainer}>
                {currentTab === '공지사항' && <NoticeList />}
                {currentTab === '이벤트' && <EventList />}
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
