'use client';
import { cn } from "@/utils/cn";
import Tab from "@/components/common/Tab";
import { useRouter, useSearchParams } from "next/navigation";

/** 커뮤니티 탭 컴포넌트 
 * 
 * @returns {React.ReactNode} 커뮤니티 탭 컴포넌트
 * 게시판, 소모임, 커뮤니티 탭을 제공하며, 탭을 클릭하면 해당 탭으로 이동
 * @example
 * <CommunityTabs />
 */
export default function NoticeTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || '공지사항'; // URL에서 탭 정보 읽기

    const handleTabClick = (title: string) => {
        // URL을 변경함 (예: /community?tab=이벤트)
        router.replace(`?tab=${title}`, { scroll: false });
    };

    return (
        <div className={styles.container}>
            <Tab tabType='full' isActive={activeTab === '공지사항'} title='공지사항' onClick={() => handleTabClick('공지사항')} />
            <Tab tabType='full' isActive={activeTab === '이벤트'} title='이벤트' onClick={() => handleTabClick('이벤트')} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-row gap-2',
        'px-4 py-2',
    ),
};
