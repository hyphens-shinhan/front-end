import ReportDetailRouter from '@/components/scholarship/reports/ReportDetailRouter'
import { toReportMonth } from '@/utils/reports'

type SearchParams = { year?: string; month?: string }

export default async function ScholarshipReportDetailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const year = sp?.year ? parseInt(sp.year, 10) : new Date().getFullYear()
  const month = sp?.month ? parseInt(sp.month, 10) : new Date().getMonth() + 1

  return (
    <div>
      <ReportDetailRouter year={year} month={toReportMonth(month)} />
    </div>
  )
}
