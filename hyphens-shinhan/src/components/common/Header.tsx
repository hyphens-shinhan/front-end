'use client';

import { Icon } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getHeaderConfig } from "@/utils/header";

/**  
 * 헤더 컴포넌트
 * 현재 경로에 따라 자동으로 헤더 설정을 적용합니다.
 * @returns 헤더 컴포넌트 또는 null
 */
export default function Header() {
    const pathname = usePathname();
    const headerConfig = getHeaderConfig(pathname);

    if (!headerConfig) {
        return null;
    }

    const { title, navItems } = headerConfig;

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
                            href={item.href ?? '/'}
                            key={item.href}
                            className={styles.navItem}
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