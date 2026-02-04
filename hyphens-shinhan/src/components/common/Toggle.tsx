'use client';

import { cn } from '@/utils/cn';

const styles = {
    button:
        'relative inline-flex shrink-0 cursor-pointer rounded-[24px] p-0.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E67FF] w-[30px] h-[19px]',
    buttonChecked: 'bg-[#2E67FF]',
    buttonUnchecked: 'bg-[#EAECF1]',
    buttonDisabled: 'cursor-not-allowed',
    thumb: 'pointer-events-none inline-block h-[15px] w-[15px] shrink-0 rounded-full transition-transform duration-200 bg-white',
    thumbDisabled: '!bg-[#D5D9E4]',
    thumbChecked: 'translate-x-[11px]',
    thumbUnchecked: 'translate-x-0',
} as const;

interface ToggleProps {
    /** 켜짐(선택) 여부 */
    checked?: boolean;
    /** 비활성화 여부 */
    disabled?: boolean;
    /** 상태 변경 시 호출 (disabled일 때는 호출되지 않음) */
    onChange?: (checked: boolean) => void;
    /** 추가 클래스 */
    className?: string;
    /** 접근성 라벨 (스크린 리더용) */
    'aria-label'?: string;
}

/**
 * 글 스위치
 * - Off: 트랙 #EAECF1, 썸 #FFFFFF
 * - On: 트랙 #2E67FF, 썸 #FFFFFF
 * - Disabled: 트랙 #EAECF1, 썸 #D5D9E4
 */
export default function Toggle({
    checked = false,
    disabled = false,
    onChange,
    className,
    'aria-label': ariaLabel = '토글',
}: ToggleProps) {
    const handleClick = () => {
        if (disabled) return;
        onChange?.(!checked);
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={handleClick}
            className={cn(
                styles.button,
                checked && !disabled && styles.buttonChecked,
                (!checked || disabled) && styles.buttonUnchecked,
                disabled && styles.buttonDisabled,
                className
            )}
        >
            <span
                className={cn(
                    styles.thumb,
                    disabled && !checked && styles.thumbDisabled,
                    checked ? styles.thumbChecked : styles.thumbUnchecked
                )}
            />
        </button>
    );
}
