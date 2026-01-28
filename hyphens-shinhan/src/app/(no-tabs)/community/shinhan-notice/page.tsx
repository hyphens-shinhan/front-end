import EventList from "@/components/community/shinhan-notice/EventList";
import NoticeList from "@/components/community/shinhan-notice/NoticeList";
import NoticeTabs from "@/components/community/shinhan-notice/NoticeTabs";

export default async function ShinhanNoticePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = await searchParams;
    const currentTab = tab || '공지사항';
    return (
        <div>
            <NoticeTabs />
            {currentTab === '공지사항' && <NoticeList />}
            {currentTab === '이벤트' && <EventList />}
        </div>
    );
}
