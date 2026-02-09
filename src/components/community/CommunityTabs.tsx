'use client';
import { cn } from "@/utils/cn";
import Tab from "../common/Tab";
import { useRouter, useSearchParams } from "next/navigation";

/** 커뮤니티 탭 컴포넌트 
 * 
 * @returns {React.ReactNode} 커뮤니티 탭 컴포넌트
 * 게시판, 소모임, 커뮤니티 탭을 제공하며, 탭을 클릭하면 해당 탭으로 이동
 * @example
 * <CommunityTabs />
 */
export default function CommunityTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || '게시판'; // URL에서 탭 정보 읽기

    const handleTabClick = (title: string) => {
        // URL을 변경함 (예: /community?tab=소모임)
        router.replace(`?tab=${title}`, { scroll: false });
    };

    return (
        <div className={styles.container}>
            <Tab isActive={activeTab === '게시판'} title='게시판' onClick={() => handleTabClick('게시판')} />
            <Tab isActive={activeTab === '소모임'} title='소모임' onClick={() => handleTabClick('소모임')} />
            <Tab isActive={activeTab === '자치회'} title='자치회' onClick={() => handleTabClick('자치회')} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-row gap-[6px]',
        'px-4 py-2',
    ),
};
