import MandatoryCampContent from '@/components/scholarship/mandatory/MandatoryCampContent'

interface PageProps {
  params: Promise<{ activityId: string }>
}

/** 연간 필수 활동 – 장학캠프(SIMPLE_REPORT) */
export default async function MandatoryCampPage({ params }: PageProps) {
  const { activityId } = await params
  return <MandatoryCampContent activityId={activityId} />
}
