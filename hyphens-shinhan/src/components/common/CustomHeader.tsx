'use client';

import { HEADER_ITEMS, HEADER_NAV_ITEM_KEY } from "@/constants";
import { HeaderNavItem } from "@/types";
import { Icon, IconName } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
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
    if (item.href) {
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

// ─────────────────────────────────────────────────────────────
// CustomHeader Props
// ─────────────────────────────────────────────────────────────
interface PropsType {
    /** 타이틀 정렬 방식 - Center: 중앙, Left: 좌측 */
    type?: 'Center' | 'Left';
    /** 좌측 버튼 타입 - Back: ← 화살표, Close: X 닫기 */
    btnType?: 'Back' | 'Close';
    /** 헤더 타이틀 */
    title?: string;
    /** 타이틀 앞에 표시할 아이콘 */
    logo?: IconName;
    /** 타이틀 앞에 표시할 이미지 (logo보다 우선) */
    img?: string | StaticImageData;
    /** 우측 네비게이션 아이템 (아이콘 링크 or 텍스트 버튼) */
    navItem?: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY];
    /** 뒤로가기 시 이동할 경로 */
    backHref?: string;
    /** 뒤로가기 커스텀 핸들러 (backHref보다 우선) */
    onBack?: () => void;
    /** 우측 네비게이션 클릭 핸들러 */
    onClick?: () => void;
}

/**
 * 커스텀 헤더 컴포넌트
 *
 * props를 전달하지 않으면 현재 경로(pathname)에 맞는 설정이 자동 적용됩니다.
 * (constants/index.ts의 CUSTOM_HEADER_CONFIG 참고)
 *
 * @example
 * // 기본 사용 - 경로 기반 자동 설정
 * <CustomHeader />
 *
 * // 타이틀만 커스텀
 * <CustomHeader title="글 작성" />
 *
 * // 완료 버튼 + 클릭 핸들러
 * <CustomHeader
 *   title="글 작성"
 *   navItem={HEADER_ITEMS.COMPLETE}
 *   onClick={handleComplete}
 * />
 *
 * // X 닫기 버튼 + 커스텀 뒤로가기
 * <CustomHeader
 *   btnType="Close"
 *   onBack={() => router.push('/home')}
 * />
 */
export default function CustomHeader({ type, title, logo, img, navItem, btnType, backHref, onBack, onClick }: PropsType) {
    const router = useRouter();
    const pathname = usePathname();

    // ─────────────────────────────────────────────────────────────
    // 설정 결정: props > 경로 기반 설정 > 기본값
    // ─────────────────────────────────────────────────────────────
    const headerConfig = getCustomHeaderConfig(pathname);

    const displayType = type || headerConfig?.type || 'Left';
    const displayBtnType = btnType || headerConfig?.btnType || 'Back';
    const displayTitle = title || headerConfig?.title || '';
    const displayLogo = logo || headerConfig?.logo;
    const displayImg = img || headerConfig?.img;
    const displayNavItem = navItem || headerConfig?.navItem;
    const displayBackHref = backHref || headerConfig?.backHref;

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
                <h1 className={styles.title}>{displayTitle}</h1>
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
    title: cn(
        'title-18 text-black',
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