'use client';
import { cn } from "@/utils/cn";

interface PropsType {
    title: string;
    isActive: boolean;
    tabType?: 'default' | 'full';
    onClick: () => void;
}

/**
 * 탭 컴포넌트
 * @param {string} title - 탭 제목
 * @param {boolean} isActive - 탭 활성 여부
 * @param {string} className - 추가 스타일
 * @returns {React.ReactNode} 탭 컴포넌트
 * 
 * @example
 * <Tab title="게시판" isActive={true} />
 */
export default function Tab({ isActive, title, tabType = 'default', onClick }: PropsType) {
    return (
        <button className={cn(styles.container, tabType === 'full' && 'flex-1')} onClick={onClick}>
            <h1 className={styles.title(isActive)}>{title}</h1>
            <div className={styles.line(isActive)} />
        </button>
    );
}

const styles = {
    container: cn(
        'flex flex-col items-center justify-between',
    ),
    title: (isActive: boolean) => cn(
        'px-2.5 pt-2.5 pb-2',
        'body-5 transition-colors duration-100',
        isActive ? 'text-grey-11' : 'text-grey-6',
    ),
    line: (isActive: boolean) => cn(
        'w-full h-0.5',
        'transition-colors duration-100',
        isActive ? 'bg-primary-shinhanblue' : 'bg-transparent',
    ),
};
