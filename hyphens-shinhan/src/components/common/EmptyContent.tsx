'use client';

import { cn } from "@/utils/cn";

export type EmptyContentVariant = 'loading' | 'empty' | 'error';

export interface EmptyContentProps {
    /** 표시할 상태: 로딩 / 빈 데이터 / 오류 */
    variant: EmptyContentVariant;
    /** 화면에 보여줄 문구 (상황에 맞게 전달) */
    message: string;
    /** error일 때 메시지 아래 추가로 표시 (예: 개발용 상세 메시지) */
    subMessage?: React.ReactNode;
    /** error일 때만 사용. 예: "목록으로 돌아가기" 링크 등 */
    action?: React.ReactNode;
    /** 래퍼에 추가할 클래스 */
    className?: string;
}

/** 로딩·빈 리스트·오류 등 공통으로 쓰는 빈 상태 컴포넌트. 문구는 EMPTY_CONTENT_MESSAGES 상수 사용 권장.
 * @example
 * <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
 * <EmptyContent variant="empty" message={EMPTY_CONTENT_MESSAGES.EMPTY.COMMENT} />
 * <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.LIST} action={<Button ... />} />
 */
export default function EmptyContent({
    variant,
    message,
    subMessage,
    action,
    className,
}: EmptyContentProps) {
    return (
        <div
            className={cn(
                styles.wrapper,
                variant === 'error' && styles.errorWrapper,
                className
            )}
            role={variant === 'loading' ? 'status' : undefined}
            aria-live={variant === 'loading' ? 'polite' : undefined}
        >
            <p className={styles.messageText}>
                {message}
                {variant === 'error' && subMessage != null && (
                    <span className="mt-2 block">{subMessage}</span>
                )}
            </p>
            {action && variant === 'error' && (
                <div className={styles.actionWrapper}>{action}</div>
            )}
        </div>
    );
}

const styles = {
    wrapper: cn(
        'flex flex-col items-center justify-center',
        'px-4 py-20'
    ),
    errorWrapper: cn('gap-4'),
    messageText: cn('text-center body-6 text-grey-8'),
    actionWrapper: cn('flex items-center justify-center py-3'),
};
