import dynamic from 'next/dynamic'
import EmptyContent from '@/components/common/EmptyContent'
import { EMPTY_CONTENT_MESSAGES } from '@/constants'
import { toReportMonth } from '@/utils/reports'

const ReportDetailRouter = dynamic(
  () => import('@/components/scholarship/reports/ReportDetailRouter'),
  {
    loading: () => (
      <div className="flex flex-col py-20 pb-40">
        <EmptyContent
          variant="loading"
          message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
        />
      </div>
    ),
    ssr: true,
  }
)

type SearchParams = { year?: string; month?: string; councilId?: string }

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
    <div>
      <ReportDetailRouter
        year={year}
        month={toReportMonth(month)}
        councilId={councilId}
      />
    </div>
  )
}
