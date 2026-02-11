'use client'

import { useState, useEffect } from 'react'
import type { MentorshipRequest, MentorCategory } from '@/types/mentor'
import SelectableOptionRow from './SelectableOptionRow'
import QuestionnaireQuestionBlock from './QuestionnaireQuestionBlock'

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
  onFooterChange?: (state: { nextLabel: string; nextDisabled: boolean }) => void
  onRegisterNext?: (fn: () => void) => void
  onSave?: (data: Partial<MentorshipRequest>) => void
  onRegisterSave?: (fn: () => void) => void
}

export default function QuestionnaireStep1({
  initialData,
  onNext,
  onBack,
  onFooterChange,
  onRegisterNext,
  onSave,
  onRegisterSave,
}: QuestionnaireStep1Props) {
  const [selectedCategories, setSelectedCategories] = useState<MentorCategory[]>(
    initialData?.goalCategories ?? (initialData?.goalCategory ? [initialData.goalCategory] : [])
  )

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      onNext({
        goalCategory: selectedCategories[0],
        goalCategories: selectedCategories,
      })
    }
  }

  useEffect(() => {
    onFooterChange?.({
      nextLabel: '다음',
      nextDisabled: selectedCategories.length === 0,
    })
    onRegisterNext?.(handleNext)
    onRegisterSave?.(() => {
      if (selectedCategories.length > 0) {
        onSave?.({ goalCategory: selectedCategories[0], goalCategories: selectedCategories })
      }
    })
  }, [selectedCategories, onFooterChange, onRegisterNext, onRegisterSave, onSave])

  const toggleCategory = (category: MentorCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <div className={styles.stepLayout}>
      <div className={styles.scrollArea}>
        <QuestionnaireQuestionBlock
          title="어떤 분야의 멘토를 찾고 계신가요?"
          hint="복수 선택 가능"
        />

        <div className={styles.options}>
          {CATEGORIES.map((category) => (
            <SelectableOptionRow
              key={category.value}
              value={category.value}
              label={category.label}
              selected={selectedCategories.includes(category.value)}
              onToggle={() => toggleCategory(category.value)}
              name="category"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  stepLayout: 'flex flex-col flex-1 min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  options: 'flex flex-col',
} as const
