import { toReportMonth } from '@/utils/reports'
import ActivityDetailTabs from '@/components/scholarship/ActivityDetailTabs'

type SearchParams = {
  year?: string
  month?: string
  councilId?: string
  tab?: string
}

export default async function ScholarshipReportDetailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const year = sp?.year ? parseInt(sp.year, 10) : new Date().getFullYear()
  const month = sp?.month ? parseInt(sp.month, 10) : new Date().getMonth() + 1
  const councilId = sp?.councilId ?? ''

  return (
    <div className="flex flex-col h-full">
      <ActivityDetailTabs
        year={year}
        month={toReportMonth(month)}
        councilId={councilId}
      />
    </div>
  )
}
