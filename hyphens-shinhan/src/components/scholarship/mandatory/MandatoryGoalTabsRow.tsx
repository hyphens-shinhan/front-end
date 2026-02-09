'use client'

import PillTabs from '@/components/common/PillTabs'
import { Icon } from '@/components/common/Icon'

interface MandatoryGoalTabsRowProps {
  tabLabels: string[]
  activeIndex: number
  onTabChange: (index: number) => void
  onAddGoal: () => void
  canAddGoal: boolean
  onRemoveGoal?: (goalIndex: number) => void
  canRemoveGoal?: boolean
}

/** 목표 탭(목표 1, 목표 2, …) + 목표 추가/삭제 */
export default function MandatoryGoalTabsRow({
  tabLabels,
  activeIndex,
  onTabChange,
  onAddGoal,
  canAddGoal,
  onRemoveGoal,
  canRemoveGoal,
}: MandatoryGoalTabsRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-2 pr-4">
      <PillTabs
        tabs={tabLabels}
        activeIndex={activeIndex}
        onChange={onTabChange}
        deletable={canRemoveGoal}
        onDelete={onRemoveGoal}
      />
      <button
        type="button"
        onClick={onAddGoal}
        disabled={!canAddGoal}
        className="flex shrink-0 items-center justify-center text-grey-9 disabled:opacity-50"
        aria-label="목표 추가"
      >
        <Icon name="IconLBoldAddCircle" size={24} />
      </button>
    </div>
  )
}
