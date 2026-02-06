import ShinhanImage from '@/assets/character.png'
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface EmptyProfileProps {
    className?: string;
    width?: number;
    height?: number;
}
/** 빈 프로필 컴포넌트 
 * TODO: 여러 이미지 추가하고 랜덤으로 이미지 선택하여 표시
*/
export default function EmptyProfile({ className, width = 100, height = 100 }: EmptyProfileProps) {
    return (
        <div
            className={cn(styles.container, className)}
            style={{ width, height }}
        >
            <Image
                src={ShinhanImage}
                alt="Shinhan"
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