import { HEADER_ITEMS, HEADER_NAV_ITEM_KEY } from "@/constants";
import { Icon, IconName } from "./Icon";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PropsType {
    type?: 'Center' | 'Left';
    title: string;
    logo?: IconName;
    navItem?: (typeof HEADER_ITEMS)[HEADER_NAV_ITEM_KEY];
    onBack?: () => void;
    onClick?: () => void;
}

/** 커스텀 헤더 컴포넌트
 * @param type - 헤더 타입 (Center, Left)
 * @param title - 헤더 타이틀
 * @param logo - ? 헤더 로고
 * @param navItem - ? 헤더 네비게이션 아이템
 * @param onBack - ? 뒤로가기 핸들러
 * @param onClick - ? 네비게이션 클릭 핸들러
 * @returns 헤더 컴포넌트
 */
export default function CustomHeader({ type = 'Left', title, logo, navItem, onBack, onClick }: PropsType) {
    const router = useRouter();

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
            <div className={cn(styles.wrapper, styles[type])}>
                {/** 헤더 타이틀 로고 */}
                {logo && (
                    <Icon name={logo} className={styles.logo} />
                )}
                {/** 헤더 타이틀 */}
                <h1 className={styles.title}>{title}</h1>
            </div>

            { /** 헤더 네비게이션 */}
            {navItem && (
                <Link
                    href={navItem.href}
                    className={styles.navItem}
                    onClick={onClick}
                    aria-label={navItem.ariaLabel}
                >
                    <span aria-hidden="true">
                        <Icon name={navItem.icon} />
                    </span>
                </Link>
            )}
        </header>
    );
}

const styles = {
    container: cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex flex-row justify-between items-center',
        'px-4 py-3'
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
        'w-6 h-6 mr-1',
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