'use client';

import { useCallback, memo } from "react";
import { HeaderNavItem } from "@/types";
import { useHeaderStore } from "@/stores";
import { Icon } from "./Icon";
import Button from "@/components/common/Button";
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
    // 텍스트 버튼 타입(navItem.type === 'button' && text가 있는 경우)은 공통 Button 컴포넌트 사용
    if (item.type === 'button' && item.text && !item.href && !item.icon) {
        return (
            <Button
                label={item.text}
                size="S"
                type="secondary"
                className={styles.navItem}
                onClick={onClick}
            />
        );
    }

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

/** pathname·handleBack·onClick·customTitle·displayNavItem만 prop으로 받는 헤더 (라우터/스토어 훅 미사용). searchParams만 바뀔 때 리렌더 방지용. */
export const CustomHeaderContent = memo(function CustomHeaderContent({
    pathname,
    handleBack,
    onClick,
    customTitle,
    displayNavItem,
}: {
    pathname: string;
    handleBack: () => void;
    onClick?: () => void;
    customTitle?: string | null;
    /** 우측 navItem (스토어 navItemOverride 반영된 최종값). 없으면 미표시 */
    displayNavItem?: HeaderNavItem | null;
}) {
    const pathConfig = getCustomHeaderConfig(pathname);
    const displayType = pathConfig?.type || 'Left';
    const displayBtnType = pathConfig?.btnType || 'Back';
    const displayTitle = (customTitle != null ? customTitle : pathConfig?.title) || '';
    const displayLogo = pathConfig?.logo;
    const displayImg = pathConfig?.img;

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
/** localStorage에 이전 설문이 있는지 여부 */
export function hasStoredMentorshipRequest(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const stored = localStorage.getItem('mentorship_request');
        if (!stored) return false;
        const parsed = JSON.parse(stored);
        return parsed != null && typeof parsed === 'object' && Object.keys(parsed).length > 0;
    } catch {
        return false;
    }
}

export default function CustomHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { onBack, onClick } = useHeaderStore((state) => state.handlers);
    const customTitle = useHeaderStore((state) => state.customTitle);
    const navItemOverride = useHeaderStore((state) => state.navItemOverride);
    const pathConfig = getCustomHeaderConfig(pathname);
    const displayBackHref = pathConfig?.backHref;
    const displayNavItem =
        navItemOverride === null
            ? undefined
            : navItemOverride !== undefined
                ? navItemOverride
                : pathConfig?.navItem;

    /** 클릭 시 스토어에서 최신 onClick을 읽어 호출 (메모/구독 이슈 방지) */
    const handleNavClick = useCallback(() => {
        useHeaderStore.getState().handlers.onClick?.();
    }, []);

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
            return;
        }
        if (displayBackHref) {
            // 공유 링크로 진입한 경우(히스토리 1개 또는 외부 referrer) backHref로 이동, 아니면 router.back()
            const canGoBack =
                typeof window !== 'undefined' && window.history.length > 1;
            const referrer = typeof document !== 'undefined' ? document.referrer : '';
            let isSameOriginReferrer = false;
            if (referrer) {
                try {
                    const referrerOrigin = new URL(referrer, window.location.origin).origin;
                    isSameOriginReferrer = referrerOrigin === window.location.origin;
                } catch {
                    isSameOriginReferrer = false;
                }
            }
            if (!canGoBack || !isSameOriginReferrer) {
                router.replace(displayBackHref);
                return;
            }
        }
        router.back();
    }, [onBack, displayBackHref, router]);

    return (
        <CustomHeaderContent
            pathname={pathname}
            handleBack={handleBack}
            onClick={handleNavClick}
            customTitle={customTitle}
            displayNavItem={displayNavItem}
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
        'text-primary-light py-2',
    ),
    navText: cn(
        'body-5 font-semibold text-grey-6',
    ),
}      