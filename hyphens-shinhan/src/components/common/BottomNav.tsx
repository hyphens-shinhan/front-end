'use client';

import { memo } from "react";
import { ROUTES, NAV_ITEMS_BY_ROLE } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { UserRole } from "@/types";
import { Icon } from "@/components/common/Icon";

/**
 * pathname·userRole만 prop으로 받는 바텀네비 (라우터 훅 미사용).
 * 레이아웃에서 pathname을 넘겨 쓰면 searchParams만 바뀔 때 리렌더되지 않음.
 */
export const BottomNavContent = memo(function BottomNavContent({
    pathname,
    userRole = 'YB',
}: { pathname: string; userRole?: UserRole }) {
    const navItems = NAV_ITEMS_BY_ROLE[userRole];

    return (
        <nav className={styles.container}>
            <div className={styles.wrapper}>
                {/* 바텀 네비게이션 아이템 */}
                {navItems.map((item) => {
                    const isActive =
                        item.href === ROUTES.HOME.MAIN
                            ? pathname === ROUTES.HOME.MAIN
                            : pathname.startsWith(item.href);
                    return (
                        // 클릭 시 해당 화면으로 이동
                        // + 아이콘과 텍스트 색상 변경
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.navItem}
                        >
                            <Icon
                                name={item.icon}
                                className={isActive ? 'text-primary-shinhanblue' : 'text-grey-5'}
                            />
                            <span className={styles.label(isActive)}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
});

/** pathname 미전달 시 usePathname() 사용 (다른 페이지에서 사용용). */
function BottomNav({
    pathname: pathnameProp,
    userRole = 'YB',
}: { pathname?: string; userRole?: UserRole } = {}) {
    const pathnameFromRouter = usePathname();
    const pathname = pathnameProp ?? pathnameFromRouter;
    return <BottomNavContent pathname={pathname} userRole={userRole} />;
}

const styles = {
    container: cn(
        'w-full bg-white border-t border-grey-2 rounded-t-[var(--scheme-radius-8)]',
        'pt-1 pb-2 px-5',
    ),
    wrapper: cn(
        'flex flex-row justify-center items-center',
    ),
    navItem: cn(
        'flex flex-col items-center justify-center gap-y-2',
        'flex-1 h-full py-2',
        'transition-transform duration-300'
    ),
    label: (isActive: boolean) => cn(
        'font-caption-caption6',
        isActive ? 'text-grey-10' : 'text-grey-8',
    ),
};

export default BottomNav;