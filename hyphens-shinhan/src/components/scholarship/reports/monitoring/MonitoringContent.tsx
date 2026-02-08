'use client'

import { useRef, useState } from 'react'
import MonitoringGoalHeader from './MonitoringGoalHeader'
import MonitoringGoalItem from './MonitoringGoalItem'
import MonitoringPeriodNotice from './MonitoringPeriodNotice'
import type { ReportMonth } from '@/services/reports'
import MonitoringEvidenceUpload from './MonitoringEvidenceUpload'
import BottomFixedButton from '@/components/common/BottomFixedButton'

interface MonitoringContentProps {
  year: number
  month: ReportMonth
}

export default function MonitoringContent({
  year,
  month,
}: MonitoringContentProps) {
  const [goalIds, setGoalIds] = useState<number[]>([0])
  const nextIdRef = useRef(1)

  const handleAddGoal = () => {
    setGoalIds((prev) => [...prev, nextIdRef.current++])
  }

  const handleRemoveGoal = (id: number) => {
    setGoalIds((prev) => prev.filter((goalId) => goalId !== id))
  }

  return (
    <div className="flex flex-col py-4 pb-40">
      {/** 상단 안내 문구 */}
      <MonitoringPeriodNotice />

      {/** 학습 목표 추가/수정 섹션 */}
      <MonitoringGoalHeader onAddGoal={handleAddGoal} />

      {/** 학습 목표 리스트 */}
      <div className="flex flex-col">
        {goalIds.map((id, index) => (
          <MonitoringGoalItem
            key={id}
            goalIndex={index + 1}
            onRemove={() => handleRemoveGoal(id)}
          />
        ))}
      </div>

      {/** 증빙자료 업로드 섹션 */}
      <MonitoringEvidenceUpload />

      {/** (저장하기, 수정하기) / (제출하기) 버튼 영역 */}
      <BottomFixedButton
        label='제출하기'
        size='L'
        type='primary'
        onClick={() => { }}
        secondLabel='저장하기'
        secondType='secondary'
        secondDisabled={false}
        onSecondClick={() => { }}
      />
    </div>
  )
}