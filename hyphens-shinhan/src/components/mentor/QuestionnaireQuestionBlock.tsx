'use client'

import { cn } from '@/utils/cn'

interface QuestionnaireQuestionBlockProps {
  /** 질문 제목 */
  title: string
  /** 보조 설명 (선택) */
  hint?: string
  /** 제목 스타일: default(body-5) | large(title-16 font-semibold) */
  titleVariant?: 'default' | 'large'
  className?: string
}

/** 설문 각 스텝에서 공통으로 쓰는 질문 블록 (제목 + 힌트) */
export default function QuestionnaireQuestionBlock({
  title,
  hint,
  titleVariant = 'default',
  className,
}: QuestionnaireQuestionBlockProps) {
  return (
    <div className={cn(styles.block, className)}>
      <h2 className={titleVariant === 'large' ? styles.titleLarge : styles.titleDefault}>
        {title}
      </h2>
      {hint != null && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

const styles = {
  block: 'flex flex-col gap-1.5 py-2',
  titleDefault: 'body-5 text-grey-11',
  titleLarge: 'title-16 text-grey-11 font-semibold',
  hint: 'body-8 text-grey-8',
} as const
