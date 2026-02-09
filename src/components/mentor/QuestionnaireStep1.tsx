'use client'

import { useState } from 'react'
import type { MentorshipRequest, MentorCategory } from '@/types/mentor'
import QuestionnaireStepFooter from './QuestionnaireStepFooter'
import { cn } from '@/utils/cn'

const CATEGORIES: { value: MentorCategory; label: string }[] = [
  { value: 'career_job_search', label: '커리어 및 취업' },
  { value: 'academic_excellence', label: '학업, 공부 관련 조언' },
  { value: 'leadership_soft_skills', label: '리더십 및 소프트 스킬' },
  { value: 'entrepreneurship_innovation', label: '창업 및 혁신' },
  { value: 'mental_health_wellness', label: '정서 상담 및 마음 살피기' },
  { value: 'financial_management', label: '투자 및 재테크' },
  { value: 'personal_development', label: '자기계발 및 취미' },
  { value: 'volunteer_community_service', label: '봉사활동 및 사회공헌' },
  { value: 'specific_major_field', label: '전공 분야' },
]

interface QuestionnaireStep1Props {
  initialData?: Partial<MentorshipRequest>
  onNext: (data: Partial<MentorshipRequest>) => void
  onBack: () => void
}

export default function QuestionnaireStep1({
  initialData,
  onNext,
  onBack,
}: QuestionnaireStep1Props) {
  const [selectedCategories, setSelectedCategories] = useState<MentorCategory[]>(
    initialData?.goalCategories ?? (initialData?.goalCategory ? [initialData.goalCategory] : [])
  )

  const toggleCategory = (category: MentorCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      onNext({
        goalCategory: selectedCategories[0],
        goalCategories: selectedCategories,
      })
    }
  }

  return (
    <div className={styles.stepLayout}>
      <div className={styles.scrollArea}>
        <div className={styles.questionBlock}>
          <h2 className={styles.questionTitle}>어떤 분야의 멘토를 찾고 계신가요?</h2>
          <p className={styles.hint}>복수 선택 가능</p>
        </div>

        <div className={styles.options}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.value)
            return (
              <label
                key={category.value}
                className={styles.optionRow}
              >
                <div
                  className={cn(
                    styles.optionCircle,
                    isSelected && styles.optionCircleSelected,
                  )}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  name="category"
                  value={category.value}
                  checked={isSelected}
                  onChange={() => toggleCategory(category.value)}
                  className="sr-only"
                />
                <span className={cn(styles.optionLabel, isSelected && styles.optionLabelSelected)}>
                  {category.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <QuestionnaireStepFooter
        onBack={onBack}
        onNext={handleNext}
        nextDisabled={selectedCategories.length === 0}
      />
    </div>
  )
}

const styles = {
  stepLayout: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  questionBlock: 'flex flex-col gap-1.5 pt-2 pb-2',
  questionTitle: 'body-5 text-grey-11',
  hint: 'body-8 text-grey-8',
  options: 'flex flex-col',
  optionRow: cn(
    'flex items-center gap-2 py-3 px-0 cursor-pointer',
    'min-h-[48px] border-b border-grey-2 last:border-b-0',
  ),
  optionCircle: cn(
    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
    'bg-grey-4 transition-colors',
  ),
  optionCircleSelected: 'bg-primary-secondaryroyal',
  optionLabel: 'body-5 text-grey-10 flex-1',
  optionLabelSelected: 'text-grey-11',
} as const
