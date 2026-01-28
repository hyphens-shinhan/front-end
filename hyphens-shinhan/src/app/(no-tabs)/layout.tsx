import CustomHeader from "@/components/common/CustomHeader";
import { cn } from "@/utils/cn";

export default function NoTabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* 상단 고정 헤더 */}
            <CustomHeader type="Left" title="헤더 타이틀" />
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
