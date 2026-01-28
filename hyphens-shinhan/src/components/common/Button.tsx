'use client';

import { cn } from "@/utils/cn";

interface PropsType {
    label: string;
    size: 'L' | 'M' | 'S' | 'XS';
    type: 'primary' | 'secondary' | 'danger' | 'warning';
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
export default function Button({ label, size, type, disabled = false, onClick }: PropsType) {
    const containerStyle = cn(
        'flex items-center justify-center border border-grey-3 shadow-md ',
        'transition-all duration-100 active:scale-98',
        sizeStyles[size],
        typeStyles[type],
        disabled && disabledStyles
    );

    return (
        <button className={containerStyle} disabled={disabled} onClick={onClick}>
            <span>{label}</span>
        </button>
    );
}

const sizeStyles = {
    L: 'w-[145px] py-3.5 rounded-[12px] body-7',
    M: 'w-[100px] py-2.5 rounded-[12px] body-7',
    S: 'w-[80px] py-1.5 rounded-[8px] body-9',
    XS: 'px-2.5 py-[5px] rounded-[6px] font-caption-caption5',
}
const typeStyles = {
    primary: 'bg-primary-shinhanblue text-white body-7 hover:bg-primary-dark',
    secondary: 'bg-white text-grey-9 hover:bg-grey-2',
    danger: 'bg-state-error text-white hover:bg-state-error-dark',
    warning: 'bg-white text-state-error hover:bg-grey-2',
}

const disabledStyles = 'cursor-not-allowed bg-grey-3 text-grey-6 hover:bg-grey-3 hover:text-grey-6'
