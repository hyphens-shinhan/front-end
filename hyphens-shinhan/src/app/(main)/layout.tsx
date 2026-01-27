'use client';

import BottomNav from "@/components/common/BottomNav";
import CustomHeader from "@/components/common/CustomHeader";
import Header from "@/components/common/Header";
import { cn } from "@/utils/cn";
import { getHeaderConfig } from "@/utils/header";
import { usePathname } from "next/navigation";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const headerConfig = getHeaderConfig(pathname);

    return (
        <div className={styles.container}>
            {/* 상단 고정 헤더 */}
            {headerConfig && (
                <Header title={headerConfig.title} navItems={headerConfig.navItems} />
            )}

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
        'h-[100dvh] overflow-hidden flex flex-col',
        'bg-white'
    ),
    // 메인 영역: 헤더와 바텀 네비 사이에서 독립 스크롤
    main: cn(
        'flex-1 overflow-y-auto',
        'overscroll-behavior-y-contain',
        'relative', // FAB의 위치 기준점
    ),
    // 컨텐츠 영역
    content: cn(
        'relative',
        'min-h-full',
    ),
}