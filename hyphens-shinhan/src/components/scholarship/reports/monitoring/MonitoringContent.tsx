import type { ReportMonth } from '@/services/reports'

interface MonitoringContentProps {
  year: number
  month: ReportMonth
}

export default function MonitoringContent({
  year,
  month,
}: MonitoringContentProps) {
  return (
    <div className="flex flex-col py-4 px-4 pb-40">
      <p className="text-grey-9 body-5">
        {year}년 {month}월 학업 모니터링
      </p>
      {/* TODO: 학업 모니터링 상세 콘텐츠 연동 */}
    </div>
  )
}