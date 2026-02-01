'use client';

import { cn } from "@/utils/cn";

interface PropsType {
    label: string;
    size: 'L' | 'M' | 'S' | 'XS';
    type: 'primary' | 'secondary' | 'danger' | 'warning';
    /** true면 가로 전체 채움 (w-full) */
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

/** 버튼 컴포넌트 
 * @param size - L, M, S, XS - 버튼 크기
 * @param type - primary, secondary, danger, warning - 버튼 타입
 * @param disabled - true, false - 버튼 비활성화 여부
 * @param onClick - 버튼 클릭 이벤트 핸들러 함수
 * @returns 버튼 컴포넌트
 * 
 * @example
 * 이벤트 핸들러 함수를 감싸는 컴포넌트를 생성한 후, 아래 버튼 컴포넌트를 사용하면 됩니다.
 * <FollowButton> 참고: 이벤트 핸들러를 작성하고 <Button /> 컴포넌트 props로 전달 ! 
 * <Button label="버튼" size="L" type="primary" disabled={false} onClick={() => {}} />
*/
export default function Button({ label, size, type, fullWidth = false, disabled = false, onClick }: PropsType) {
    const containerStyle = cn(
        'flex items-center justify-center shadow-md',
        'transition-all duration-100 active:scale-98',
        sizeStyles[size],
        typeStyles[type],
        fullWidth && 'w-full',
        disabled && disabledStyles
    );

    return (
        <button className={containerStyle} disabled={disabled} onClick={onClick}>
            <span>{label}</span>
        </button>
    );
}

/** 사이즈별 패딩만 적용, 가로 길이는 텍스트(콘텐츠)에 맞춤 */
const sizeStyles = {
    L: 'px-6 py-3 rounded-[16px] body-5',
    M: 'px-5 py-2.5 rounded-[12px] body-7',
    S: 'px-4 py-1.5 rounded-[8px] body-9',
    XS: 'px-2.5 py-[5px] rounded-[8px] font-caption-caption3',
}
const typeStyles = {
    primary: 'bg-primary-shinhanblue text-white hover:bg-primary-dark',
    secondary: 'bg-white text-grey-9 border-0.5 border-grey-3 hover:bg-grey-2',
    danger: 'bg-state-error text-white hover:bg-state-error-dark',
    warning: 'bg-white text-state-error border-0.5 border-grey-3 hover:bg-grey-2',
}

const disabledStyles = 'cursor-not-allowed bg-grey-3 text-grey-6 hover:bg-grey-3 hover:text-grey-6'
