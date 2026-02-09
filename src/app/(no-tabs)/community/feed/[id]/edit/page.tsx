import CreateFeed from '@/components/community/feed/CreateFeed'

interface EditFeedPageProps {
  params: Promise<{ id: string }>
}

/**
 * 게시글 수정 페이지 - CreateFeed에 postId만 넘겨 수정 모드로 사용
 */
export default async function EditFeedPage({ params }: EditFeedPageProps) {
  const { id } = await params
  return <CreateFeed postId={id} />
}
