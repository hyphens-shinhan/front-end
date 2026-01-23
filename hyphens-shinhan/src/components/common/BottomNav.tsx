'use client';
import { ROUTES, NAV_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div>
            {NAV_ITEMS.map((item) => {
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
    );
}