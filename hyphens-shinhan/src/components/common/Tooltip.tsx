'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  /** 툴팁에 표시할 내용 */
  content: ReactNode;
  /** 툴팁을 붙일 트리거 요소 (children) */
  children: ReactNode;
  /** 박스 기준 위치 (화살표가 트리거를 가리킴) */
  placement?: TooltipPlacement;
  /** 호버 후 표시 지연(ms) */
  delay?: number;
  className?: string;
}

/**
 * 툴팁 컴포넌트 (Figma 디자인 기준)
 * - 박스: 12px 라운드, 배경 #D9D9D9 (Rectangle 137×42)
 * - 화살표: 동일 색 삼각형 (Polygon 29×23)
 */
export default function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 0,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const containerPosition: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses: Record<TooltipPlacement, string> = {
    top: 'border-t-[#D9D9D9] border-t-[8px] border-x-[10px] border-b-0 border-x-transparent',
    bottom: 'border-b-[#D9D9D9] border-b-[8px] border-x-[10px] border-t-0 border-x-transparent',
    left: 'border-l-[#D9D9D9] border-l-[8px] border-y-[10px] border-r-0 border-y-transparent',
    right: 'border-r-[#D9D9D9] border-r-[8px] border-y-[10px] border-l-0 border-y-transparent',
  };

  const boxClasses = cn(
    'rounded-[12px] bg-[#D9D9D9] px-3 py-2',
    'body-9 text-grey-11 whitespace-nowrap'
  );

  const arrowEl = (
    <div className={cn('w-0 h-0 border-transparent', arrowClasses[placement])} aria-hidden />
  );

  const isTopOrLeft = placement === 'top' || placement === 'left';

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-[100]',
            (placement === 'top' || placement === 'bottom') && 'flex flex-col items-center',
            (placement === 'left' || placement === 'right') && 'flex flex-row items-center',
            placement === 'bottom' && 'flex-col-reverse',
            placement === 'right' && 'flex-row-reverse',
            containerPosition[placement]
          )}
        >
          {isTopOrLeft ? (
            <>
              <div className={boxClasses}>{content}</div>
              {arrowEl}
            </>
          ) : (
            <>
              {arrowEl}
              <div className={boxClasses}>{content}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
