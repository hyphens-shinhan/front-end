'use client';

import { useCallback, memo } from "react";
import { HeaderNavItem } from "@/types";
import { useHeaderStore } from "@/stores";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getCustomHeaderConfig } from "@/utils/header";

// ─────────────────────────────────────────────────────────────
// NavItem 렌더러 컴포넌트
// ─────────────────────────────────────────────────────────────
interface NavItemRendererProps {
    item: HeaderNavItem;
    onClick?: () => void;
}
/** 네비게이션 아이템 렌더러 */
function NavItemRenderer({ item, onClick }: NavItemRendererProps) {
    const content = (
        <>
            {item.icon && <Icon name={item.icon} />}
            {item.text && <span className={styles.navText}>{item.text}</span>}
        </>
    );

    // href가 있으면 Link, 없으면 Button
    if (item.type === 'link' && item.href) {
        return (
            <Link
                href={item.href}
                className={styles.navItem}
                onClick={onClick}
                aria-label={item.ariaLabel}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={styles.navItem}
            onClick={onClick}
            aria-label={item.ariaLabel}
        >
            {content}
        </button>
    );
}

/** pathname·handleBack·onClick·customTitle만 prop으로 받는 헤더 (라우터/스토어 훅 미사용). searchParams만 바뀔 때 리렌더 방지용. */
export const CustomHeaderContent = memo(function CustomHeaderContent({
    pathname,
    handleBack,
    onClick,
    customTitle,
}: {
    pathname: string;
    handleBack: () => void;
    onClick?: () => void;
    customTitle?: string | null;
}) {
    const pathConfig = getCustomHeaderConfig(pathname);
    const displayType = pathConfig?.type || 'Left';
    const displayBtnType = pathConfig?.btnType || 'Back';
    const displayTitle = (customTitle != null ? customTitle : pathConfig?.title) || '';
    const displayLogo = pathConfig?.logo;
    const displayImg = pathConfig?.img;
    const displayNavItem = pathConfig?.navItem;

    return (
        <header className={styles.container}>
            <button onClick={handleBack} aria-label="뒤로가기">
                <span aria-hidden="true">
                    {displayBtnType === 'Back' ? (
                        <Icon name='IconLLineArrowLeft' className={styles.backButton} />
                    ) : (
                        <Icon name='IconLLineClose' className={styles.backButton} />
                    )}
                </span>
            </button>

            <div className={cn(styles.wrapper, styles[displayType])}>
                {displayImg ? (
                    <div className={styles.logo}>
                        <Image
                            src={displayImg}
                            alt="Header Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : displayLogo ? (
                    <Icon name={displayLogo} className={styles.logo} />
                ) : null}
                <h1 className={displayType === 'Center' ? styles.centerTitle : styles.title}>{displayTitle}</h1>
            </div>

            {displayNavItem && (
                <NavItemRenderer item={displayNavItem} onClick={onClick} />
            )}
        </header>
    );
});

/**
 * 커스텀 헤더 컴포넌트
 *
 * - 정적 설정: 경로 기반 (CUSTOM_HEADER_CONFIG)
 * - 동적 핸들러: useHeaderStore
 * - pathname 변경 시에만 Content 리렌더 (searchParams만 바뀔 때 방지)
 */
export default function CustomHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { onBack, onClick } = useHeaderStore((state) => state.handlers);
    const customTitle = useHeaderStore((state) => state.customTitle);
    const pathConfig = getCustomHeaderConfig(pathname);
    const displayBackHref = pathConfig?.backHref;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
            return;
        }
        if (displayBackHref) {
            router.push(displayBackHref);
            return;
        }
        router.back();
    }, [onBack, displayBackHref, router]);

    return (
        <CustomHeaderContent
            pathname={pathname}
            handleBack={handleBack}
            onClick={onClick}
            customTitle={customTitle}
        />
    );
}

const styles = {
    container: cn(
        'flex flex-row justify-between items-center',
        'px-4 py-3',
    ),
    wrapper: cn(
        'flex flex-1 flex-row items-center',
    ),
    Center: cn(
        'justify-center',
    ),
    Left: cn(
        'justify-start',
    ),
    backButton: cn(
        'flex items-center justify-center w-6 h-6',
        'text-grey-9 mr-2',
    ),
    logo: cn(
        'relative w-6 h-6 mr-1',
    ),
    centerTitle: cn(
        'title-16 text-grey-11',
    ),
    title: cn(
        'title-18 text-grey-11',
    ),
    nav: cn(
        'flex flex-row gap-x-4',
    ),
    navItem: cn(
        'flex items-center justify-center',
        'text-grey-9',
    ),
    navText: cn(
        'body-5 font-semibold text-grey-6',
    ),
}      