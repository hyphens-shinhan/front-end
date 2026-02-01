import NoticeDetailContent from "@/components/community/shinhan-notice/NoticeDetailContent";

interface NoticeDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
    const { id } = await params;

    return <NoticeDetailContent noticeId={id} />;
}
