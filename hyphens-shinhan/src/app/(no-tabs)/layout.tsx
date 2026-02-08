import CustomHeader from "@/components/common/CustomHeader";
import { ChatProvider } from "@/contexts/ChatContext";
import { cn } from "@/utils/cn";
import NoTabsLayoutClient from "./NoTabsLayoutClient";

export default function NoTabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NoTabsLayoutClient>
            <ChatProvider>
                <div className={styles.container}>
                    {/* 상단 고정 헤더 - 현재 경로에 따라 자동으로 설정됨 */}
                    <CustomHeader />
                    <main className={styles.main}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </main>
                </div>
            </ChatProvider>
        </NoTabsLayoutClient>
    );
}

const styles = {
    container: cn(
        'relative mx-auto max-w-md',
        'h-[100dvh] flex flex-col',
        'bg-white'
    ),
    main: cn(
        'flex-1 min-h-0 overflow-hidden',
    ),
    content: cn(
        'flex-1 h-full min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide',
    ),
};
