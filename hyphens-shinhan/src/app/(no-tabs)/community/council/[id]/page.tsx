import CouncilReportDetailContent from "@/components/community/council/CouncilReportDetailContent";

interface CouncilReportDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function CouncilReportDetailPage({ params }: CouncilReportDetailPageProps) {
    const { id } = await params;

    return <CouncilReportDetailContent postId={id} />;
}
