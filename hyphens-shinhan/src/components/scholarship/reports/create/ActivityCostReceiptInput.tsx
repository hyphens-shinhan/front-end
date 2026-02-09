'use client'

import { forwardRef, memo, useMemo, useEffect, useImperativeHandle, useRef, useState } from "react"
import { cn } from "@/utils/cn"
import ReportTitle from "../ReportTitle"
import ImagePicker from "@/components/common/ImagePicker"
import { useImageUpload } from "@/hooks/useImageUpload"
import { IMAGE_UPLOAD } from "@/constants/imageUpload"
import { Icon } from "@/components/common/Icon"
import type { ReceiptCreate, ReceiptItemCreate, ReceiptResponse } from "@/types/reports"

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

/** 금액 천 단위 콤마 포맷 */
function formatWithCommas(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

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
    // ---------- 상태 ----------
    /** GET으로 불러온 영수증 중 유지할 것만 (삭제 시 제거, 임시 저장 시 이 목록 + 새 업로드 합쳐서 전송) */
    const [keptExistingReceipts, setKeptExistingReceipts] = useState<ReceiptResponse[]>([])
    /** 세부 내역 (품목명 + 금액). 총 비용은 이 금액들의 합으로 자동 계산됨 */
    const [detailItems, setDetailItems] = useState<ReceiptItemCreate[]>([])

    /** 총 비용 = 세부 내역 금액 합계 (자동 계산, 입력 불가) */
    const computedTotal = useMemo(
        () => detailItems.reduce((sum, item) => sum + (item.price || 0), 0),
        [detailItems]
    )

    // ---------- ref: 부모가 ref로 호출할 때 항상 최신 state 참조 (클로저 스테일 방지) ----------
    const keptExistingReceiptsRef = useRef<ReceiptResponse[]>([])
    const detailItemsRef = useRef<ReceiptItemCreate[]>([])
    keptExistingReceiptsRef.current = keptExistingReceipts
    detailItemsRef.current = detailItems
    /** 최초 1회만 서버 값 반영. 임시 저장 후 refetch 시 기존 목록으로 덮어써서 삭제한 영수증이 다시 뜨는 것 방지 */
    const initialSyncDoneRef = useRef(false)

    // ---------- 기존 영수증 목록 동기화: 진입 시 1회만. refetch 시에는 덮어쓰지 않음 ----------
    useEffect(() => {
        if (existingReceipts == null) {
            initialSyncDoneRef.current = false
            setKeptExistingReceipts([])
            setDetailItems([])
            return
        }
        if (!initialSyncDoneRef.current) {
            setKeptExistingReceipts(existingReceipts)
            const firstItems = existingReceipts[0]?.items?.filter((i) => i.item_name !== "총 비용") ?? []
            setDetailItems(firstItems.map(({ item_name, price }) => ({ item_name, price })))
            initialSyncDoneRef.current = true
        }
    }, [existingReceipts?.length, existingReceipts?.map((r) => r.id).join(',')])

    // ---------- 새로 추가하는 영수증 파일 (useImageUpload). 가짜 receipt(image_url: "")가 있으면 교체 가능하도록 maxImages=1 ----------
    const hasFakeReceipt = keptExistingReceipts.some((r) => !r.image_url)
    const hasRealImageReceipt = keptExistingReceipts.some((r) => r.image_url)
    const {
        images,
        fileInputRef,
        handleImageSelect,
        handleRemoveImage,
        openFilePicker,
        uploadImages: doUploadImages,
        canAddMore,
    } = useImageUpload({
        maxImages: hasRealImageReceipt
            ? 0 // 실제 이미지가 이미 있으면 추가 불가
            : hasFakeReceipt
                ? 1 // 가짜 receipt가 있으면 교체 가능
                : IMAGE_UPLOAD.MAX_IMAGES.RECEIPTS, // 아무것도 없으면 최대 개수
        bucket: IMAGE_UPLOAD.BUCKET.REPORTS,
        pathPrefix: IMAGE_UPLOAD.PATH_PREFIX.REPORT_RECEIPTS,
    })

    /** image_url이 있는 영수증만 카운트 (빈 url은 세부 내역만 저장된 경우) */
    const receiptCountWithImage =
        keptExistingReceipts.filter((r) => r.image_url).length + images.length

    useEffect(() => {
        onImagesChange?.(images.map((img) => img.file))
    }, [images, onImagesChange])

    /** 영수증 이미지 1장 이상 + 세부 내역 합계(총 비용) > 0 시에만 제출 버튼 활성화 */
    const isReceiptChecked = receiptCountWithImage > 0 && computedTotal > 0
    useEffect(() => {
        onCheckedChange?.(isReceiptChecked)
    }, [isReceiptChecked, onCheckedChange])

    /** 기존 영수증 썸네일에서 삭제 버튼 → keptExistingReceipts에서만 제거 (다음 임시 저장 시 제외됨) */
    const handleRemoveExisting = (index: number) => {
        setKeptExistingReceipts((prev) => prev.filter((_, i) => i !== index))
    }

    const addDetailItem = () => {
        setDetailItems((prev) => [...prev, { item_name: "", price: 0 }])
    }
    const removeDetailItem = (index: number) => {
        setDetailItems((prev) => prev.filter((_, i) => i !== index))
    }
    const updateDetailItem = (index: number, patch: Partial<ReceiptItemCreate>) => {
        setDetailItems((prev) => {
            const next = [...prev]
            if (next[index]) next[index] = { ...next[index], ...patch }
            return next
        })
    }

    // ---------- ref 노출: 부모가 임시 저장 시 호출 ----------
    /** 항상 영수증 1건만 반환. 가짜 receipt(image_url: "")가 있으면 그것을 사용하고 새 이미지 URL로 교체 */
    const getReceipts = async (): Promise<ReceiptCreate[]> => {
        const existing = keptExistingReceiptsRef.current
        const newUrls = await doUploadImages()
        const totalCostNum = detailItemsRef.current.reduce((sum, i) => sum + (i.price || 0), 0)
        const detail = detailItemsRef.current.filter((i) => i.item_name.trim() !== "" || i.price > 0)
        const items: ReceiptItemCreate[] =
            totalCostNum > 0 ? [{ item_name: "총 비용", price: totalCostNum }, ...detail] : detail

        // 가짜 receipt(image_url: "")가 있으면 그것을 사용, 새 이미지 URL이 있으면 교체
        const fakeReceipt = existing.find((r) => !r.image_url)
        const realReceipt = existing.find((r) => r.image_url)
        const imageUrl = newUrls[0] ?? realReceipt?.image_url ?? fakeReceipt?.image_url ?? ""

        if (items.length === 0 && !imageUrl) return []
        // 가짜 receipt가 있으면 그 store_name 사용, 없으면 "영수증"
        const storeName = fakeReceipt?.store_name ?? realReceipt?.store_name ?? "영수증"
        return [{ store_name: storeName, image_url: imageUrl, items }]
    }

    /** 부모(ReportDetailContentYBLeader)에서 임시 저장 시 getReceipts(), getTotalCost() 호출. ref는 항상 최신 ref.current 참조 */
    useImperativeHandle(
        ref,
        () => ({
            getTotalCost: () =>
                String(detailItemsRef.current.reduce((sum, i) => sum + (i.price || 0), 0)),
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
                {keptExistingReceipts
                    .filter((receipt) => receipt.image_url)
                    .map((receipt, index) => (
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
                                onClick={() => handleRemoveExisting(keptExistingReceipts.indexOf(receipt))}
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
                    addButtonContent={
                        <div className={styles.addButtonContent}>
                            <Icon name='IconLBoldReceipt' size={24} />
                            <p className={styles.addButtonContentText}>영수증 추가</p>
                        </div>}
                />
            </div>

            {/** 총 비용 (세부 내역 합계 자동 계산, 입력 불가) */}
            <div className={styles.totalCostContainer}>
                <input
                    type="text"
                    inputMode="numeric"
                    readOnly
                    className={styles.totalCostInput}
                    placeholder="총 비용을 입력해주세요"
                    value={computedTotal === 0 ? "" : formatWithCommas(computedTotal)}
                />
                <p className={styles.totalCostLabel}>세부 내역 금액의 합계가 자동으로 반영됩니다.</p>
            </div>

            {/** 세부 내역 */}
            <div className={styles.detailSection}>
                <p className={styles.detailSectionLabel}>세부 내역</p>
                <div className={styles.detailList}>
                    {detailItems.map((item, index) => (
                        <div key={index} className={styles.detailRow}>
                            <input
                                type="text"
                                className={styles.detailItemName}
                                placeholder="내역명"
                                value={item.item_name}
                                onChange={(e) => updateDetailItem(index, { item_name: e.target.value })}
                            />
                            <input
                                type="number"
                                className={styles.detailPrice}
                                placeholder="금액"
                                value={item.price || ""}
                                onChange={(e) =>
                                    updateDetailItem(index, {
                                        price: Number(e.target.value.replace(/,/g, "")) || 0,
                                    })
                                }
                            />
                            <button
                                type="button"
                                className={styles.detailRemoveButton}
                                onClick={() => removeDetailItem(index)}
                                aria-label="삭제"
                            >
                                <Icon name="IconLLineClose" size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDetailItem}
                        className={styles.detailAddRowButton}
                    >
                        내역 추가
                    </button>
                </div>
            </div>
        </div>
    )
})

export default memo(ActivityCostReceiptInput)

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
    detailSection: cn('flex flex-col gap-2 py-4'),
    detailSectionLabel: cn('font-caption-caption1 text-grey-9'),
    detailList: cn('flex flex-col gap-2'),
    detailRow: cn(
        'flex items-center gap-2',
    ),
    detailItemName: cn(
        'min-w-0 flex-1 rounded-[12px] border border-grey-2 bg-white px-3 py-2.5',
        'font-caption-caption2 text-grey-10 placeholder:text-grey-8',
        'focus:outline-none focus:ring-1 focus:ring-primary-secondarysky focus:border-primary-secondarysky',
    ),
    detailPrice: cn(
        'w-[100px] shrink-0 rounded-[12px] border border-grey-2 bg-white px-3 py-2.5 text-right',
        'font-caption-caption2 text-grey-10 placeholder:text-grey-8',
        'focus:outline-none focus:ring-1 focus:ring-primary-secondarysky focus:border-primary-secondarysky',
    ),
    detailRemoveButton: cn(
        'flex shrink-0 items-center justify-center rounded-full p-0.5 text-grey-8',
        'hover:bg-grey-3 hover:text-grey-9',
    ),
    detailAddRowButton: cn(
        'flex items-center justify-center rounded-[16px] bg-grey-2 px-4 py-3',
        'font-caption-caption2 text-grey-8',
        'hover:bg-grey-3 active:bg-grey-4',
    ),
}