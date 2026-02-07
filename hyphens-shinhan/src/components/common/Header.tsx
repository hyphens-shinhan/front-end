'use client';

import { memo } from "react";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getHeaderConfig } from "@/utils/header";
import { ROUTES } from "@/constants";

/**
 * pathname만 prop으로 받는 헤더 (라우터 훅 미사용).
 * 레이아웃에서 pathname을 넘겨 쓰면 searchParams만 바뀔 때 리렌더되지 않음.
 * 홈(/)일 때는 그라데이션 배경에 맞춰 투명 배경·흰색 텍스트 스타일이 적용됩니다.
 */
export const HeaderContent = memo(function HeaderContent({ pathname }: { pathname: string }) {
    const headerConfig = getHeaderConfig(pathname);
    const isHome = pathname === ROUTES.HOME.MAIN;

    if (!headerConfig) {
        return null;
    }

    const { title, navItems } = headerConfig;

    return (
        <header className={cn(styles.container, isHome && styles.containerHome)}>
            { /** 헤더 타이틀 */}
            <h1 className={cn(styles.title, isHome && styles.titleHome)}>
                {title}
            </h1>
            { /** 헤더 네비게이션 */}
            {navItems.length > 0 && (
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            href={item.href ?? '/'}
                            key={item.href}
                            className={cn(styles.navItem, isHome && styles.navItemHome)}
                            aria-label={item.ariaLabel}
                        >
                            {item.icon && (
                                <span aria-hidden="true">
                                    <Icon name={item.icon} />
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
});

/** 현재 경로에 따라 헤더 설정을 적용. pathname 미전달 시 usePathname() 사용 (다른 페이지에서 사용용). */
function Header({ pathname: pathnameProp }: { pathname?: string } = {}) {
    const pathnameFromRouter = usePathname();
    const pathname = pathnameProp ?? pathnameFromRouter;
    return <HeaderContent pathname={pathname} />;
}

const styles = {
    container: cn(
        'flex flex-row justify-between items-center',
        'px-4 py-3',
    ),
    /** 홈 화면: 그라데이션에 맞춰 투명 배경 */
    containerHome: 'bg-transparent',
    title: 'shinhan-title-1 text-grey-11',
    /** 홈 화면: 흰색 타이틀 */
    titleHome: 'text-white',
    nav: 'flex flex-row gap-x-4',
    navItem: 'flex items-center justify-center w-6 h-6 text-grey-9',
    /** 홈 화면: 흰색 아이콘 */
    navItemHome: 'text-white',
} as const;

export default memo(Header);