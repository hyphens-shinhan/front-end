import FeedDetailContent from "@/components/community/feed/FeedDetailContent";

interface FeedDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
    const { id } = await params;

    return <FeedDetailContent postId={id} />;
}