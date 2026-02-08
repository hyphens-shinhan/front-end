'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { cn } from "@/utils/cn"
import ReportTitle from "../ReportTitle"
import ImagePicker from "@/components/common/ImagePicker"
import { useImageUpload } from "@/hooks/useImageUpload"
import { IMAGE_UPLOAD } from "@/constants/imageUpload"
import { Icon } from "@/components/common/Icon"
import type { ReceiptCreate, ReceiptItemCreate, ReceiptResponse } from "@/types/reports"
import { processReceiptOCRViaApi } from "@/services/ocr"
import { processReceiptOCR } from "@/utils/ocr"

export interface ActivityCostReceiptInputRef {
    /** 총 비용 값 (제출 시 사용) */
    getTotalCost: () => string
    /** 기존 유지 + 새 업로드 합쳐 ReceiptCreate[] 반환 (임시 저장용) */
    getReceipts: () => Promise<ReceiptCreate[]>
    /** Supabase에 영수증 이미지 업로드 후 URL 배열 반환 (레거시) */
    uploadImages: () => Promise<string[]>
    /** 선택된 영수증 파일 목록 */
    getImageFiles: () => File[]
}

export interface ActivityCostReceiptInputProps {
    /** GET으로 불러온 기존 영수증 (표시 + 임시 저장 시 포함) */
    existingReceipts?: ReceiptResponse[] | null
    /** 총 비용 (controlled). 없으면 내부 state 사용 */
    totalCost?: string
    /** 총 비용 변경 시 호출 (controlled일 때 필수) */
    onTotalCostChange?: (value: string) => void
    /** 영수증 이미지 변경 시 호출 (부모에서 저장용) */
    onImagesChange?: (files: File[]) => void
    /** 영수증 1장 이상 + 총 비용 입력 시 true로 호출 (제출 버튼 활성화 등) */
    onCheckedChange?: (checked: boolean) => void
}

const RECEIPT_SIZE = 80

/** 기존 ReceiptResponse → ReceiptCreate (id, created_at 제외) */
function toReceiptCreate(r: ReceiptResponse): ReceiptCreate {
    return {
        store_name: r.store_name,
        image_url: r.image_url,
        items: r.items.map(({ item_name, price }) => ({ item_name, price })),
    }
}

/** 활동 비용과 영수증 첨부 컴포넌트 */
const ActivityCostReceiptInput = forwardRef<
    ActivityCostReceiptInputRef,
    ActivityCostReceiptInputProps
>(function ActivityCostReceiptInput(
    { existingReceipts, totalCost, onTotalCostChange, onImagesChange, onCheckedChange },
    ref
) {
    // ---------- 상태: 총 비용 (controlled 또는 내부) ----------
    const [internalTotalCost, setInternalTotalCost] = useState("")
    /** GET으로 불러온 영수증 중 유지할 것만 (삭제 시 제거, 임시 저장 시 이 목록 + 새 업로드 합쳐서 전송) */
    const [keptExistingReceipts, setKeptExistingReceipts] = useState<ReceiptResponse[]>([])
    /** OCR로 추출한 세부 내역 (첫 번째 새 영수증에 적용) */
    const [detailItems, setDetailItems] = useState<ReceiptItemCreate[]>([])
    const [isProcessingOCR, setIsProcessingOCR] = useState(false)
    const [ocrError, setOcrError] = useState<string | null>(null)

    // ---------- ref: 부모가 ref로 호출할 때 항상 최신 state 참조 (클로저 스테일 방지) ----------
    const keptExistingReceiptsRef = useRef<ReceiptResponse[]>([])
    const totalCostValueRef = useRef("")
    const detailItemsRef = useRef<ReceiptItemCreate[]>([])
    const prevImagesLengthRef = useRef(0)
    const imagesLengthRef = useRef(0)
    keptExistingReceiptsRef.current = keptExistingReceipts
    detailItemsRef.current = detailItems
    /** 최초 1회만 서버 값 반영. 임시 저장 후 refetch 시 기존 목록으로 덮어써서 삭제한 영수증이 다시 뜨는 것 방지 */
    const initialSyncDoneRef = useRef(false)

    // ---------- 기존 영수증 목록 동기화: 진입 시 1회만. refetch 시에는 덮어쓰지 않음 ----------
    useEffect(() => {
        if (existingReceipts == null) {
            initialSyncDoneRef.current = false
            setKeptExistingReceipts([])
            return
        }
        if (!initialSyncDoneRef.current) {
            setKeptExistingReceipts(existingReceipts)
            initialSyncDoneRef.current = true
        }
    }, [existingReceipts?.length, existingReceipts?.map((r) => r.id).join(',')])

    // ---------- 총 비용 초기값: 불러온 영수증이 있으면 첫 영수증의 '총 비용' 또는 첫 항목 price로 채움 ----------
    useEffect(() => {
        if (existingReceipts?.length && internalTotalCost === "") {
            const firstTotal = existingReceipts[0]?.items?.find((i) => i.item_name === "총 비용")?.price
                ?? existingReceipts[0]?.items?.[0]?.price
            if (firstTotal != null) setInternalTotalCost(String(firstTotal))
        }
    }, [existingReceipts?.length])

    const totalCostValue = totalCost ?? internalTotalCost
    totalCostValueRef.current = totalCostValue
    const setTotalCost = onTotalCostChange ?? setInternalTotalCost

    // ---------- 새로 추가하는 영수증 파일 (useImageUpload). 기존 개수만큼 maxImages 감소 ----------
    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        uploadImages: doUploadImages,
    } = useImageUpload({
        maxImages: Math.max(0, IMAGE_UPLOAD.MAX_IMAGES.RECEIPTS - keptExistingReceipts.length),
        bucket: IMAGE_UPLOAD.BUCKET.REPORTS,
        pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.REPORT_RECEIPTS,
    })

    const totalReceiptCount = keptExistingReceipts.length + images.length
    imagesLengthRef.current = images.length

    useEffect(() => {
        onImagesChange?.(images.map((img) => img.file))
    }, [images, onImagesChange])

    // ---------- OCR: 새 영수증 이미지 추가 시 가장 최근 이미지로 세부 내역 추출 ----------
    useEffect(() => {
        if (images.length === 0) {
            setDetailItems([])
            setOcrError(null)
            prevImagesLengthRef.current = 0
            setIsProcessingOCR(false)
            return
        }
        if (images.length <= prevImagesLengthRef.current) {
            prevImagesLengthRef.current = images.length
            return
        }
        const newFile = images[images.length - 1]?.file
        if (!newFile?.type.startsWith('image/')) {
            prevImagesLengthRef.current = images.length
            return
        }
        const processingForLength = images.length
        prevImagesLengthRef.current = images.length
        setIsProcessingOCR(true)
        setOcrError(null)
        /** API + fallback can take 1–2 min on first run (lang load); allow 3 min. */
        const timeoutMs = 180_000
        const timeoutId = window.setTimeout(() => {
            if (imagesLengthRef.current === processingForLength) {
                setIsProcessingOCR(false)
                setOcrError('처리 시간이 초과되었습니다. 첫 실행 시 언어 데이터 로딩으로 1~2분 걸릴 수 있습니다.')
            }
        }, timeoutMs)

        function applyExtracted(extracted: { name: string; price: number }[]) {
            const items: ReceiptItemCreate[] = extracted.map(({ name, price }) => ({
                item_name: name,
                price,
            }))
            setDetailItems(items)
            if (items.length > 0 && !totalCostValueRef.current.trim()) {
                const sum = items.reduce((s, i) => s + i.price, 0)
                setTotalCost(String(sum))
            }
            if (items.length === 0) {
                setOcrError('영수증에서 항목을 찾을 수 없습니다. 총 비용만 입력해 주세요.')
            }
        }

        function finish() {
            window.clearTimeout(timeoutId)
            if (imagesLengthRef.current === processingForLength) {
                setIsProcessingOCR(false)
            }
        }

        /** 1) Try backend OCR first (faster after first load). 2) Fallback to client Tesseract.js. */
        let fallbackStarted = false
        processReceiptOCRViaApi(newFile)
            .then((extracted) => {
                window.clearTimeout(timeoutId)
                if (imagesLengthRef.current !== processingForLength) return
                applyExtracted(extracted)
            })
            .catch(() => {
                if (imagesLengthRef.current !== processingForLength) return
                fallbackStarted = true
                processReceiptOCR(newFile)
                    .then((extracted) => {
                        window.clearTimeout(timeoutId)
                        if (imagesLengthRef.current !== processingForLength) return
                        applyExtracted(extracted)
                    })
                    .catch((err) => {
                        window.clearTimeout(timeoutId)
                        if (imagesLengthRef.current === processingForLength) {
                            setOcrError(err instanceof Error ? err.message : '영수증 처리 중 오류가 발생했습니다.')
                        }
                    })
                    .finally(finish)
            })
            .finally(() => {
                if (!fallbackStarted) finish()
            })
    }, [images.length])

    /** 영수증 1장 이상 + 총 비용 입력 시에만 제출 버튼 활성화 */
    const isReceiptChecked = totalReceiptCount > 0 && totalCostValue.trim().length > 0
    useEffect(() => {
        onCheckedChange?.(isReceiptChecked)
    }, [isReceiptChecked, onCheckedChange])

    /** 기존 영수증 썸네일에서 삭제 버튼 → keptExistingReceipts에서만 제거 (다음 임시 저장 시 제외됨) */
    const handleRemoveExisting = (index: number) => {
        setKeptExistingReceipts((prev) => prev.filter((_, i) => i !== index))
    }

    // ---------- ref 노출: 부모가 임시 저장 시 호출 ----------
    /** 1) 유지한 기존 영수증 → ReceiptCreate 변환, 2) 새 파일만 Supabase 업로드, 3) 새 URL + 총 비용으로 ReceiptCreate 생성, 4) 둘 합쳐서 반환 */
    const getReceipts = async (): Promise<ReceiptCreate[]> => {
        const existingCreates = keptExistingReceiptsRef.current.map(toReceiptCreate)
        const newUrls = await doUploadImages()
        const totalCostStr = totalCostValueRef.current
        const totalCostNum = totalCostStr.trim()
            ? Number(totalCostStr.replace(/,/g, "")) || 0
            : 0
        const firstReceiptItems = detailItemsRef.current
        const newReceipts: ReceiptCreate[] = newUrls.map((image_url, i) => ({
            store_name: "영수증",
            image_url,
            items:
                i === 0
                    ? firstReceiptItems.length > 0
                        ? firstReceiptItems
                        : totalCostNum > 0
                            ? [{ item_name: "총 비용", price: totalCostNum }]
                            : []
                    : [],
        }))
        return [...existingCreates, ...newReceipts]
    }

    /** 부모(ReportDetailContentYBLeader)에서 임시 저장 시 getReceipts(), getTotalCost() 호출. ref는 항상 최신 ref.current 참조 */
    useImperativeHandle(
        ref,
        () => ({
            getTotalCost: () => totalCostValueRef.current,
            getReceipts,
            uploadImages: doUploadImages,
            getImageFiles: () => images.map((img) => img.file),
        }),
        [doUploadImages, images]
    )

    const sizeStyle = { width: RECEIPT_SIZE, height: RECEIPT_SIZE }

    return (
        <div className={styles.container}>
            <ReportTitle title="활동 비용과 영수증을 첨부해주세요" checkIcon={true} isChecked={isReceiptChecked} className="py-0" />
            {/** 기존 영수증(불러온 것) + 새로 추가한 영수증 */}
            <div className={styles.imagePickerContainer}>
                {keptExistingReceipts.map((receipt, index) => (
                    <div key={receipt.id} className={styles.imageWrapper} style={sizeStyle}>
                        <div className={styles.imageInner}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={receipt.image_url}
                                alt={`영수증 ${index + 1}`}
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
                    canAddMore={totalReceiptCount < IMAGE_UPLOAD.MAX_IMAGES.RECEIPTS}
                    disabled={isProcessingOCR}
                    fileInputRef={fileInputRef}
                    addButtonContent={
                        <div className={styles.addButtonContent}>
                            {isProcessingOCR ? (
                                <>
                                    <span className="text-grey-6 body-6">처리 중...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="IconLBoldReceipt" size={24} />
                                    <p className={styles.addButtonContentText}>영수증 추가</p>
                                </>
                            )}
                        </div>
                    }
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

            {/** 세부 내역 (OCR 추출 또는 빈 상태). Figma: rounded boxes, light grey bg */}
            <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>세부 내역</p>
                {detailItems.length > 0 ? (
                    <div className={styles.detailList}>
                        {detailItems.map((item, index) => (
                            <div key={index} className={styles.detailItem}>
                                <span className={styles.detailItemText}>
                                    {item.item_name} {item.price.toLocaleString('ko-KR')}원
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.detailEmpty}>
                        {isProcessingOCR
                            ? '영수증에서 세부 내역을 읽는 중입니다... (첫 실행 시 1~2분 걸릴 수 있습니다)'
                            : '영수증을 추가하면 세부 내역이 자동으로 채워집니다.'}
                    </p>
                )}
                {ocrError && <p className={styles.ocrError}>{ocrError}</p>}
            </div>
        </div>
    )
})

export default ActivityCostReceiptInput

const styles = {
    container: cn('flex flex-col px-4 pt-6'),
    imagePickerContainer: cn('flex flex-row flex-wrap gap-2 py-3.5'),
    imageWrapper: cn('relative'),
    imageInner: cn('relative w-full h-full rounded-[16px] overflow-hidden bg-grey-2'),
    existingImage: cn('object-cover w-full h-full'),
    removeButton: cn(
        'absolute -top-1 -right-1 w-5 h-5',
        'flex items-center justify-center bg-grey-10 rounded-full text-white text-xs',
    ),
    addButtonContent: cn('flex flex-col items-center justify-center gap-1.5'),
    addButtonContentText: cn('font-caption-caption5 text-grey-8'),
    totalCostContainer: cn('flex flex-col gap-2'),
    totalCostInput: cn(
        'px-4 py-3 rounded-[16px] border border-grey-2',
        'placeholder:body-5 placeholder:text-grey-8',
        'body-6 text-grey-10 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky',
    ),
    totalCostLabel: cn('pl-4 font-caption-caption4 text-grey-8'),
    detailSection: cn('flex flex-col gap-2 pt-2'),
    detailSectionTitle: cn('body-5 text-grey-10 font-medium'),
    detailList: cn('flex flex-col gap-2'),
    detailItem: cn(
        'px-4 py-3 rounded-[16px] bg-grey-1-1 border border-grey-2',
        'body-6 text-grey-10',
    ),
    detailItemText: cn('block'),
    detailEmpty: cn('body-6 text-grey-8'),
    ocrError: cn('body-6 text-grey-7 mt-1'),
}