'use client'

import { cn } from '@/utils/cn'
import { Icon } from '@/components/common/Icon'
import { ACADEMIC_GOAL_CATEGORY_LABELS } from '@/constants/academicGoalCategory'
import type { AcademicGoalCategory } from '@/types/mandatory'

interface CategoryChipItem {
  index: number
  category: AcademicGoalCategory
}

interface MandatoryGoalCategorySectionProps {
  isOpen: boolean
  onToggle: () => void
  categoryOptions: AcademicGoalCategory[]
  selectedChips: CategoryChipItem[]
  onSelectCategory: (category: AcademicGoalCategory) => void
  onRemoveChip: (goalIndex: number) => void
}

/** 목표 유형 아코디언 + 카테고리 선택 버튼 + 선택된 칩 */
export default function MandatoryGoalCategorySection({
  isOpen,
  onToggle,
  categoryOptions,
  selectedChips,
  onSelectCategory,
  onRemoveChip,
}: MandatoryGoalCategorySectionProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between rounded-[16px] border border-grey-2 bg-white px-4 py-2',
          'body-5 text-grey-9'
        )}
      >
        <span>목표 유형</span>
        <Icon
          name="IconLLineArrowDown"
          className={cn('transition-transform', isOpen && '-rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="flex flex-wrap gap-3 py-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className="body-7 rounded-full bg-primary-secondarysky px-3 py-2 text-grey-10"
            >
              {ACADEMIC_GOAL_CATEGORY_LABELS[cat as keyof typeof ACADEMIC_GOAL_CATEGORY_LABELS] ?? cat}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {selectedChips.map(({ index, category }) => (
          <span
            key={`${index}-${category}`}
            className="inline-flex items-center gap-1 rounded-full bg-primary-secondarysky px-3 py-2 body-7 text-grey-10"
          >
            {ACADEMIC_GOAL_CATEGORY_LABELS[category as keyof typeof ACADEMIC_GOAL_CATEGORY_LABELS] ?? category}
            <button
              type="button"
              onClick={() => onRemoveChip(index)}
              className="flex items-center justify-center rounded p-0.5 text-grey-9 hover:bg-white/50"
              aria-label="제거"
            >
              <Icon name="IconMLineClose" size={20} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
