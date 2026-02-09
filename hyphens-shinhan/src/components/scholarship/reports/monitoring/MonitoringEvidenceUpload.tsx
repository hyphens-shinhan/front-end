'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import ReportTitle from '../ReportTitle'
import MonitoringEvidenceUploadItem from './MonitoringEvidenceUploadItem'
import { useImageUpload } from '@/hooks/useImageUpload'

const CAPTION_TEXT =
  '오답노트, 스터디노트, 강의 수강내역, 과제물 등 목표 달성을 증명할 수 있는 자료를 자유롭게 올려주세요 (PDF, JPG, PNG 최대 10MB)'

interface MonitoringEvidenceUploadProps {
  evidenceUrls: string[]
  onEvidenceUrlsChange: React.Dispatch<React.SetStateAction<string[]>>
  /** 증빙자료 1개 이상 업로드 완료 여부 (체크 표시) */
  isChecked?: boolean
  /** true면 업로드 버튼만 숨김 (저장된 요약 화면에서 사용) */
  hideUploadButton?: boolean
}

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    const segment = path.split('/').pop() ?? ''
    return segment || '첨부파일'
  } catch {
    return '첨부파일'
  }
}

export default function MonitoringEvidenceUpload({
  evidenceUrls,
  onEvidenceUrlsChange,
  isChecked = false,
  hideUploadButton = false,
}: MonitoringEvidenceUploadProps) {
  const {
    images,
    isUploading,
    fileInputRef,
    handleImageSelect,
    openFilePicker,
    uploadImages,
    clearImages,
    canAddMore,
  } = useImageUpload({ maxImages: 10 })

  const prevImagesLenRef = useRef(0)

  useEffect(() => {
    if (images.length === 0 || images.length <= prevImagesLenRef.current) {
      prevImagesLenRef.current = images.length
      return
    }
    prevImagesLenRef.current = images.length
    let cancelled = false
    uploadImages().then((urls) => {
      if (!cancelled && urls.length > 0) {
        onEvidenceUrlsChange((prev) => [...prev, ...urls])
        clearImages()
      }
    })
    return () => {
      cancelled = true
    }
  }, [images.length])

  const handleRemove = (index: number) => {
    onEvidenceUrlsChange(evidenceUrls.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelWrapper}>
        <ReportTitle
          title="증빙자료를 업로드해주세요"
          checkIcon={!hideUploadButton}
          isChecked={isChecked}
          className="py-0"
        />
        <p className={styles.caption}>{CAPTION_TEXT}</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.uploadedList}>
          {evidenceUrls.map((url, index) => (
            <MonitoringEvidenceUploadItem
              key={url}
              fileName={fileNameFromUrl(url)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>

        {!hideUploadButton && (
          <>
            <input
              ref={fileInputRef as React.RefObject<HTMLInputElement>}
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              aria-hidden
              onChange={handleImageSelect}
              multiple
            />
            <button
              type="button"
              className={styles.uploadZone}
              onClick={openFilePicker}
              disabled={!canAddMore || isUploading}
            >
              <Icon name="IconLBoldFolderAdd" size={24} className={styles.uploadIcon} />
              <p className={styles.uploadLabel}>
                {isUploading ? '업로드 중...' : '자료 업로드'}
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: cn('flex flex-col px-4 pt-6 gap-5.5'),
  labelWrapper: cn('flex flex-col gap-1.5'),
  caption: cn('font-caption-caption4 text-grey-8 break-keep'),
  contentWrapper: cn('flex flex-col gap-2'),
  uploadZone: cn(
    'flex items-center justify-center gap-2.5',
    'border border-dashed border-grey-6 rounded-[16px] px-4 py-3',
  ),
  uploadIcon: cn('text-grey-9'),
  uploadLabel: cn('font-caption-caption5 text-grey-9'),
  uploadedList: cn('flex flex-col gap-2.5'),
}