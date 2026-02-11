import ShinhanImage from '@/assets/character.png'
import DoremiImage from '@/assets/doremi.png'
import MullyImage from '@/assets/mully.png'
import PillyImage from '@/assets/pilly.png'
import RayImage from '@/assets/ray.png'
import RinoImage from '@/assets/rino.png'
import ShuImage from '@/assets/shu.png'
import SolImage from '@/assets/sol.png'
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useMemo } from 'react';

const PROFILE_IMAGES = [
    // { src: ShinhanImage, alt: 'Shinhan' },
    { src: DoremiImage, alt: 'Doremi' },
    { src: MullyImage, alt: 'Mully' },
    { src: PillyImage, alt: 'Pilly' },
    { src: RayImage, alt: 'Ray' },
    { src: RinoImage, alt: 'Rino' },
    { src: ShuImage, alt: 'Shu' },
    { src: SolImage, alt: 'Sol' },
] as const;

interface EmptyProfileProps {
    className?: string;
    width?: number;
    height?: number;
}

/** 빈 프로필 컴포넌트 - 캐릭터 이미지 중 하나를 랜덤으로 표시 */
export default function EmptyProfile({ className, width = 100, height = 100 }: EmptyProfileProps) {
    const selected = useMemo(
        () => PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)],
        []
    );

    return (
        <div
            className={cn(styles.container, className)}
            style={{ width, height }}
        >
            <Image
                src={selected.src}
                alt={selected.alt}
                width={width}
                height={height}
                className={styles.image}
            />
        </div>
    );
}

const styles = {
    container: cn(
        'relative flex justify-center items-center rounded-full',
        'bg-grey-2 overflow-hidden',
    ),
    image: cn(
        'w-full h-full object-contain',
    ),
}