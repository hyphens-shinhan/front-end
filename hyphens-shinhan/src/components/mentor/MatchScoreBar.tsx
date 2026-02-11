'use client'

import type { MatchScore } from '@/types/mentor'
import { getMatchQualityLabel } from '@/services/mentor-matching'
import { cn } from '@/utils/cn'

interface MatchScoreBarProps {
  score: MatchScore
  showBreakdown?: boolean
}

export default function MatchScoreBar({
  score,
  showBreakdown = false,
}: MatchScoreBarProps) {
  const quality = getMatchQualityLabel(score.total)

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'text-[15px] font-semibold tabular-nums shrink-0',
            'text-grey-11'
          )}
        >
          {score.total}
        </span>
        <div className="flex-1 min-w-0 h-[3px] bg-grey-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-shinhanblue rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(score.total, 100)}%` }}
          />
        </div>
        <span className="text-[13px] text-grey-7 shrink-0">{quality.label}</span>
      </div>
      {showBreakdown && (
        <div className="pt-3 mt-3 border-t border-grey-2 space-y-1 text-[12px] text-grey-7">
          <div className="flex justify-between">
            <span>분야</span>
            <span>{score.category}/40</span>
          </div>
          <div className="flex justify-between">
            <span>목표</span>
            <span>{score.goalAlignment}/25</span>
          </div>
          <div className="flex justify-between">
            <span>시간</span>
            <span>{score.availability}/20</span>
          </div>
          <div className="flex justify-between">
            <span>성격</span>
            <span>{score.personality}/10</span>
          </div>
          <div className="flex justify-between">
            <span>보너스</span>
            <span>{score.bonus}/5</span>
          </div>
        </div>
      )}
    </div>
  )
}
