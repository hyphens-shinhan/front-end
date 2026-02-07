import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ImageErrorPlaceholderProps {
  /** 컨테이너에 추가할 클래스명 */
  className?: string
  /** 메시지 (기본: "사진을 불러올 수 없어요") */
  message?: string
}

/** 이미지 로드 실패 시 표시하는 플레이스홀더 컴포넌트 */
export default function ImageErrorPlaceholder({
  className,
  message = '이미지 없음',
}: ImageErrorPlaceholderProps) {
  return (
    <div className={cn(styles.container, className)}>
      <Icon name="IconMBoldGallery" className={styles.icon} />
      <p className={styles.message}>{message}</p>
    </div>
  )
}

const styles = {
  container: cn(
    'flex flex-col items-center justify-center',
    'w-full h-full',
    'bg-grey-3 rounded-[12px]',
  ),
  icon: cn('text-grey-7 mb-1'),
  message: cn('text-center body-10 text-grey-7 px-2'),
}
