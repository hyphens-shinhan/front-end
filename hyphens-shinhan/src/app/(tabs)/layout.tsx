import BottomNav from "@/components/common/BottomNav";
import Header from "@/components/common/Header";
import { cn } from "@/utils/cn";

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.container}>
            {/* 상단 고정 헤더 */}
            <Header />

            {/* 메인 컨텐츠 영역 */}
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
            {/* 하단 고정 네비게이션 */}
            <BottomNav userRole="YB" />
        </div>
    );
}

const styles = {
    // 전체 컨테이너: 전체 화면 높이, 스크롤 방지
    container: cn(
        'relative mx-auto max-w-md',
        'h-[100dvh] overflow-hidden flex flex-col',
        'bg-white'
    ),
    // 메인 영역: 헤더와 바텀 네비 사이에서 독립 스크롤
    main: cn(
        'flex-1',
        'overflow-hidden',
        'relative', // FAB의 위치 기준점
    ),
    // 컨텐츠 영역
    content: cn(
        'relative',
        'h-full',
    ),
}
