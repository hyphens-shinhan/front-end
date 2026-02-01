'use client';

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

/**
 * 커스텀 헤더 컴포넌트
 *
 * ─────────────────────────────────────────────────────────────
 * - 정적 설정 (title, navItem 등): 경로 기반 설정 (CUSTOM_HEADER_CONFIG)
 * - 동적 핸들러 (onClick, onBack): useHeaderStore
 * ─────────────────────────────────────────────────────────────
 *
 * @example
 * // 레이아웃에서 사용
 * <CustomHeader />
 *
 * @example
 * // 페이지에서 핸들러 설정
 * const { setHandlers, resetHandlers } = useHeaderStore()
 *
 * useEffect(() => {
 *   setHandlers({ onClick: handleComplete })
 *   return () => resetHandlers()
 * }, [])
 */
export default function CustomHeader() {
    const router = useRouter();
    const pathname = usePathname();

    // ─────────────────────────────────────────────────────────────
    // 설정: 경로 기반(정적) + store(핸들러)
    // ─────────────────────────────────────────────────────────────
    const pathConfig = getCustomHeaderConfig(pathname);
    const { onBack, onClick } = useHeaderStore((state) => state.handlers);

    const displayType = pathConfig?.type || 'Left';
    const displayBtnType = pathConfig?.btnType || 'Back';
    const displayTitle = pathConfig?.title || '';
    const displayLogo = pathConfig?.logo;
    const displayImg = pathConfig?.img;
    const displayNavItem = pathConfig?.navItem;
    const displayBackHref = pathConfig?.backHref;

    // ─────────────────────────────────────────────────────────────
    // 뒤로가기 핸들러: onBack > backHref > router.back()
    // ─────────────────────────────────────────────────────────────
    const handleBack = () => {
        if (onBack) {
            onBack();
            return;
        }

        if (displayBackHref) {
            router.push(displayBackHref);
            return;
        }

        router.back();
    };

    // ─────────────────────────────────────────────────────────────
    // 렌더링
    // ─────────────────────────────────────────────────────────────
    return (
        <header className={styles.container}>
            {/* ─────────── 좌측: 뒤로가기/닫기 버튼 ─────────── */}
            <button onClick={handleBack} aria-label="뒤로가기">
                <span aria-hidden="true">
                    {displayBtnType === 'Back' ? (
                        <Icon name='IconLLineArrowLeft' className={styles.backButton} />
                    ) : (
                        <Icon name='IconLLineClose' className={styles.backButton} />
                    )}
                </span>
            </button>

            {/* ─────────── 중앙: 로고/이미지 + 타이틀 ─────────── */}
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

            {/* ─────────── 우측: 네비게이션 ─────────── */}
            {displayNavItem && (
                <NavItemRenderer item={displayNavItem} onClick={onClick} />
            )}
        </header>
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