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
                        <Link key={item.href} href={item.href}>
                            {isActive ? <span className="text-primary">{item.label}</span> : item.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}

const styles = {
    container: 'fixed bottom-0 left-0 right-0 bg-white border-t',
    wrapper: 'flex h-16 items-center justify-around px-2',
    navItem: (isActive: boolean) => cn(
        'flex flex-col items-center justify-center w-full h-full transition-all duration-200',
        isActive ? 'text-blue-600 scale-105' : 'text-gray-400 hover:text-gray-600'
    ),
    label: (isActive: boolean) => cn(
        'text-[10px] mt-1',
        isActive ? 'font-bold' : 'font-medium'
    ),
}