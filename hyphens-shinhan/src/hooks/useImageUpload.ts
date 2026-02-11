'use client'

import { useState, useRef, ChangeEvent, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { IMAGE_UPLOAD } from '@/constants/imageUpload'

interface ImageFile {
  file: File
  preview: string
}

interface UseImageUploadOptions {
  /** 최대 이미지 개수 (기본값: 5) */
  maxImages?: number
  /** Supabase Storage 버킷 이름 (기본값: 'images') */
  bucket?: string
  /** 저장 경로 접두사 (기본값: 'uploads') */
  pathPrefix?: string
}

interface UseImageUploadReturn {
  /** 선택된 이미지 목록 (파일 + 미리보기 URL) */
  images: ImageFile[]
  /** 업로드 중 여부 */
  isUploading: boolean
  /** 파일 input ref */
  fileInputRef: React.RefObject<HTMLInputElement | null>
  /** 파일 선택 핸들러 (input onChange에 연결) */
  handleImageSelect: (e: ChangeEvent<HTMLInputElement>) => void
  /** 이미지 삭제 핸들러 */
  handleRemoveImage: (index: number) => void
  /** 파일 input 클릭 트리거 */
  openFilePicker: () => void
  /** Supabase에 이미지 업로드 후 URL 배열 반환 */
  uploadImages: () => Promise<string[]>
  /** 이미지 초기화 */
  clearImages: () => void
  /** 추가 가능 여부 */
  canAddMore: boolean
}

/**
 * 이미지 선택 및 Supabase Storage 업로드 훅
 */
export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    maxImages = IMAGE_UPLOAD.MAX_IMAGES.ACTIVITY_PHOTOS,
    bucket = IMAGE_UPLOAD.BUCKET.REPORTS,
    pathPrefix = IMAGE_UPLOAD.PATH_PREFIX.REPORT_PHOTOS,
  } = options

  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // ─────────────────────────────────────────────────────────────
  // 파일 선택 핸들러
  // ─────────────────────────────────────────────────────────────
  const handleImageSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      const remainingSlots = maxImages - images.length
      const filesToAdd = Array.from(files).slice(0, remainingSlots)

      const newImages = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))

      setImages((prev) => [...prev, ...newImages])

      // input 초기화 (같은 파일 다시 선택 가능하도록)
      e.target.value = ''
    },
    [images.length, maxImages],
  )

  // ─────────────────────────────────────────────────────────────
  // 이미지 삭제 핸들러
  // ─────────────────────────────────────────────────────────────
  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }, [])

  // ─────────────────────────────────────────────────────────────
  // 파일 선택창 열기
  // ─────────────────────────────────────────────────────────────
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // ─────────────────────────────────────────────────────────────
  // Supabase Storage에 업로드 (여러 장일 때 병렬로 요청해 체감 속도 개선)
  // ─────────────────────────────────────────────────────────────
  const uploadImages = useCallback(async (): Promise<string[]> => {
    if (images.length === 0) return []

    setIsUploading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    try {
      const uploadedUrls = await Promise.all(
        images.map(async ({ file }) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName

          const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

          if (error) {
            console.error('이미지 업로드 실패:', error)
            throw new Error(`이미지 업로드 실패: ${error.message}`)
          }

          return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`
        }),
      )

      return uploadedUrls
    } finally {
      setIsUploading(false)
    }
  }, [images, bucket, pathPrefix, supabase.storage])

  // ─────────────────────────────────────────────────────────────
  // 이미지 초기화
  // ─────────────────────────────────────────────────────────────
  const clearImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
  }, [images])

  return {
    images,
    isUploading,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    openFilePicker,
    uploadImages,
    clearImages,
    canAddMore: images.length < maxImages,
  }
}
