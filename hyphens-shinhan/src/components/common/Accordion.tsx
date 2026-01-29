'use client'

import { cn } from "@/utils/cn";
import { Icon, IconName } from "./Icon";

interface AccordionProps {
    /** 표시할 텍스트 */
    title?: string;
    /** 아이콘 이름 */
    iconName: IconName;
    /** 열림 상태 */
    isOpen?: boolean;
    /** 클릭 핸들러 */
    onClick?: () => void;
}

/**
 * 아코디언 컴포넌트
 * 
 * 열림/닫힘 상태와 클릭 액션은 외부에서 관리
 * 
 * @example
 * <Accordion 
 *   title="익명" 
 *   isOpen={isBottomSheetOpen}
 *   onClick={handleOpenBottomSheet}
 * />
 */
export default function Accordion({ title, iconName, isOpen = false, onClick }: AccordionProps) {
    return (
        <button type="button" onClick={onClick} className={styles.container}>
            <Icon name={iconName} className={styles.icon} />
            <p className={styles.title}>{title}</p>
            <Icon
                name='IconLLineArrowDown'
                className={cn(styles.icon, styles.arrowIcon, isOpen && '-rotate-180')}
            />
        </button>
    );
}

const styles = {
    container: cn(
        'flex items-center gap-2',
        'px-4 py-2',
    ),
    icon: cn(
        'text-grey-9',
    ),
    title: cn(
        'body-5 text-grey-10',
    ),
    arrowIcon: cn(
        'ml-auto',
        'transition-transform duration-75',
    ),
}