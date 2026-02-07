'use client';

import { Icon } from '@/components/common/Icon';
import { cn } from '@/utils/cn';

interface ToastProps {
  /** 토스트에 표시할 메시지 */
  message: string;
  /** 아이콘 표시 여부 (Figma 디자인: tick-circle 아이콘) */
  showIcon?: boolean;
  /** 화면 내 위치: 상단 또는 하단 (fixed 포지셔닝) */
  position?: 'top' | 'bottom';
  className?: string;
}

const positionStyles = {
  top: 'fixed top-6 left-1/2 -translate-x-1/2 z-[100]',
  bottom: 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]',
} as const;

/**
 * Toast 컴포넌트 (Figma 디자인 기준)
 * - 배경: rgba(73, 77, 90, 0.9), 16px 라운드
 * - 패딩: 14px 20px, 아이콘·텍스트 간격 8px
 * - 텍스트: Body/Body5 (16px, semibold), 흰색
 */
export default function Toast({ message, showIcon = true, position = 'top', className }: ToastProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-2.5 rounded-2xl',
        'px-5 py-3.5', // Figma: padding 14px 20px
        'bg-[rgba(73,77,90,0.9)]',
        positionStyles[position],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showIcon && (
          <span className="flex size-6 shrink-0 [&_path]:fill-white">
            <Icon name="IconLBoldTickCircle" size={24} />
          </span>
        )}
        <span className="body-5 text-white">{message}</span>
      </div>
    </div>
  );
}
