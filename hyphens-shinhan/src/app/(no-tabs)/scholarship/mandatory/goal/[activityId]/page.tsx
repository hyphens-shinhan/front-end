import MandatoryGoalContent from '@/components/scholarship/mandatory/MandatoryGoalContent'

interface PageProps {
  params: Promise<{ activityId: string }>
}

/** 연간 필수 활동 – 학업 계획서 제출(GOAL) */
export default async function MandatoryGoalPage({ params }: PageProps) {
  const { activityId } = await params
  return <MandatoryGoalContent activityId={activityId} />
}
