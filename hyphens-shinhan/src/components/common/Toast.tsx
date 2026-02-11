'use client';

import { Icon } from '@/components/common/Icon';
import { cn } from '@/utils/cn';

/** 토스트 위치 프리셋 (한 곳에서 수정하면 전역 적용) */
export const TOAST_POSITION_STYLES = {
  /** 기본 헤더 아래 */
  'top-default-header': 'fixed top-14 left-1/2 -translate-x-1/2 z-[100]',
  /** 커스텀 헤더 아래 */
  'top-custom-header': 'fixed top-16 left-1/2 -translate-x-1/2 z-[100]',
  /** 탭이 있을 때: 탭 바 위 */
  'bottom-above-tabs': 'fixed bottom-30 left-1/2 -translate-x-1/2 z-[100]',
  /** 탭이 없을 때: 화면 하단 */
  'bottom-no-tabs': 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]',
} as const;

export type ToastPosition = keyof typeof TOAST_POSITION_STYLES;

export type ToastVariant = 'default' | 'error';

const variantStyles = {
  default: 'bg-[rgba(73,77,90,0.8)]',
  error: 'bg-[rgba(239,68,68,0.92)]',
} as const;

interface ToastProps {
  /** 토스트에 표시할 메시지 */
  message: string;
  /** 아이콘 표시 여부 (Figma 디자인: tick-circle / error 시 close-circle) */
  showIcon?: boolean;
  /** 화면 내 위치 프리셋 (TOAST_POSITION_STYLES에서 클래스 수정 가능) */
  position?: ToastPosition;
  /** 기본(성공) / 에러 */
  variant?: ToastVariant;
  className?: string;
}

/**
 * Toast 컴포넌트 (Figma 디자인 기준)
 * - 배경: rgba(73, 77, 90, 0.9), 16px 라운드
 * - 패딩: 14px 20px, 아이콘·텍스트 간격 8px
 * - 텍스트: Body/Body5 (16px, semibold), 흰색
 * - 위치: TOAST_POSITION_STYLES에서 프리셋 수정 시 전역 반영
 */
export default function Toast({
  message,
  showIcon = true,
  position = 'bottom-no-tabs',
  variant = 'default',
  className,
}: ToastProps) {
  const iconName = variant === 'error' ? 'IconLBoldCloseCircle' : 'IconLBoldTickCircle';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center gap-2.5 rounded-2xl',
        'px-5 py-3', // Figma: padding 14px 20px
        variantStyles[variant],
        TOAST_POSITION_STYLES[position],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showIcon && (
          <span className="flex size-6 shrink-0 [&_path]:fill-white">
            <Icon name={iconName} size={24} />
          </span>
        )}
        <span
          className="body-5 text-white whitespace-nowrap max-w-[min(280px,calc(100vw-3rem))]"
          title={message}
        >
          {message}
        </span>
      </div>
    </div>
  );
}
