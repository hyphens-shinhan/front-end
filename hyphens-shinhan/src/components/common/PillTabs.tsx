'use client';

import { cn } from "@/utils/cn";

export interface PillTabsProps {
    /** 탭 라벨 목록 */
    tabs: string[];
    /** 현재 선택된 탭 인덱스 */
    activeIndex: number;
    /** 탭 클릭 시 호출 (선택 사항, 없으면 비제어) */
    onChange?: (index: number) => void;
    className?: string;
}

/** 한 개만 선택 가능한 필터용 필 탭
 * @example
 * <PillTabs tabs={['전체', '내가 참여 중인', '스터디']} activeIndex={0} onChange={setActiveIndex} />
 */
export default function PillTabs({
    tabs,
    activeIndex,
    onChange,
    className,
}: PillTabsProps) {
    return (
        <div className={cn(styles.tabContainer, className)}>
            {tabs.map((label, index) => {
                const isActive = index === activeIndex;
                return (
                    <button
                        key={label}
                        type="button"
                        className={styles.tabItem(isActive)}
                        onClick={() => onChange?.(index)}
                        aria-pressed={isActive}
                        aria-selected={isActive}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

const styles = {
    tabContainer: cn(
        'flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide',
        'px-4 py-2',
    ),
    tabItem: (isActive: boolean) =>
        cn(
            'px-[21px] py-[7px]',
            'body-7 text-grey-6 bg-grey-1 rounded-full border border-grey-2',
            isActive && 'body-7 text-grey-11 bg-grey-4',
        ),
};
