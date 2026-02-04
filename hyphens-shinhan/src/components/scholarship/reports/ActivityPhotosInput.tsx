'use client'

import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/utils/cn";
import ReportTitle from "./ReportTitle";
import ImagePicker from "@/components/common/ImagePicker";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Icon } from "@/components/common/Icon";

export interface ActivityPhotosInputRef {
    /** 선택된 이미지를 업로드하고 URL 배열 반환 */
    uploadImages: () => Promise<string[]>
}

const ActivityPhotosInput = forwardRef<ActivityPhotosInputRef, object>(function ActivityPhotosInput(_, ref) {
    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        canAddMore,
        uploadImages,
    } = useImageUpload({ maxImages: 5 })

    useImperativeHandle(ref, () => ({
        uploadImages,
    }), [uploadImages])

    /** 이미지 추가 버튼 내용 */
    const addButtonContent = (
        <div className={styles.addButtonContent}>
            <Icon name='IconMBoldGallery' size={20} />
            <p className={styles.addButtonContentText}>이미지 추가</p>
        </div>
    )

    return (
        <div className={styles.container}>
            {/** 활동 사진 제목 */}
            <ReportTitle
                title="활동 사진을 업로드 해주세요"
                checkIcon={true}
                isChecked={images.length > 0}
                className="py-0"
            />
            <p className={styles.description}>JPG, PNG 최대 10MB</p>
            {/** 이미지 추가 영역 */}
            <div className={styles.imageAddArea}>
                <ImagePicker
                    images={images}
                    onSelect={handleImageSelect}
                    onRemove={handleRemoveImage}
                    onAdd={openFilePicker}
                    canAddMore={canAddMore}
                    fileInputRef={fileInputRef}
                    addButtonContent={addButtonContent}
                />
            </div>
        </div>
    )
})

export default ActivityPhotosInput

const styles = {
    container: cn('flex flex-col gap-1.5 px-4 pt-6'),
    description: cn('font-caption-caption4 text-grey-8'),
    imageAddArea: cn('flex flex-row flex-wrap gap-2 py-4.5'),
    addButtonContent: cn('flex flex-col items-center justify-center gap-1.5'),
    addButtonContentText: cn('font-caption-caption5 text-grey-8'),
}