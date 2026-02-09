'use client'

import type { RefObject } from 'react'
import { cn } from '@/utils/cn'

interface MandatoryGoalTextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  caption: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onResize: () => void
  rows?: number
}

/** 학업 계획서용 텍스트 영역 필드 (라벨 + textarea + 캡션, useAutoResize 연동) */
export default function MandatoryGoalTextareaField({
  label,
  value,
  onChange,
  placeholder,
  caption,
  textareaRef,
  onResize,
  rows = 1,
}: MandatoryGoalTextareaFieldProps) {
  return (
    <div className="flex flex-col gap-2 px-4 pt-3 pb-5">
      <p className="body-5 text-grey-10">{label}</p>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={onResize}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full resize-none rounded-[16px] border border-grey-2 px-4 py-3',
          'placeholder:body-5 placeholder:text-grey-8',
          'body-6 text-grey-10 focus:outline-none focus:ring-1 focus:ring-primary-secondarysky scrollbar-hide'
        )}
      />
      <p className="font-caption-caption4 text-grey-8">&nbsp;&nbsp;&nbsp;{caption}</p>
    </div>
  )
}
