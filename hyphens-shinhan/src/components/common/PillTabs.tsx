'use client';

import { cn } from "@/utils/cn";
import { Icon } from '@/components/common/Icon';

export interface PillTabsProps {
    /** 탭 라벨 목록 */
    tabs: string[];
    /** 현재 선택된 탭 인덱스 */
    activeIndex: number;
    /** 탭 클릭 시 호출 (선택 사항, 없으면 비제어) */
    onChange?: (index: number) => void;
    /** 탭별 삭제 버튼 노출 여부 (onDelete와 함께 사용) */
    deletable?: boolean;
    /** 삭제 클릭 시 호출 (지정 시 deletable과 함께 삭제 아이콘 표시) */
    onDelete?: (index: number) => void;
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
    deletable,
    onDelete,
    className,
}: PillTabsProps) {
    const showDelete = Boolean(deletable && onDelete);

    return (
        <div className={cn(styles.tabContainer, className)}>
            {tabs.map((label, index) => {
                const isActive = index === activeIndex;
                return (
                    <div
                        key={`${label}-${index}`}
                        className={cn(
                            styles.tabItem(isActive),
                            showDelete ? 'pr-1.5' : 'pr-[21px]',
                        )}
                    >
                        <button
                            type="button"
                            className={styles.tabLabel}
                            onClick={() => onChange?.(index)}
                            aria-pressed={isActive}
                            aria-selected={isActive}
                        >
                            {label}
                        </button>
                        {showDelete && onDelete && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(index);
                                }}
                                className={styles.deleteButton}
                                aria-label={`${label} 삭제`}
                            >
                                <Icon name="IconMLineClose" size={16} />
                            </button>
                        )}
                    </div>
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
            'flex shrink-0 items-center gap-1 rounded-full border border-grey-2',
            'bg-grey-1 pl-[21px] py-[7px]',
            isActive && 'body-7 text-grey-11 bg-grey-4',
            !isActive && 'body-7 text-grey-6',
        ),
    tabLabel: cn('min-w-0 py-0.5 text-inherit'),
    deleteButton: cn(
        'flex items-center justify-center rounded-full p-0.5 text-grey-6',
        'hover:bg-grey-2 hover:text-grey-9',
    ),
};
