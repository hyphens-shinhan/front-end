'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useImageError } from '@/hooks/useImageError';
import ShinhanImage from '@/assets/banner.png';

interface ThumbnailProps {
    /** 대표 이미지 URL (없거나 에러 시 프론트 이미지로 폴백) */
    src: string | null;
    /** 대체 텍스트 */
    alt: string;
    /** 폴백 EmptyProfile 크기 */
    fallbackSize?: number;
    /** 컨테이너 추가 클래스 */
    className?: string;
}

const styles = {
    container: cn(
        'relative h-[158px] rounded-[16px] bg-grey-4 overflow-hidden',
    ),
    fallback: cn(
        'absolute inset-0 flex items-center justify-center',
    ),
};

/** 썸네일 대표 이미지 (에러 시 EmptyProfile 폴백) */
export default function Thumbnail({
    src,
    alt,
    fallbackSize = 120,
    className,
}: ThumbnailProps) {
    const { imageError, handleImageError, resetError } = useImageError();
    const normalizedSrc = src?.replace(/([^:]\/)\/+/g, '$1') ?? null;

    useEffect(() => {
        if (normalizedSrc) resetError();
    }, [normalizedSrc, resetError]);

    return (
        <div className={cn(styles.container, className)}>
            {normalizedSrc && !imageError ? (
                <Image
                    src={normalizedSrc}
                    alt={alt}
                    fill
                    className="rounded-[16px] object-cover"
                    onError={handleImageError}
                    unoptimized
                />
            ) : (
                <div className={styles.fallback}>
                    <Image src={ShinhanImage} alt="Shinhan" fill className="rounded-[16px] object-cover" />
                </div>
            )}
        </div>
    );
}
