'use client';

import { cn } from "@/utils/cn";

interface SkeletonProps {
    className?: string;
}

interface SkeletonTextProps extends SkeletonProps {
    lines?: number;
    /** 마지막 줄 너비 (기본값: 75%) */
    lastLineWidth?: string;
}

/** 스켈레톤 기본 스타일 */
const baseStyle = cn('bg-grey-3 animate-pulse');

/** 스켈레톤 컴포넌트 모음
 * @example
 * // 원형 스켈레톤 (프로필 이미지 등)
 * <Skeleton.Circle className="w-10 h-10" />
 * 
 * // 박스 스켈레톤
 * <Skeleton.Box className="w-full h-4" />
 * 
 * // 텍스트 스켈레톤 (여러 줄)
 * <Skeleton.Text lines={2} />
 * 
 * // 컨테이너 (animate-pulse 래퍼)
 * <Skeleton.Container className="flex gap-2">
 *   <Skeleton.Circle className="w-8 h-8" />
 *   <Skeleton.Box className="w-24 h-4" />
 * </Skeleton.Container>
 */

/** 원형 스켈레톤 - 프로필 이미지, 아바타 등 */
function Circle({ className }: SkeletonProps) {
    return <div className={cn(baseStyle, 'rounded-full', className)} />;
}

/** 박스 스켈레톤 - 일반적인 직사각형 요소 */
function Box({ className }: SkeletonProps) {
    return <div className={cn(baseStyle, 'rounded', className)} />;
}

/** 텍스트 스켈레톤 - 여러 줄의 텍스트 */
function Text({ lines = 2, lastLineWidth = 'w-3/4', className }: SkeletonTextProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        baseStyle,
                        'h-4 rounded',
                        index === lines - 1 ? lastLineWidth : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

/** 컨테이너 - animate-pulse를 자식에게 전파하지 않고 래퍼로 사용 */
function Container({ className, children }: SkeletonProps & { children: React.ReactNode }) {
    return <div className={cn('animate-pulse', className)}>{children}</div>;
}

/** 태그 스켈레톤 - 작은 둥근 태그 */
function Tag({ className }: SkeletonProps) {
    return <div className={cn(baseStyle, 'rounded-full', className)} />;
}

export const Skeleton = {
    Circle,
    Box,
    Text,
    Tag,
    Container,
};
