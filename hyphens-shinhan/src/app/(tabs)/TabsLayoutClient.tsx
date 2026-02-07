'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderContent } from '@/components/common/Header';
import { BottomNavContent } from '@/components/common/BottomNav';
import { cn } from '@/utils/cn';
import { useMe } from '@/hooks/user/useUser';
import { useUserStore, toNavRole } from '@/stores';
import { ROUTES } from '@/constants';

/** 홈 화면: 대각선 블루 + 수직 흰색 페이드 + 네비 뒤쪽까지 확실히 흰색 */
const HOME_GRADIENT = [
    'linear-gradient(to bottom, transparent 0%, transparent 80%, white 80%, white 100%)',
    'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(255,255,255,0.5) 80%, white 100%)',
    'linear-gradient(124deg, rgba(46, 103, 255, 1) 12%, rgba(106, 163, 255, 1) 89%, var(--color-primary-shinhanblue, #0046FF) 100%)',
].join(', ');

/**
 * (tabs) 레이아웃용 클라이언트 래퍼.
 * pathname을 한 번만 읽어 Header/BottomNav에 prop으로 넘겨,
 * searchParams만 바뀔 때 불필요한 리렌더를 막습니다.
 * 로그인 후 홈(탭) 진입 시 GET /users/me를 불러와 useUserStore에 저장합니다.
 * 홈일 때는 상단 그라데이션 배경이 적용됩니다.
 */
export default function TabsLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: me, isSuccess, isError } = useMe();
    const setUser = useUserStore((s) => s.setUser);
    const user = useUserStore((s) => s.user);
    const isHome = pathname === ROUTES.HOME.MAIN;

    useEffect(() => {
        if (isSuccess && me) {
            setUser(me);
        }
        if (isError) {
            setUser(null);
        }
    }, [isSuccess, isError, me, setUser]);

    const userRole = user ? toNavRole(user.role) : 'YB';

    return (
        <div
            className={styles.container}
            style={isHome ? { background: HOME_GRADIENT } : undefined}
        >
            <HeaderContent pathname={pathname} />
            <main className={styles.main}>
                <div className={styles.content}>{children}</div>
            </main>
            <BottomNavContent pathname={pathname} userRole={userRole} />
        </div>
    );
}

const styles = {
    container: cn(
        'relative mx-auto max-w-md',
        'h-[100dvh] overflow-hidden flex flex-col',
    ),
    main: cn(
        'flex-1',
        'overflow-hidden',
        'relative',
    ),
    content: cn(
        'relative overflow-y-auto scrollbar-hide',
        'h-full',
    ),
};
