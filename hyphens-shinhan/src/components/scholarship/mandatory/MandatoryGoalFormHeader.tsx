'use client'

import ReportTitle from '@/components/scholarship/reports/ReportTitle'

/** 학업 계획서 폼 상단 헤더 (제목 + 캡션) */
export default function MandatoryGoalFormHeader() {
  return (
    <div className="flex flex-col gap-1.5 px-4 py-4">
      <ReportTitle title='학습 목표를 설정해주세요' className='py-0' />
      <p className="font-caption-caption4 text-grey-8">
        최소 2개의 목표가 필요해요
      </p>
    </div>
  )
}
