'use client'

import { cn } from '@/utils/cn'
import { Icon } from '@/components/common/Icon'
import { useBottomSheetStore } from '@/stores'
import { useGoalCategorySheetStore } from '@/stores/useGoalCategorySheetStore'
import { ACADEMIC_GOAL_CATEGORY_LABELS } from '@/constants/academicGoalCategory'
import type { AcademicGoalCategory } from '@/types/mandatory'

interface CategoryChipItem {
  index: number
  category: AcademicGoalCategory
}

interface MandatoryGoalCategorySectionProps {
  categoryOptions: AcademicGoalCategory[]
  /** 현재 목표에 선택된 유형 (바텀시트 체크 표시용) */
  selectedCategoriesForCurrentGoal: AcademicGoalCategory[]
  selectedChips: CategoryChipItem[]
  onToggleCategory: (category: AcademicGoalCategory) => void
  onRemoveChip: (goalIndex: number, category: AcademicGoalCategory) => void
}

/** 바텀시트 내부 리스트 – store 구독으로 토글 시 체크 표시 즉시 반영 */
function GoalCategorySheetContent() {
  const { selected, categoryOptions, toggle } = useGoalCategorySheetStore()
  return (
    <div className={styles.sheetContainer}>
      {categoryOptions.map((cat) => {
        const isSelected = selected.includes(cat)
        return (
          <button
            key={cat}
            type="button"
            className={styles.sheetButton}
            onClick={() => toggle(cat)}
          >
            <p
              className={cn(
                styles.sheetLabel,
                isSelected && styles.sheetLabelSelected
              )}
            >
              {ACADEMIC_GOAL_CATEGORY_LABELS[cat as keyof typeof ACADEMIC_GOAL_CATEGORY_LABELS] ?? cat}
            </p>
            <Icon
              name="IconLBoldTickCircle"
              className={isSelected ? styles.sheetIconSelected : styles.sheetIcon}
            />
          </button>
        )
      })}
    </div>
  )
}

/** 목표 유형 아코디언 클릭 시 바텀시트에서 선택(다중 선택), 익명/실명 바텀시트와 동일 디자인 */
export default function MandatoryGoalCategorySection({
  categoryOptions,
  selectedCategoriesForCurrentGoal,
  selectedChips,
  onToggleCategory,
  onRemoveChip,
}: MandatoryGoalCategorySectionProps) {
  const onOpen = useBottomSheetStore((s) => s.onOpen)
  const isSheetOpen = useBottomSheetStore((s) => s.isOpen)

  const openCategorySheet = () => {
    useGoalCategorySheetStore.getState().open(
      selectedCategoriesForCurrentGoal,
      categoryOptions,
      onToggleCategory
    )
    onOpen({
      closeOnOverlayClick: true,
      content: <GoalCategorySheetContent />,
    })
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <button
        type="button"
        onClick={openCategorySheet}
        className={styles.accordionButton}
      >
        <span>목표 유형</span>
        <Icon
          name="IconLLineArrowDown"
          className={cn('transition-transform', isSheetOpen && '-rotate-180')}
        />
      </button>
      <div className="flex flex-wrap gap-3">
        {selectedChips.map(({ index, category }) => (
          <span
            key={`${index}-${category}`}
            className={styles.chip}
          >
            {ACADEMIC_GOAL_CATEGORY_LABELS[category as keyof typeof ACADEMIC_GOAL_CATEGORY_LABELS] ?? category}
            <button
              type="button"
              onClick={() => onRemoveChip(index, category)}
              className={styles.chipClose}
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

const styles = {
  accordionButton: cn(
    'flex w-full items-center justify-between rounded-[16px] border border-grey-2 bg-white px-4 py-2',
    'body-5 text-grey-9'
  ),
  /** Figma 1809-3591: 칩 – row, gap 4px, padding 8px 12px, bg #E6F2FF, body-7, 16px radius */
  chip: cn(
    'inline-flex items-center gap-1 rounded-[16px] bg-primary-lighter px-3 py-2',
    'body-7 text-grey-10'
  ),
  chipClose: cn(
    'flex items-center justify-center rounded p-0.5 text-grey-9 hover:bg-white/30',
  ),
  /** 익명/실명 바텀시트(SelectableOption)와 동일 */
  sheetContainer: 'flex flex-col gap-1.5',
  sheetButton: 'flex items-center justify-between py-1',
  sheetLabel: 'body-5 text-grey-7',
  sheetLabelSelected: 'text-grey-11',
  sheetIcon: 'text-grey-5',
  sheetIconSelected: 'text-primary-shinhanblue',
}
