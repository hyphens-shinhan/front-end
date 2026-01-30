'use client';
import { ROUTES, NAV_ITEMS_BY_ROLE } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { UserRole } from "@/types";
import { Icon } from "@/components/common/Icon";

export default function BottomNav({ userRole = 'YB' }: { userRole?: UserRole }) {
    const pathname = usePathname();
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
}