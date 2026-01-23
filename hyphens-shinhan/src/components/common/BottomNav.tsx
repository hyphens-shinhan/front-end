'use client';
import { ROUTES, NAV_ITEMS_BY_ROLE } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { UserRole } from "@/types";

export default function BottomNav({ userRole = 'YB' }: { userRole?: UserRole }) {
    const pathname = usePathname();
    const navItems = NAV_ITEMS_BY_ROLE[userRole];

    return (
        <nav className={styles.container}>
            <div className={styles.wrapper}>
                {navItems.map((item) => {
                    const isActive =
                        item.href === ROUTES.HOME.MAIN
                            ? pathname === ROUTES.HOME.MAIN
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.navItem(isActive)}
                        >
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
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-100',
    ),
    wrapper: cn(
        'flex items-center justify-around',
        'h-[var(--bottom-nav-height)] px-2',
        'max-w-md mx-auto',
        'border-b border-gray-100'
    ),
    navItem: (isActive: boolean) => cn(
        'flex flex-col items-center justify-center',
        'flex-1 h-full py-2',
        'transition-all duration-200',
        isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
    ),
    label: (isActive: boolean) => cn(
        'text-xs',
        isActive ? 'font-bold' : 'font-medium'
    ),
}