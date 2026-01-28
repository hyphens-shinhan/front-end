import CustomHeader from "@/components/common/CustomHeader";
import { cn } from "@/utils/cn";

export default function NoTabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* 상단 고정 헤더 - 현재 경로에 따라 자동으로 설정됨 */}
            <CustomHeader />
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}

const styles = {
    main: cn(
        'flex-1',
    ),
    content: cn(
        'flex-1',
    ),
};
