'use client'

import ImagePicker from "@/components/common/ImagePicker"
import { useImageUpload } from "@/hooks/useImageUpload"
import { cn } from "@/utils/cn"

/** 활동 보고서 상세 - 활동 사진 섹션 (이미지 업로드, 최대 5장) */
export default function ActivityPhotos() {
    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        canAddMore,
    } = useImageUpload({ maxImages: 5, bucket: 'posts', pathPrefix: 'feeds' })

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>활동 사진</h2>
            <ImagePicker
                images={images}
                onSelect={handleImageSelect}
                onRemove={handleRemoveImage}
                onAdd={openFilePicker}
                canAddMore={canAddMore}
                fileInputRef={fileInputRef}
            />
        </div>
    )
}

const styles = {
    section: cn('pb-6'),
    sectionTitle: cn('title-16 text-grey-11 py-4.5'),
}
