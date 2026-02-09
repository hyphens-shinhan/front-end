'use client'

import { cn } from '@/utils/cn'
import type { GoalCreate } from '@/types/academic'
import { ACADEMIC_GOAL_CATEGORY_LABELS } from '@/constants/academicGoalCategory'

interface MonitoringGoalsSummaryProps {
  goals: GoalCreate[]
  /** 달성률 드래그로 변경 시 호출 (goalIndex: 0-based, achievementPct: 0~100) */
  onAchievementChange?: (goalIndex: number, achievementPct: number) => void
}

function clampPct(value: number): number {
  return Math.min(100, Math.max(0, value))
}

function GoalSummaryItem({
  goalIndex,
  goal,
  itemIndex,
  onAchievementChange,
}: {
  goalIndex: number
  goal: GoalCreate
  itemIndex: number
  onAchievementChange?: (goalIndex: number, achievementPct: number) => void
}) {
  const categoryLabel = ACADEMIC_GOAL_CATEGORY_LABELS[goal.category]
  const achievementPct = goal.achievement_pct ?? 0
  const isInteractive = onAchievementChange != null

  return (
    <div className={styles.card}>
      <div className={styles.goalItem}>
        <div className={styles.goalHeader}>
          <span className={styles.goalTitle}>목표 {goalIndex}</span>
          <span className={styles.dot} aria-hidden />
          <span className={styles.categoryLabel}>{categoryLabel}</span>
        </div>
        <div className={styles.goalDetail}>
          {goal.content && (
            <p className={styles.content}>{goal.content}</p>
          )}
          <p className={styles.achievement}>달성률 {achievementPct}%</p>
          {isInteractive ? (
            <div className={styles.sliderWrapper}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${clampPct(achievementPct)}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={clampPct(achievementPct)}
                onChange={(e) =>
                  onAchievementChange?.(itemIndex, clampPct(Number(e.target.value)))
                }
                className={styles.slider}
                aria-label={`목표 ${goalIndex} 달성률 조절`}
              />
            </div>
          ) : (
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${clampPct(achievementPct)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 저장 후 표시되는 학습 목표 요약 (Figma 1725-4311).
 * 목표별로 카드 하나씩 표시.
 * 목표 N · 카테고리, 내용, 달성률, 진행 바.
 */
export default function MonitoringGoalsSummary({
  goals,
  onAchievementChange,
}: MonitoringGoalsSummaryProps) {
  return (
    <div className={styles.list}>
      {goals.map((goal, index) => (
        <GoalSummaryItem
          key={index}
          goalIndex={index + 1}
          goal={goal}
          itemIndex={index}
          onAchievementChange={onAchievementChange}
        />
      ))}
    </div>
  )
}

const styles = {
  card: cn(
    'rounded-[16px] p-5',
    'bg-grey-1-1',
  ),
  list: cn('flex flex-col gap-3 mb-4'),
  goalItem: cn('flex flex-col gap-3'),
  goalHeader: cn(
    'flex flex-row items-center gap-2',
  ),
  goalTitle: cn('title-16 text-grey-10'),
  dot: cn('shrink-0 w-1 h-1 rounded-full bg-grey-7'),
  categoryLabel: cn('title-16 text-grey-10'),
  goalDetail: cn('flex flex-col gap-3'),
  content: cn('body-6 text-grey-10'),
  achievement: cn('body-6 text-grey-10'),
  progressTrack: cn(
    'w-full h-2 rounded-full overflow-hidden bg-grey-4',
  ),
  progressFill: cn(
    'h-full rounded-full bg-primary-secondaryroyal',
  ),
  sliderWrapper: cn('relative w-full h-2'),
  slider: cn(
    'absolute inset-0 w-full h-full rounded-full appearance-none cursor-pointer bg-transparent',
    '[&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2',
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-1',
    '[&::-webkit-slider-thumb]:bg-primary-secondaryroyal [&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:outline-none',
    '[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing',
    '[&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-2',
    '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-secondaryroyal [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-none [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:-mt-1',
  ),
}
