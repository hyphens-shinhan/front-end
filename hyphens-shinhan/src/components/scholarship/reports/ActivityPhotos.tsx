'use client'

import Image from 'next/image'
import ImagePicker from '@/components/common/ImagePicker'
import { useImageUpload } from '@/hooks/useImageUpload'
import { cn } from '@/utils/cn'

interface ActivityPhotosProps {
  /** 보고서에 이미 등록된 이미지 URL 목록 (서버에서 내려준 값) */
  imageUrls?: string[] | null
}

/** 활동 보고서 상세 - 활동 사진 섹션 (기존 이미지 표시 + 추가 업로드, 최대 5장) */
export default function ActivityPhotos({ imageUrls }: ActivityPhotosProps) {
  const existingUrls = imageUrls?.filter(Boolean) ?? []
  const {
    images,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    openFilePicker,
  } = useImageUpload({
    maxImages: 0,
    bucket: 'posts',
    pathPrefix: 'feeds',
  })

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>활동 사진</h2>
      <div className={styles.imageRow}>
        {existingUrls.map((url, index) => (
          <div key={`existing-${index}`} className={styles.imageWrap}>
            <div className={styles.imageInner}>
              <Image
                src={url}
                alt={`활동 사진 ${index + 1}`}
                fill
                className={styles.image}
                unoptimized={url.startsWith('blob:') || url.includes('supabase')}
              />
            </div>
          </div>
        ))}
        <ImagePicker
          images={images}
          onSelect={handleImageSelect}
          onRemove={handleRemoveImage}
          onAdd={openFilePicker}
          canAddMore={false}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  )
}

const styles = {
  section: cn('pb-6'),
  sectionTitle: cn('title-16 text-grey-11 py-4.5'),
  imageRow: cn('flex flex-row flex-wrap gap-2'),
  imageWrap: cn('relative w-20 h-20'),
  imageInner: cn('relative w-full h-full rounded-[16px] overflow-hidden'),
  image: cn('object-cover'),
}
