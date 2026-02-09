import { useEffect } from 'react'
import { Icon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import MonitoringCategorySelect from './MonitoringCategorySelect'
import { useAutoResize } from '@/hooks/useAutoResize'
import type { GoalCreate } from '@/types/academic'

interface MonitoringGoalItemProps {
  goalIndex: number
  goal: GoalCreate
  onGoalChange: (goal: GoalCreate) => void
  onRemove?: () => void
  canRemove?: boolean
}

export default function MonitoringGoalItem({
  goalIndex,
  goal,
  onGoalChange,
  onRemove,
  canRemove = true,
}: MonitoringGoalItemProps) {
  const { textareaRef, handleResize } = useAutoResize()
  const achievementStr =
    goal.achievement_pct != null ? String(goal.achievement_pct) : ''

  useEffect(() => {
    handleResize()
  }, [goal.content, handleResize])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onGoalChange({ ...goal, content: e.target.value })
    handleResize()
  }

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <p className={styles.title}>목표 {goalIndex}</p>
        {canRemove && (
          <button type="button" onClick={onRemove} aria-label="목표 삭제">
            <Icon name="IconLLineClose" size={20} className={styles.removeIcon} />
          </button>
        )}
      </div>
      <div className={styles.detailWrapper}>
        <MonitoringCategorySelect
          value={goal.category}
          onChange={(category) => onGoalChange({ ...goal, category })}
        />
        <textarea
          ref={textareaRef}
          placeholder="학습 내용을 입력해주세요"
          className={styles.input}
          rows={1}
          value={goal.content}
          onChange={handleContentChange}
        />
        <input
          type="number"
          min={0}
          max={100}
          placeholder="달성도 (%)"
          className={styles.input}
          value={achievementStr}
          onChange={(e) => {
            const v = e.target.value
            const num = v === '' ? null : Math.min(100, Math.max(0, Number(v)))
            onGoalChange({ ...goal, achievement_pct: num })
          }}
        />
      </div>
    </div>
  )
}

const styles = {
  container: cn('flex flex-col'),
  labelRow: cn('flex justify-between py-2 px-4'),
  title: cn('title-16 text-grey-10'),
  removeIcon: cn('text-grey-9'),
  detailWrapper: cn('flex flex-col px-4 pt-2 pb-7.5 gap-2.5'),
  input: cn(
    'px-4 py-2 border-b border-grey-2 resize-none',
    'focus:outline-none focus:ring-0 focus:border-primary-secondaryroyal',
    'placeholder:body-5 placeholder:text-grey-8 text-grey-11 body-6',
  ),
}
