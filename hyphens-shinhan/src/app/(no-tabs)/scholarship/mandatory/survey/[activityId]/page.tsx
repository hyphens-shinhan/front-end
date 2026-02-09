import MandatoryActivityDetailContent from '@/components/scholarship/mandatory/MandatoryActivityDetailContent'

interface PageProps {
  params: Promise<{ activityId: string }>
}

/** 연간 필수 활동 – 만족도 조사(URL_REDIRECT) */
export default async function MandatorySurveyPage({ params }: PageProps) {
  const { activityId } = await params
  return <MandatoryActivityDetailContent activityId={activityId} />
}
