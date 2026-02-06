'use client';

import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useImageError } from '@/hooks/useImageError';
import EmptyProfile from './EmptyProfile';

interface AvatarProps {
    /** 프로필 이미지 URL */
    src: string | null | undefined;
    /** 대체 텍스트 */
    alt?: string;
    /** 크기 (width와 height 동일) */
    size?: number;
    /** width (size보다 우선) */
    width?: number;
    /** height (size보다 우선) */
    height?: number;
    /** fill 모드 사용 여부 (true면 width/height 무시) */
    fill?: boolean;
    /** 추가 클래스명 */
    className?: string;
    /** 컨테이너 클래스명 */
    containerClassName?: string;
}

/** 프로필 아바타 컴포넌트 (이미지 에러 처리 포함)
 * @example
 * <Avatar src={user.avatar_url} alt={user.name} size={40} />
 * <Avatar src={user.avatar_url} alt={user.name} fill className="rounded-full" />
 */
export default function Avatar({
    src,
    alt = '프로필',
    size,
    width,
    height,
    fill = false,
    className,
    containerClassName,
}: AvatarProps) {
    const { imageError, handleImageError } = useImageError();

    const finalWidth = width || size || 40;
    const finalHeight = height || size || 40;

    if (fill) {
        return (
            <div className={cn(styles.container, containerClassName)}>
                {src && !imageError ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className={cn('rounded-full object-cover', className)}
                        onError={handleImageError}
                        unoptimized
                    />
                ) : (
                    <EmptyProfile width={finalWidth} height={finalHeight} />
                )}
            </div>
        );
    }

    return (
        <div className={cn(styles.container, containerClassName)}>
            {src && !imageError ? (
                <Image
                    src={src}
                    alt={alt}
                    width={finalWidth}
                    height={finalHeight}
                    className={cn('rounded-full object-cover', className)}
                    onError={handleImageError}
                    unoptimized
                />
            ) : (
                <EmptyProfile width={finalWidth} height={finalHeight} />
            )}
        </div>
    );
}

const styles = {
    container: cn('relative'),
}
