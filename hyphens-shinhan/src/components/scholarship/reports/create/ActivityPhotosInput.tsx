'use client'

import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import ReportTitle from "../ReportTitle";
import ImagePicker from "@/components/common/ImagePicker";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_UPLOAD } from "@/constants/imageUpload";
import { Icon } from "@/components/common/Icon";

export interface ActivityPhotosInputRef {
    /** 기존 URL + 새로 업로드한 URL 배열 반환 (임시 저장용) */
    uploadImages: () => Promise<string[]>
}

export interface ActivityPhotosInputProps {
    /** GET으로 불러온 기존 이미지 URL (표시 + 임시 저장 시 그대로 포함) */
    existingImageUrls?: string[] | null
    /** 사진 1장 이상일 때 true로 호출 (제출 버튼 활성화 등) */
    onCheckedChange?: (checked: boolean) => void
}

const IMAGE_SIZE = 80

/** 활동 사진 입력 컴포넌트
 * @param existingImageUrls - 불러온 기존 이미지 URL (있으면 표시, 제거 가능)
 * @param onCheckedChange - 사진 1장 이상일 때 true로 호출 (제출 버튼 활성화 등)
 */
const ActivityPhotosInput = forwardRef<ActivityPhotosInputRef, ActivityPhotosInputProps>(function ActivityPhotosInput({ existingImageUrls, onCheckedChange }, ref) {
    // ---------- 상태: 불러온 기존 URL 중 유지할 것만 (삭제 시 여기서 제거, 임시 저장 시 이 배열만 포함) ----------
    const [keptExistingUrls, setKeptExistingUrls] = useState<string[]>([])
    /** ref로 uploadImages() 호출 시 항상 최신 keptExistingUrls 참조 (클로저 스테일 방지) */
    const keptExistingUrlsRef = useRef<string[]>([])
    keptExistingUrlsRef.current = keptExistingUrls
    /** 최초 1회만 서버 값 반영. 임시 저장 후 refetch 시 기존 URL로 덮어써서 삭제한 이미지가 다시 뜨는 것 방지 */
    const initialSyncDoneRef = useRef(false)

    // ---------- 기존 이미지 URL 동기화: 진입 시 1회만. refetch 시에는 덮어쓰지 않음 ----------
    useEffect(() => {
        if (existingImageUrls == null) {
            initialSyncDoneRef.current = false
            setKeptExistingUrls([])
            return
        }
        if (!initialSyncDoneRef.current) {
            setKeptExistingUrls(existingImageUrls.filter(Boolean) ?? [])
            initialSyncDoneRef.current = true
        }
    }, [existingImageUrls?.length, existingImageUrls?.join(',')])

    // ---------- 새로 추가하는 사진 파일 (useImageUpload). 기존 개수만큼 maxImages 감소 ----------
    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        canAddMore: canAddMoreNew,
        uploadImages: uploadNewImages,
    } = useImageUpload({
        maxImages: Math.max(0, IMAGE_UPLOAD.MAX_IMAGES.ACTIVITY_PHOTOS - keptExistingUrls.length),
        bucket: IMAGE_UPLOAD.BUCKET.REPORTS,
        pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.REPORT_PHOTOS,
    })

    const totalCount = keptExistingUrls.length + images.length
    const canAddMore = totalCount < IMAGE_UPLOAD.MAX_IMAGES.ACTIVITY_PHOTOS

    /** 사진 1장 이상이면 제출 버튼 활성화용으로 onCheckedChange(true) 호출 */
    useEffect(() => {
        onCheckedChange?.(totalCount > 0)
    }, [totalCount, onCheckedChange])

    /** 기존 이미지 썸네일에서 삭제 버튼 → keptExistingUrls에서만 제거 (다음 임시 저장 시 제외됨) */
    const handleRemoveExisting = (index: number) => {
        setKeptExistingUrls((prev) => prev.filter((_, i) => i !== index))
    }

    // ---------- ref 노출: 부모가 임시 저장 시 호출 ----------
    /** 1) 새로 선택한 파일만 Supabase 업로드, 2) 현재 유지 중인 기존 URL + 새 URL 합쳐서 반환 (ref로 최신 keptExistingUrls 참조) */
    const uploadImages = async (): Promise<string[]> => {
        const newUrls = await uploadNewImages()
        return [...keptExistingUrlsRef.current, ...newUrls]
    }

    /** 부모에서 임시 저장 시 uploadImages() 호출. ref로 최신 keptExistingUrlsRef.current 참조 */
    useImperativeHandle(ref, () => ({
        uploadImages,
    }), [uploadNewImages])

    /** 이미지 추가 버튼 내용 */
    const addButtonContent = (
        <div className={styles.addButtonContent}>
            <Icon name='IconMBoldGallery' size={20} />
            <p className={styles.addButtonContentText}>이미지 추가</p>
        </div>
    )

    const sizeStyle = { width: IMAGE_SIZE, height: IMAGE_SIZE }

    return (
        <div className={styles.container}>
            {/** 활동 사진 제목 */}
            <ReportTitle
                title="활동 사진을 업로드 해주세요"
                checkIcon={true}
                isChecked={totalCount > 0}
                className="py-0"
            />
            <p className={styles.description}>JPG, PNG 최대 10MB</p>
            {/** 기존 이미지(불러온 URL) + 새로 추가한 이미지 */}
            <div className={styles.imageAddArea}>
                {keptExistingUrls.map((url, index) => (
                    <div key={`existing-${url}-${index}`} className={styles.imageWrapper} style={sizeStyle}>
                        <div className={styles.imageInner}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`활동 사진 ${index + 1}`}
                                className={styles.existingImage}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveExisting(index)}
                        >
                            <Icon name="IconLLineClose" />
                        </button>
                    </div>
                ))}
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

export default memo(ActivityPhotosInput)

const styles = {
    container: cn('flex flex-col gap-1.5 px-4 pt-6'),
    description: cn('font-caption-caption4 text-grey-8'),
    imageAddArea: cn('flex flex-row flex-wrap gap-2 py-4.5'),
    imageWrapper: cn('relative'),
    imageInner: cn('relative w-full h-full rounded-[16px] overflow-hidden bg-grey-2'),
    existingImage: cn('object-cover w-full h-full'),
    removeButton: cn(
        'absolute -top-1 -right-1 w-5 h-5',
        'flex items-center justify-center bg-grey-10 rounded-full text-white text-xs',
    ),
    addButtonContent: cn('flex flex-col items-center justify-center gap-1.5'),
    addButtonContentText: cn('font-caption-caption5 text-grey-8'),
}