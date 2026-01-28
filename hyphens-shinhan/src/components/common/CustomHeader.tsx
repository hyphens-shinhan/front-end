'use client';

import { HEADER_ITEMS, HEADER_NAV_ITEM_KEY } from "@/constants";
import { Icon, IconName } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getCustomHeaderConfig } from "@/utils/header";

interface PropsType {
    type?: 'Center' | 'Left';
    title?: string;
    logo?: IconName;
    img?: string | StaticImageData;
    navItem?: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY];
    onBack?: () => void;
    onClick?: () => void;
}

/** 커스텀 헤더 컴포넌트
 * @param type - 헤더 타입 (Center, Left)
 * @param title - 헤더 타이틀 (전달하지 않으면 현재 경로에 맞는 타이틀 자동 설정)
 * @param logo - ? 헤더 로고 (아이콘)
 * @param img - ? 헤더 이미지
 * @param navItem - ? 헤더 네비게이션 아이템
 * @param onBack - ? 뒤로가기 핸들러
 * @param onClick - ? 네비게이션 클릭 핸들러
 * @returns 헤더 컴포넌트
 * @example
 * <CustomHeader type="Left" title="헤더 타이틀" logo="IconName" navItem={HEADER_ITEMS[HEADER_NAV_ITEM_KEY]} onBack={() => {}} onClick={() => {}} />
 */
export default function CustomHeader({ type, title, logo, img, navItem, onBack, onClick }: PropsType) {
    const router = useRouter();
    const pathname = usePathname();

    // props로 들어온 값이 없으면 현재 경로에 기반한 설정을 가져옴
    const headerConfig = getCustomHeaderConfig(pathname);

    const displayType = type || headerConfig?.type || 'Left';
    const displayTitle = title || headerConfig?.title || '';
    const displayLogo = logo || headerConfig?.logo;
    const displayImg = img || headerConfig?.img;
    const displayNavItem = navItem || headerConfig?.navItem;

    // 사용자가 준 onBack이 있으면 그걸 쓰고, 없으면 router.back() 실행
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <header className={styles.container}>
            {/** 헤더 뒤로가기 버튼 */}
            <button onClick={handleBack} aria-label="뒤로가기">
                <span aria-hidden="true">
                    <Icon name='IconLLineArrowLeft' className={styles.backButton} />
                </span>
            </button>
            <div className={cn(styles.wrapper, styles[displayType])}>
                {/** 헤더 타이틀 로고 (아이콘 또는 이미지) */}
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
                {/** 헤더 타이틀 */}
                <h1 className={styles.title}>{displayTitle}</h1>
            </div>

            { /** 헤더 네비게이션 */}
            {displayNavItem && (
                <Link
                    href={displayNavItem.href}
                    className={styles.navItem}
                    onClick={onClick}
                    aria-label={displayNavItem.ariaLabel}
                >
                    <span aria-hidden="true">
                        <Icon name={displayNavItem.icon} />
                    </span>
                </Link>
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
        'flex items-center justify-center w-6 h-6',
        'text-grey-9',
    ),
}      