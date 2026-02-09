import { create } from 'zustand'
import type { AcademicGoalCategory } from '@/types/mandatory'

interface GoalCategorySheetState {
  selected: AcademicGoalCategory[]
  categoryOptions: AcademicGoalCategory[]
  onToggle: ((category: AcademicGoalCategory) => void) | null
  open: (
    selected: AcademicGoalCategory[],
    categoryOptions: AcademicGoalCategory[],
    onToggle: (category: AcademicGoalCategory) => void
  ) => void
  toggle: (category: AcademicGoalCategory) => void
}

/** 목표 유형 바텀시트 전용: 선택 상태를 보관해 시트 내부에서 토글 시 UI 즉시 반영 */
export const useGoalCategorySheetStore = create<GoalCategorySheetState>(
  (set, get) => ({
    selected: [],
    categoryOptions: [],
    onToggle: null,
    open: (selected, categoryOptions, onToggle) =>
      set({ selected, categoryOptions, onToggle }),
    toggle: (category) => {
      const { selected, onToggle } = get()
      const next = selected.includes(category)
        ? selected.filter((c) => c !== category)
        : [...selected, category]
      set({ selected: next })
      onToggle?.(category)
    },
  })
)
