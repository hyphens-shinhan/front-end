'use client'

import { useState } from 'react'
import type { MentorshipRequest, MentorCategory } from '@/types/mentor'
import { cn } from '@/utils/cn'

const CATEGORIES: { value: MentorCategory; label: string }[] = [
  { value: 'career_job_search', label: '커리어 및 취업' },
  { value: 'academic_excellence', label: '학업 우수성' },
  { value: 'leadership_soft_skills', label: '리더십 및 소프트 스킬' },
  { value: 'entrepreneurship_innovation', label: '창업 및 혁신' },
  { value: 'mental_health_wellness', label: '정신 건강 및 웰빙' },
  { value: 'financial_management', label: '재무 관리' },
  { value: 'personal_development', label: '자기계발' },
  { value: 'volunteer_community_service', label: '봉사 및 지역사회' },
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
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-[20px] font-semibold text-grey-11 tracking-[-0.02em] mb-2">
        어떤 분야의 멘토를 찾고 계신가요?
      </h1>
      <p className="text-sm text-grey-7 mb-8">
        멘토링을 받고 싶은 분야를 선택해주세요. (여러 개 선택 가능)
      </p>
      <div className="space-y-0">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.value)
          return (
            <label
              key={category.value}
              className={cn(
                'flex items-center gap-4 py-4 min-h-[56px] cursor-pointer transition-colors border-b border-grey-2 last:border-b-0',
                isSelected ? 'text-primary-shinhanblue' : 'text-grey-11'
              )}
            >
              <div
                className={cn(
                  'shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors',
                  isSelected ? 'bg-primary-shinhanblue' : 'border-2 border-grey-5 bg-transparent'
                )}
              >
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
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
              <span className="text-[15px] font-medium flex-1">{category.label}</span>
            </label>
          )
        })}
      </div>
      <div className="mt-10 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleNext}
          disabled={selectedCategories.length === 0}
          className="w-full min-h-[52px] px-6 py-3 bg-primary-shinhanblue text-white text-[15px] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          다음
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 text-sm font-medium text-grey-7 hover:opacity-80 transition-opacity"
        >
          뒤로
        </button>
      </div>
    </div>
  )
}
