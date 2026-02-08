'use client'

import { ChangeEvent, ReactNode, RefObject } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

interface ImageFile {
  file: File
  preview: string
}

interface ImagePickerProps {
  /** 선택된 이미지 목록 */
  images: ImageFile[]
  /** 파일 선택 핸들러 */
  onSelect: (e: ChangeEvent<HTMLInputElement>) => void
  /** 이미지 삭제 핸들러 */
  onRemove: (index: number) => void
  /** 추가 버튼 클릭 핸들러 */
  onAdd: () => void
  /** 추가 가능 여부 */
  canAddMore: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** 파일 input ref */
  fileInputRef: RefObject<HTMLInputElement | null>
  /** 추가 버튼 내용 (기본: + 아이콘) */
  addButtonContent?: ReactNode
  /** 추가 버튼 전체 커스텀 렌더 (addButtonContent보다 우선) */
  renderAddButton?: (props: { onClick: () => void; disabled?: boolean }) => ReactNode
  /** 이미지 프리뷰 사이즈 (기본: 80) */
  size?: number
  /** 허용 파일 타입 (기본: image/*) */
  accept?: string
  /** className */
  className?: string
}

/**
 * 이미지 선택 및 미리보기 컴포넌트
 *
 * useImageUpload 훅과 함께 사용
 */
export default function ImagePicker({
  images,
  onSelect,
  onRemove,
  onAdd,
  canAddMore,
  disabled = false,
  fileInputRef,
  addButtonContent,
  renderAddButton,
  size = 80,
  accept = 'image/*',
  className,
}: ImagePickerProps) {
  const sizeStyle = { width: size, height: size }

  return (
    <div className={cn(styles.container, className)}>
      {/** 이미지 미리보기 영역 */}
      {images.map((img, index) => (
        <div key={index} className={styles.imageWrapper} style={sizeStyle}>
          <div className={styles.imageInner}>
            <Image
              src={img.preview}
              alt={`미리보기 ${index + 1}`}
              fill
              className={styles.image}
            />
          </div>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(index)}
            disabled={disabled}
          >
            <Icon name="IconLLineClose" />
          </button>
        </div>
      ))}

      {/** 이미지 추가 버튼 */}
      {canAddMore && (
        renderAddButton ? (
          renderAddButton({ onClick: onAdd, disabled })
        ) : (
          <button
            type="button"
            className={styles.addButton}
            style={sizeStyle}
            onClick={onAdd}
            disabled={disabled}
          >
            {addButtonContent ?? <Icon name="IconLLinePlus" size={20} />}
          </button>
        )
      )}

      {/** 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={onSelect}
      />
    </div>
  )
}

const styles = {
  container: cn('flex flex-row flex-wrap gap-2'),
  imageWrapper: cn('relative'),
  imageInner: cn('relative w-full h-full', 'rounded-[16px] overflow-hidden'),
  image: cn('object-cover'),
  removeButton: cn(
    'absolute -top-1 -right-1',
    'w-5 h-5',
    'flex items-center justify-center',
    'bg-grey-10 rounded-full',
    'text-white text-xs',
    'disabled:opacity-50',
  ),
  addButton: cn(
    'flex items-center justify-center',
    'bg-grey-2 rounded-[16px]',
    'text-grey-6',
    'cursor-pointer',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ),
}
