'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@/utils/cn"
import ReportTitle from "./ReportTitle"
import ImagePicker from "@/components/common/ImagePicker"
import { useImageUpload } from "@/hooks/useImageUpload"
import { IMAGE_UPLOAD } from "@/constants/imageUpload"
import { Icon } from "@/components/common/Icon"

export interface ActivityCostReceiptInputRef {
    /** 총 비용 값 (제출 시 사용) */
    getTotalCost: () => string
    /** Supabase에 영수증 이미지 업로드 후 URL 배열 반환 (제출 시 사용) */
    uploadImages: () => Promise<string[]>
    /** 선택된 영수증 파일 목록 */
    getImageFiles: () => File[]
}

export interface ActivityCostReceiptInputProps {
    /** 총 비용 (controlled). 없으면 내부 state 사용 */
    totalCost?: string
    /** 총 비용 변경 시 호출 (controlled일 때 필수) */
    onTotalCostChange?: (value: string) => void
    /** 영수증 이미지 변경 시 호출 (부모에서 저장용) */
    onImagesChange?: (files: File[]) => void
    /** 영수증 1장 이상 + 총 비용 입력 시 true로 호출 (제출 버튼 활성화 등) */
    onCheckedChange?: (checked: boolean) => void
}

/** 활동 비용과 영수증 첨부 컴포넌트 */
const ActivityCostReceiptInput = forwardRef<
    ActivityCostReceiptInputRef,
    ActivityCostReceiptInputProps
>(function ActivityCostReceiptInput(
    { totalCost, onTotalCostChange, onImagesChange, onCheckedChange },
    ref
) {
    const [internalTotalCost, setInternalTotalCost] = useState("")
    const totalCostValue = totalCost ?? internalTotalCost
    const setTotalCost = onTotalCostChange ?? setInternalTotalCost

    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        uploadImages: doUploadImages,
    } = useImageUpload({
        maxImages: IMAGE_UPLOAD.MAX_IMAGES.RECEIPTS,
        bucket: IMAGE_UPLOAD.BUCKET,
        pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.UPLOADS,
    })

    useEffect(() => {
        onImagesChange?.(images.map((img) => img.file))
    }, [images, onImagesChange])

    const isReceiptChecked = images.length > 0 && totalCostValue.trim().length > 0
    useEffect(() => {
        onCheckedChange?.(isReceiptChecked)
    }, [isReceiptChecked, onCheckedChange])

    useImperativeHandle(
        ref,
        () => ({
            getTotalCost: () => totalCostValue,
            uploadImages: doUploadImages,
            getImageFiles: () => images.map((img) => img.file),
        }),
        [totalCostValue, doUploadImages, images]
    )

    return (
        <div className={styles.container}>
            <ReportTitle title="활동 비용과 영수증을 첨부해주세요" checkIcon={true} isChecked={isReceiptChecked} className="py-0" />
            {/** 영수증 추가 버튼 */}
            <div className={styles.imagePickerContainer}>
                <ImagePicker
                    images={images}
                    onSelect={handleImageSelect}
                    onRemove={handleRemoveImage}
                    onAdd={openFilePicker}
                    canAddMore={images.length < 3}
                    fileInputRef={fileInputRef}
                    addButtonContent={
                        <div className={styles.addButtonContent}>
                            <Icon name='IconLBoldReceipt' size={24} />
                            <p className={styles.addButtonContentText}>영수증 추가</p>
                        </div>}
                />
            </div>

            {/** 총 비용 입력칸 */}
            <div className={styles.totalCostContainer}>
                <input
                    type="number"
                    className={styles.totalCostInput}
                    placeholder="총 비용을 입력해주세요"
                    value={totalCostValue}
                    onChange={(e) => setTotalCost(e.target.value)}
                />
                <p className={styles.totalCostLabel}>영수증 금액과 일치해야 합니다.</p>
            </div>

            {/** TODO: 세부 내역 입력칸 */}
        </div>
    )
})

export default ActivityCostReceiptInput

const styles = {
    container: cn('flex flex-col px-4 pt-6'),
    imagePickerContainer: cn('flex flex-col py-3.5'),
    addButtonContent: cn('flex flex-col items-center justify-center gap-1.5'),
    addButtonContentText: cn('font-caption-caption5 text-grey-8'),
    totalCostContainer: cn('flex flex-col gap-2'),
    totalCostInput: cn(
        'px-4 py-3 rounded-[16px] border border-grey-2',
        'placeholder:body-5 placeholder:text-grey-8',
        'body-6 text-grey-10 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky',
    ),
    totalCostLabel: cn('pl-4 font-caption-caption4 text-grey-8'),
}