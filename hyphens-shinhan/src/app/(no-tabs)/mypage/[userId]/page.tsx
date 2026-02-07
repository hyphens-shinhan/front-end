import PublicProfileContent from '@/components/mypage/PublicProfileContent'

interface PublicProfilePageProps {
  params: Promise<{ userId: string }>
}

/** 다른 유저의 퍼블릭 프로필 페이지 */
export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params

  return <PublicProfileContent userId={userId} />
}
