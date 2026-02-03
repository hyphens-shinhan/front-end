'use client';

import { cn } from "@/utils/cn";
import { Icon } from "./Icon/Icon";

interface YearSelectorProps {
    /** 현재 선택된 년도 */
    year: number;
    /** 년도 변경 시 호출 (변경된 년도 전달) */
    onYearChange: (year: number) => void;
    /** 선택 가능한 최소 년도 (이전 버튼 비활성화) */
    minYear?: number;
    /** 선택 가능한 최대 년도 (다음 버튼 비활성화) */
    maxYear?: number;
    className?: string;
}

/** 년도 선택 컴포넌트
 * 이전/다음 버튼으로 년도를 탐색
 * @example
 * <YearSelector year={2025} onYearChange={setYear} minYear={2020} maxYear={2026} />
 */
export default function YearSelector({
    year,
    onYearChange,
    minYear,
    maxYear,
    className,
}: YearSelectorProps) {
    const canGoPrev = minYear == null || year > minYear;
    const canGoNext = maxYear == null || year < maxYear;

    return (
        <div
            className={cn(styles.container, className)}
            role="group"
            aria-label="년도 선택"
        >
            <button
                type="button"
                onClick={() => canGoPrev && onYearChange(year - 1)}
                disabled={!canGoPrev}
                aria-label="이전 년도"
                className={cn(
                    styles.button,
                    canGoPrev ? styles.buttonEnabled : styles.buttonDisabled,
                )}
            >
                <Icon name="IconLLineArrowLeft" size={24} />
            </button>

            <span className={styles.year} aria-live="polite">
                {year}
            </span>

            <button
                type="button"
                onClick={() => canGoNext && onYearChange(year + 1)}
                disabled={!canGoNext}
                aria-label="다음 년도"
                className={cn(
                    styles.button,
                    canGoNext ? styles.buttonEnabled : styles.buttonDisabled,
                )}
            >
                <Icon name="IconLLineArrowRight" size={24} />
            </button>
        </div>
    );
}

const styles = {
    container: cn(
        'flex items-center justify-center gap-10',
    ),
    button: cn(
        'flex items-center justify-center p-1 -m-1 rounded',
        'transition-opacity active:opacity-70',
    ),
    buttonEnabled: 'text-grey-9 cursor-pointer',
    buttonDisabled: 'text-grey-5 cursor-not-allowed',
    year: 'title-18 text-grey-11 min-w-[4ch] text-center',
};
