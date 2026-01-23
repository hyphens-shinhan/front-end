import BottomNav from "@/components/common/BottomNav";
import Header from "@/components/common/Header";
import { cn } from "@/utils/cn";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.container}>
            {/* 상단 고정 헤더 */}
            <Header title="신한장학재단" />

            {/* 메인 컨텐츠 영역 - 독립적인 스크롤 */}
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
        'h-[100dvh] overflow-hidden',
        'border-x bg-white'
    ),
    // 메인 영역: 헤더와 바텀 네비 사이에서 독립 스크롤
    main: cn(
        'absolute inset-0',
        // 상단: 헤더 높이 + safe-area-top
        'pt-[calc(var(--header-height)+var(--sat))]',
        // 하단: 바텀 네비 높이만 (safe-area는 PWA에서 자동 처리됨)
        'pb-[var(--bottom-nav-height)]',
        'overflow-y-auto',
        'overscroll-behavior-y-contain',
        '-webkit-overflow-scrolling-touch'
    ),
    // 컨텐츠 패딩
    content: 'p-0',
}