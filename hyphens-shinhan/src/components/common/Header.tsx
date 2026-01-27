'use client';

import { Icon } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { HEADER_ITEMS, HEADER_NAV_ITEM_KEY } from "@/constants";

interface PropsType {
    title: string;
    navItems: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY][];
}
/**  
 * 헤더 컴포넌트
 * @param title - 헤더 타이틀
 * @param navItems - 헤더 네비게이션 아이템
 * @example
 * <Header title="홈" navItems={[HEADER_ITEMS.CHAT, HEADER_ITEMS.SEARCH]} />
 * @returns 헤더 컴포넌트
 */
export default function Header({ title, navItems }: PropsType) {
    return (
        <header className={styles.container}>
            { /** 헤더 타이틀 */}
            <h1 className={styles.title}>
                {title}
            </h1>
            { /** 헤더 네비게이션 */}
            {navItems.length > 0 && (
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={styles.navItem}
                            aria-label={item.ariaLabel}
                        >
                            <span aria-hidden="true">
                                <Icon name={item.icon} />
                            </span>
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}

const styles = {
    container: cn(
        'flex flex-row justify-between items-center',
        'px-4 py-3'
    ),
    title: cn(
        'shinhan-title-1 text-grey-11',
    ),
    nav: cn(
        'flex flex-row gap-x-4',
    ),
    navItem: cn(
        'flex items-center justify-center w-6 h-6',
        'text-grey-9',
    ),
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               