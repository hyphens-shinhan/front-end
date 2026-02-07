import { memo } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { useMultipleImageError } from '@/hooks/useMultipleImageError'
import ImageErrorPlaceholder from '@/components/common/ImageErrorPlaceholder'

interface PostContentProps {
  /** 게시글 본문 */
  content: string
  /** 이미지 URL 목록 */
  imageUrls?: string[] | null
  /** 본문 줄 수 제한 (기본: 제한 없음) */
  lineClamp?: number
  /** 이미지 최대 표시 개수 (기본: 전체) */
  maxImages?: number
  /** 추가 className */
  className?: string
}

/**
 * 게시글 본문 + 이미지 영역 컴포넌트
 *
 * PostCard, FeedDetailContent 등에서 공통으로 사용
 */
const PostContent = memo(function PostContent({
  content,
  imageUrls,
  lineClamp,
  maxImages,
  className,
}: PostContentProps) {
  const { handleImageError, isFailed } = useMultipleImageError()

  const displayImages = maxImages ? imageUrls?.slice(0, maxImages) : imageUrls
  const remainingCount = imageUrls && maxImages ? imageUrls.length - maxImages : 0

  return (
    <div className={cn(styles.container, className)}>
      {/** 본문 */}
      <p
        className={cn(
          styles.content,
          lineClamp === 2 && 'line-clamp-2',
          lineClamp === 3 && 'line-clamp-3',
        )}
      >
        {content}
      </p>

      {/** 이미지 영역 */}
      {displayImages && displayImages.length > 0 && (
        <div className={styles.imageWrapper}>
          {displayImages.map((url, index) => {
            if (isFailed(index)) {
              return (
                <div key={index} className={styles.imageItem}>
                  <ImageErrorPlaceholder />
                </div>
              )
            }
            return (
              <div key={index} className={styles.imageItem}>
                <Image
                  src={url}
                  alt={`post-image-${index}`}
                  fill
                  className="rounded-[12px] object-cover"
                  onError={() => handleImageError(index)}
                  unoptimized
                />
              </div>
            )
          })}
          {remainingCount > 0 && (
            <div className={styles.imageMoreButton}>+{remainingCount}</div>
          )}
        </div>
      )}
    </div>
  )
})

export default PostContent

const styles = {
  container: cn('flex flex-col gap-4'),
  content: cn('body-8', 'text-grey-11'),
  imageWrapper: cn('flex flex-row gap-2 items-center'),
  imageItem: cn(
    'relative',
    'w-22 h-22 rounded-[12px] overflow-hidden',
    'bg-grey-5',
  ),
  imageMoreButton: cn(
    'flex items-center justify-center',
    'w-fit h-fit',
    'px-[9px] py-[7px] rounded-[17px]',
    'font-caption-caption3',
    'text-grey-9',
    'bg-grey-2',
  ),
}
