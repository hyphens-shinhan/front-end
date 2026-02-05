import ParticipationPageContent from '@/components/scholarship/reports/view/ParticipationPageContent'
import { toReportMonth } from '@/utils/reports'

type SearchParams = { year?: string; month?: string; councilId?: string }

export default async function ParticipationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const year = sp?.year ? parseInt(sp.year, 10) : new Date().getFullYear()
  const month = sp?.month ? parseInt(sp.month, 10) : new Date().getMonth() + 1
  const councilId = sp?.councilId ?? ''

  return (
    <ParticipationPageContent
      year={year}
      month={toReportMonth(month)}
      councilId={councilId}
    />
  )
}
