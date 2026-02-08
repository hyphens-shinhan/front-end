'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'
import Accordion from '@/components/common/Accordion'
import type { GoalCreate } from '@/types/academic'
import { ACADEMIC_GOAL_CATEGORY_LABELS } from '@/constants/academicGoalCategory'

interface MonitoringCategorySelectProps {
  value: GoalCreate['category']
  onChange: (category: GoalCreate['category']) => void
}

export default function MonitoringCategorySelect({
  value,
  onChange,
}: MonitoringCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const title = ACADEMIC_GOAL_CATEGORY_LABELS[value]

  return (
    <div className={styles.wrapper}>
      <Accordion
        title={title}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.accordion}
        titleColor={styles.accordionTitleColor}
      />
      {isOpen && (
        <div className={styles.categoryList}>
          {(Object.keys(ACADEMIC_GOAL_CATEGORY_LABELS) as GoalCreate['category'][]).map(
            (key) => (
              <button
                key={key}
                type="button"
                className={cn(
                  styles.categoryOption,
                  value === key && styles.categoryOptionActive,
                )}
                onClick={() => {
                  onChange(key)
                  setIsOpen(false)
                }}
              >
                {ACADEMIC_GOAL_CATEGORY_LABELS[key]}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: cn('flex flex-col'),
  accordion: cn('px-4 py-3 border border-grey-3 rounded-[16px] w-full'),
  accordionTitleColor: cn('text-grey-9'),
  categoryList: cn('flex flex-col gap-1 border border-grey-3 rounded-[16px] mt-1'),
  categoryOption: cn(
    'text-left px-4 py-3 body-5 text-grey-6 rounded-[16px]',
    'hover:bg-grey-2 focus:outline-none focus:ring-0',
  ),
  categoryOptionActive: cn('bg-grey-2 text-grey-10'),
}
